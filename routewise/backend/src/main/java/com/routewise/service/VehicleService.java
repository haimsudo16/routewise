package com.routewise.service;

import com.routewise.dto.vehicle.VehicleRequest;
import com.routewise.dto.vehicle.VehicleResponse;
import com.routewise.entity.User;
import com.routewise.entity.Vehicle;
import com.routewise.exception.ResourceNotFoundException;
import com.routewise.mapper.VehicleMapper;
import com.routewise.repository.UserRepository;
import com.routewise.repository.VehicleRepository;
import com.routewise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    @Transactional(readOnly = true)
    public List<VehicleResponse> listVehicles() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return vehicleRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(vehicleMapper::toResponse)
                .toList();
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User userRef = userRepository.getReferenceById(userId);

        if (request.isDefault()) {
            clearExistingDefault(userId);
        }

        Vehicle vehicle = Vehicle.builder()
                .name(request.name().trim())
                .fuelType(request.fuelType())
                .fuelEfficiencyKmPerLitre(request.fuelEfficiencyKmPerLitre())
                .fuelPricePerUnit(request.fuelPricePerUnit())
                .isDefault(request.isDefault())
                .user(userRef)
                .build();

        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleResponse updateVehicle(UUID vehicleId, VehicleRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (request.isDefault() && !vehicle.isDefault()) {
            clearExistingDefault(userId);
        }

        vehicle.setName(request.name().trim());
        vehicle.setFuelType(request.fuelType());
        vehicle.setFuelEfficiencyKmPerLitre(request.fuelEfficiencyKmPerLitre());
        vehicle.setFuelPricePerUnit(request.fuelPricePerUnit());
        vehicle.setDefault(request.isDefault());

        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void deleteVehicle(UUID vehicleId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }

    private void clearExistingDefault(UUID userId) {
        vehicleRepository.findFirstByUserIdAndIsDefaultTrue(userId)
                .ifPresent(existing -> {
                    existing.setDefault(false);
                    vehicleRepository.save(existing);
                });
    }
}
