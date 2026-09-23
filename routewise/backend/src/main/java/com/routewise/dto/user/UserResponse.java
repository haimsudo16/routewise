package com.routewise.dto.user;

import com.routewise.entity.enums.DistanceUnit;
import com.routewise.entity.enums.TimeFormat;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        DistanceUnit distanceUnit,
        TimeFormat timeFormat,
        Instant createdAt
) {
}
