package com.routewise.repository;

import com.routewise.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Vehicle> findByIdAndUserId(UUID id, UUID userId);
    Optional<Vehicle> findFirstByUserIdAndIsDefaultTrue(UUID userId);
}
