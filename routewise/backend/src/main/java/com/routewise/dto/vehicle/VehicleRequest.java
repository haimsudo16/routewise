package com.routewise.dto.vehicle;

import com.routewise.entity.enums.FuelType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VehicleRequest(
        @NotBlank(message = "Vehicle name is required")
        String name,

        @NotNull(message = "Fuel type is required")
        FuelType fuelType,

        @NotNull(message = "Fuel efficiency is required")
        @DecimalMin(value = "0.1", message = "Fuel efficiency must be positive")
        BigDecimal fuelEfficiencyKmPerLitre,

        @NotNull(message = "Fuel price is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Fuel price cannot be negative")
        BigDecimal fuelPricePerUnit,

        boolean isDefault
) {
}
