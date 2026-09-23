package com.routewise.dto.route;

import com.routewise.entity.enums.Priority;
import com.routewise.entity.enums.StopStatus;
import com.routewise.entity.enums.StopType;

import java.time.Instant;
import java.util.UUID;

public record StopResponse(
        UUID id,
        String label,
        String formattedAddress,
        Double latitude,
        Double longitude,
        Integer sequenceOrder,
        StopType stopType,
        Priority priority,
        StopStatus status,
        String notes,
        Instant completedAt
) {
}
