package com.routewise.dto.route;

import com.routewise.entity.enums.Priority;
import com.routewise.entity.enums.StopType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StopRequest(
        @NotBlank(message = "Stop label is required")
        String label,

        @NotBlank(message = "Formatted address is required")
        String formattedAddress,

        @NotNull(message = "Latitude is required")
        Double latitude,

        @NotNull(message = "Longitude is required")
        Double longitude,

        StopType stopType,

        Priority priority,

        String notes
) {
}
