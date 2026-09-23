package com.routewise.mapper;

import com.routewise.dto.route.RouteResponse;
import com.routewise.dto.route.StopResponse;
import com.routewise.entity.Route;
import com.routewise.entity.Vehicle;
import com.routewise.entity.enums.StopStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RouteMapper {

    private final StopMapper stopMapper;

    public RouteResponse toResponse(Route route) {
        List<StopResponse> stops = route.getStops().stream()
                .map(stopMapper::toResponse)
                .toList();

        Vehicle vehicle = route.getVehicle();
        long completed = route.getStops().stream()
                .filter(s -> s.getStatus() == StopStatus.COMPLETED)
                .count();

        return new RouteResponse(
                route.getId(),
                route.getName(),
                route.getStatus(),
                route.getDistanceKm(),
                route.getDurationMinutes(),
                route.getOriginalDistanceKm(),
                route.getOriginalDurationMinutes(),
                route.getDistanceSavedKm(),
                route.getTimeSavedMinutes(),
                route.getFuelUsedLitres(),
                route.getFuelCost(),
                vehicle != null ? vehicle.getId() : null,
                vehicle != null ? vehicle.getName() : null,
                route.getStartedAt(),
                route.getCompletedAt(),
                route.getCreatedAt(),
                stops,
                (int) completed,
                route.getStops().size()
        );
    }
}
