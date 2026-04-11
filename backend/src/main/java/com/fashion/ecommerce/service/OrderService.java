package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CheckoutRequest;
import com.fashion.ecommerce.dto.OrderDto;
import com.fashion.ecommerce.dto.OrderLineDto;
import com.fashion.ecommerce.dto.PaymentVerifyRequest;
import com.fashion.ecommerce.domain.Cart;
import com.fashion.ecommerce.domain.CartItem;
import com.fashion.ecommerce.domain.CustomerOrder;
import com.fashion.ecommerce.domain.OrderLine;
import com.fashion.ecommerce.domain.OrderStatus;
import com.fashion.ecommerce.domain.Product;
import com.fashion.ecommerce.domain.User;
import com.fashion.ecommerce.exception.BadRequestException;
import com.fashion.ecommerce.exception.NotFoundException;
import com.fashion.ecommerce.repository.CartRepository;
import com.fashion.ecommerce.repository.OrderRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            PaymentService paymentService
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public OrderDto checkout(Long userId, CheckoutRequest req) {
        Cart cart = cartRepository.findByUser_IdAndActiveTrue(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        BigDecimal total = BigDecimal.ZERO;
        List<OrderLine> lines = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            Product p = productRepository.findById(ci.getProduct().getId())
                    .orElseThrow(() -> new NotFoundException("Product not found"));
            if (p.getStock() < ci.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + p.getName());
            }
            BigDecimal lineAmount = p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(lineAmount);
            lines.add(OrderLine.builder()
                    .product(p)
                    .productName(p.getName())
                    .quantity(ci.getQuantity())
                    .unitPrice(p.getPrice())
                    .build());
        }
        CustomerOrder order = CustomerOrder.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(total)
                .shippingName(req.shippingName().trim())
                .shippingLine1(req.shippingLine1().trim())
                .shippingLine2(req.shippingLine2() != null ? req.shippingLine2().trim() : null)
                .shippingCity(req.shippingCity().trim())
                .shippingPostalCode(req.shippingPostalCode().trim())
                .shippingCountry(req.shippingCountry().trim())
                .createdAt(Instant.now())
                .lines(new ArrayList<>())
                .build();
        for (OrderLine ol : lines) {
            ol.setOrder(order);
            order.getLines().add(ol);
        }
        order = orderRepository.save(order);
        for (CartItem ci : cart.getItems()) {
            Product p = productRepository.findById(ci.getProduct().getId())
                    .orElseThrow(() -> new NotFoundException("Product not found"));
            p.setStock(p.getStock() - ci.getQuantity());
            productRepository.save(p);
        }

        String rzpOrderId = paymentService.createRazorpayOrder(total, order.getOrderNumber());
        order.setRazorpayOrderId(rzpOrderId);
        order = orderRepository.save(order);

        return toDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> listForUser(Long userId) {
        return orderRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public OrderDto getForUser(Long userId, Long orderId) {
        return orderRepository.findByIdAndUser_Id(orderId, userId).map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Order not found"));
    }

    @Transactional
    public OrderDto verifyPayment(Long userId, PaymentVerifyRequest req) {
        CustomerOrder order = orderRepository.findByRazorpayOrderId(req.razorpayOrderId())
                .orElseThrow(() -> new NotFoundException("Order not found for Razorpay order ID"));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to current user");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order is not in PENDING state");
        }

        if (!paymentService.verifySignature(req.razorpayOrderId(), req.razorpayPaymentId(), req.razorpaySignature())) {
            throw new BadRequestException("Invalid payment signature");
        }

        order.setRazorpayPaymentId(req.razorpayPaymentId());
        order.setStatus(OrderStatus.PAID);
        order = orderRepository.save(order);

        return toDto(order);
    }

    @Transactional
    public OrderDto cancel(Long userId, Long orderId) {
        CustomerOrder order = orderRepository.findByIdAndUser_Id(orderId, userId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending orders can be cancelled; current status is " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);

        for (OrderLine line : order.getLines()) {
            Product product = productRepository.findById(line.getProduct().getId())
                    .orElseThrow(() -> new NotFoundException("Product not found"));
            product.setStock(product.getStock() + line.getQuantity());
            productRepository.save(product);
        }

        return toDto(orderRepository.save(order));
    }

    private OrderDto toDto(CustomerOrder o) {
        List<OrderLineDto> lineDtos = o.getLines().stream().map(l -> {
            BigDecimal lt = l.getUnitPrice().multiply(BigDecimal.valueOf(l.getQuantity()));
            return new OrderLineDto(l.getProductName(), l.getQuantity(), l.getUnitPrice(), lt);
        }).toList();
        return new OrderDto(
                o.getId(),
                o.getOrderNumber(),
                o.getStatus(),
                o.getTotalAmount(),
                o.getShippingName(),
                o.getShippingLine1(),
                o.getShippingLine2(),
                o.getShippingCity(),
                o.getShippingPostalCode(),
                o.getShippingCountry(),
                o.getCreatedAt(),
                o.getRazorpayOrderId(),
                lineDtos
        );
    }
}
