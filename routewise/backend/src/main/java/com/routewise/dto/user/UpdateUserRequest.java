package com.routewise.dto.user;

import com.routewise.entity.enums.DistanceUnit;
import com.routewise.entity.enums.TimeFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120)
        String fullName,

        DistanceUnit distanceUnit,

        TimeFormat timeFormat
) {
}
