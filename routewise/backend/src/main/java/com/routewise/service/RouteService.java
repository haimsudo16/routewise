package com.routewise.service;

import com.routewise.dto.common.PageResponse;
import com.routewise.dto.route.OptimizationResponse;
import com.routewise.dto.route.RouteRequest;
import com.routewise.dto.route.RouteResponse;
import com.routewise.dto.route.StopRequest;
import com.routewise.entity.Route;
import com.routewise.entity.Stop;
import com.routewise.entity.User;
import com.routewise.entity.Vehicle;
import com.routewise.entity.enums.Priority;
import com.routewise.entity.enums.RouteStatus;
import com.routewise.entity.enums.StopStatus;
import com.routewise.entity.enums.StopType;
import com.routewise.exception.BadRequestException;
import com.routewise.exception.ResourceNotFoundException;
import com.routewise.mapper.RouteMapper;
import com.routewise.repository.RouteRepository;
import com.routewise.repository.UserRepository;
import com.routewise.repository.VehicleRepository;
import com.routewise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteMapper routeMapper;
    private final RouteOptimizationService routeOptimizationService;

    @Transactional
    public RouteResponse createRoute(RouteRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User userRef = userRepository.getReferenceById(userId);
        Vehicle vehicle = resolveVehicle(request.vehicleId(), userId);

        Route route = Route.builder()
                .name(request.name().trim())
                .status(RouteStatus.DRAFT)
                .user(userRef)
                .vehicle(vehicle)
                .build();

        List<Stop> stops = buildStopList(request);
        stops.forEach(route::addStop);

        route = routeRepository.save(route);
        return routeMapper.toResponse(route);
    }

    @Transactional(readOnly = true)
    public RouteResponse getRoute(UUID routeId) {
        return routeMapper.toResponse(loadOwnedRoute(routeId));
    }

    @Transactional(readOnly = true)
    public PageResponse<RouteResponse> searchRoutes(RouteStatus status, String search, String sort,
                                                      int page, int size) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Sort sortSpec = switch (sort == null ? "newest" : sort) {
            case "oldest" -> Sort.by("createdAt").ascending();
            case "distance" -> Sort.by("distanceKm").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("createdAt").descending();
        };
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sortSpec);
        String normalizedSearch = (search == null || search.isBlank()) ? null : search.trim();

        Page<Route> result = routeRepository.search(userId, status, normalizedSearch, pageable);
        return PageResponse.from(result.map(routeMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public List<RouteResponse> getRecentRoutes() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return routeRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(routeMapper::toResponse)
                .toList();
    }

    @Transactional
    public RouteResponse updateRoute(UUID routeId, RouteRequest request) {
        Route route = loadOwnedRoute(routeId);

        route.setName(request.name().trim());
        route.setVehicle(resolveVehicle(request.vehicleId(), route.getUser().getId()));

        route.getStops().clear();
        List<Stop> stops = buildStopList(request);
        stops.forEach(route::addStop);

        // Editing the stop list invalidates any prior optimization result.
        route.setStatus(RouteStatus.DRAFT);
        route.setDistanceKm(null);
        route.setDurationMinutes(null);
        route.setOriginalDistanceKm(null);
        route.setOriginalDurationMinutes(null);
        route.setDistanceSavedKm(null);
        route.setTimeSavedMinutes(null);
        route.setFuelUsedLitres(null);
        route.setFuelCost(null);

        return routeMapper.toResponse(routeRepository.save(route));
    }

    @Transactional
    public void deleteRoute(UUID routeId) {
        Route route = loadOwnedRoute(routeId);
        routeRepository.delete(route);
    }

    @Transactional
    public OptimizationResponse optimizeRoute(UUID routeId) {
        Route route = loadOwnedRoute(routeId);

        Stop origin = route.getStops().stream()
                .filter(s -> s.getStopType() == StopType.ORIGIN)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Route has no origin stop"));
        Stop destination = route.getStops().stream()
                .filter(s -> s.getStopType() == StopType.DESTINATION)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Route has no destination stop"));
        List<Stop> waypoints = route.getStops().stream()
                .filter(s -> s.getStopType() == StopType.WAYPOINT)
                .toList();

        RouteOptimizationService.OptimizationResult result =
                routeOptimizationService.optimize(origin, waypoints, destination);

        BigDecimal originalDistance = round(result.originalDistanceKm());
        BigDecimal optimizedDistance = round(result.optimizedDistanceKm());
        BigDecimal distanceSaved = originalDistance.subtract(optimizedDistance).max(BigDecimal.ZERO);
        int timeSaved = Math.max(0, result.originalDurationMinutes() - result.optimizedDurationMinutes());

        route.setDistanceKm(optimizedDistance);
        route.setDurationMinutes(result.optimizedDurationMinutes());
        route.setOriginalDistanceKm(originalDistance);
        route.setOriginalDurationMinutes(result.originalDurationMinutes());
        route.setDistanceSavedKm(distanceSaved);
        route.setTimeSavedMinutes(timeSaved);
        route.setStatus(RouteStatus.OPTIMIZED);
        applyFuelEstimate(route, optimizedDistance);

        route = routeRepository.save(route);

        double savedPercent = originalDistance.doubleValue() == 0
                ? 0
                : (distanceSaved.doubleValue() / originalDistance.doubleValue()) * 100.0;

        return new OptimizationResponse(
                routeMapper.toResponse(route),
                originalDistance,
                result.originalDurationMinutes(),
                optimizedDistance,
                result.optimizedDurationMinutes(),
                distanceSaved,
                timeSaved,
                Math.round(savedPercent * 10) / 10.0
        );
    }

    @Transactional
    public RouteResponse startRoute(UUID routeId) {
        Route route = loadOwnedRoute(routeId);
        if (route.getStatus() == RouteStatus.COMPLETED || route.getStatus() == RouteStatus.CANCELLED) {
            throw new BadRequestException("Cannot start a route that is already " + route.getStatus());
        }
        route.setStatus(RouteStatus.IN_PROGRESS);
        route.setStartedAt(Instant.now());
        return routeMapper.toResponse(routeRepository.save(route));
    }

    @Transactional
    public RouteResponse completeRoute(UUID routeId) {
        Route route = loadOwnedRoute(routeId);
        route.setStatus(RouteStatus.COMPLETED);
        route.setCompletedAt(Instant.now());
        route.getStops().forEach(stop -> {
            if (stop.getStatus() == StopStatus.PENDING) {
                stop.setStatus(StopStatus.COMPLETED);
                stop.setCompletedAt(Instant.now());
            }
        });
        return routeMapper.toResponse(routeRepository.save(route));
    }

    @Transactional
    public RouteResponse cancelRoute(UUID routeId) {
        Route route = loadOwnedRoute(routeId);
        route.setStatus(RouteStatus.CANCELLED);
        return routeMapper.toResponse(routeRepository.save(route));
    }

    // -- internal helpers -------------------------------------------------

    Route loadOwnedRoute(UUID routeId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return routeRepository.findByIdAndUserId(routeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
    }

    private Vehicle resolveVehicle(UUID vehicleId, UUID userId) {
        if (vehicleId == null) {
            return null;
        }
        return vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    private List<Stop> buildStopList(RouteRequest request) {
        List<Stop> stops = new ArrayList<>();
        stops.add(toStop(request.origin(), StopType.ORIGIN, 0));

        int order = 1;
        if (request.waypoints() != null) {
            for (StopRequest waypoint : request.waypoints()) {
                stops.add(toStop(waypoint, StopType.WAYPOINT, order++));
            }
        }
        stops.add(toStop(request.destination(), StopType.DESTINATION, order));
        return stops;
    }

    private Stop toStop(StopRequest request, StopType stopType, int sequenceOrder) {
        return Stop.builder()
                .label(request.label().trim())
                .formattedAddress(request.formattedAddress().trim())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .sequenceOrder(sequenceOrder)
                .stopType(stopType)
                .priority(request.priority() != null ? request.priority() : Priority.NORMAL)
                .status(StopStatus.PENDING)
                .notes(request.notes())
                .build();
    }

    private void applyFuelEstimate(Route route, BigDecimal distanceKm) {
        Vehicle vehicle = route.getVehicle();
        if (vehicle == null || vehicle.getFuelEfficiencyKmPerLitre() == null
                || vehicle.getFuelEfficiencyKmPerLitre().compareTo(BigDecimal.ZERO) <= 0) {
            route.setFuelUsedLitres(null);
            route.setFuelCost(null);
            return;
        }
        BigDecimal litres = distanceKm.divide(vehicle.getFuelEfficiencyKmPerLitre(), 2, RoundingMode.HALF_UP);
        BigDecimal cost = litres.multiply(vehicle.getFuelPricePerUnit()).setScale(2, RoundingMode.HALF_UP);
        route.setFuelUsedLitres(litres);
        route.setFuelCost(cost);
    }

    private BigDecimal round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }
}
