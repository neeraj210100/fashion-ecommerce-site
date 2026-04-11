package com.fashion.ecommerce.repository;

import com.fashion.ecommerce.domain.CustomerOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    @EntityGraph(attributePaths = {"lines", "lines.product"})
    List<CustomerOrder> findByUser_IdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"lines", "lines.product"})
    Optional<CustomerOrder> findByIdAndUser_Id(Long id, Long userId);

    @EntityGraph(attributePaths = {"lines", "lines.product"})
    Optional<CustomerOrder> findByRazorpayOrderId(String razorpayOrderId);
}
