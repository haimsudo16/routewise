package com.routewise.mapper;

import com.routewise.dto.vehicle.VehicleResponse;
import com.routewise.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getFuelType(),
                vehicle.getFuelEfficiencyKmPerLitre(),
                vehicle.getFuelPricePerUnit(),
                vehicle.isDefault()
        );
    }
}
