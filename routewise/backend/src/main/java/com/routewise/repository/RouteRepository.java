package com.routewise.repository;

import com.routewise.entity.Route;
import com.routewise.entity.enums.RouteStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RouteRepository extends JpaRepository<Route, UUID> {

    Optional<Route> findByIdAndUserId(UUID id, UUID userId);

    List<Route> findTop5ByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, RouteStatus status);

    /**
     * Sorting is supplied via the Pageable's Sort (built in the service layer)
     * so this stays a single, portable query regardless of sort field.
     */
    @Query("""
            select r from Route r
            where r.user.id = :userId
            and (:status is null or r.status = :status)
            and (:search is null or lower(r.name) like lower(concat('%', :search, '%')))
            """)
    Page<Route> search(@Param("userId") UUID userId,
                        @Param("status") RouteStatus status,
                        @Param("search") String search,
                        Pageable pageable);

    List<Route> findByUserIdAndStatusAndCompletedAtBetween(UUID userId, RouteStatus status, Instant from, Instant to);

    List<Route> findByUserIdAndCreatedAtBetween(UUID userId, Instant from, Instant to);
}
