package com.routewise.repository;

import com.routewise.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StopRepository extends JpaRepository<Stop, UUID> {
    Optional<Stop> findByIdAndRouteUserId(UUID id, UUID userId);
}
