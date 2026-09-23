package com.routewise.dto.route;

import com.routewise.entity.enums.RouteStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RouteResponse(
        UUID id,
        String name,
        RouteStatus status,
        BigDecimal distanceKm,
        Integer durationMinutes,
        BigDecimal originalDistanceKm,
        Integer originalDurationMinutes,
        BigDecimal distanceSavedKm,
        Integer timeSavedMinutes,
        BigDecimal fuelUsedLitres,
        BigDecimal fuelCost,
        UUID vehicleId,
        String vehicleName,
        Instant startedAt,
        Instant completedAt,
        Instant createdAt,
        List<StopResponse> stops,
        int completedStopCount,
        int totalStopCount
) {
}
