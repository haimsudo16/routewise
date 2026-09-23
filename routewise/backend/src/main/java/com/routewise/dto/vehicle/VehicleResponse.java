package com.routewise.dto.vehicle;

import com.routewise.entity.enums.FuelType;

import java.math.BigDecimal;
import java.util.UUID;

public record VehicleResponse(
        UUID id,
        String name,
        FuelType fuelType,
        BigDecimal fuelEfficiencyKmPerLitre,
        BigDecimal fuelPricePerUnit,
        boolean isDefault
) {
}
