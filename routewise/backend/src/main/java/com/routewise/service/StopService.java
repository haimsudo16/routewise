package com.routewise.service;

import com.routewise.dto.route.RouteResponse;
import com.routewise.dto.route.StopReorderRequest;
import com.routewise.dto.route.StopRequest;
import com.routewise.dto.route.StopResponse;
import com.routewise.dto.route.StopUpdateRequest;
import com.routewise.entity.Route;
import com.routewise.entity.Stop;
import com.routewise.entity.enums.Priority;
import com.routewise.entity.enums.RouteStatus;
import com.routewise.entity.enums.StopStatus;
import com.routewise.entity.enums.StopType;
import com.routewise.exception.BadRequestException;
import com.routewise.exception.ResourceNotFoundException;
import com.routewise.mapper.RouteMapper;
import com.routewise.mapper.StopMapper;
import com.routewise.repository.RouteRepository;
import com.routewise.repository.StopRepository;
import com.routewise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StopService {

    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteMapper routeMapper;
    private final StopMapper stopMapper;


    // ============================================================
    // ADD STOP
    // ============================================================

    @Transactional
    public RouteResponse addStop(UUID routeId, StopRequest request) {

        Route route = loadOwnedRoute(routeId);

        int nextOrder = route.getStops().stream()
                .filter(stop -> stop.getStopType() != StopType.DESTINATION)
                .mapToInt(Stop::getSequenceOrder)
                .max()
                .orElse(0) + 1;

        // Keep destination at the end
        route.getStops().stream()
                .filter(stop -> stop.getStopType() == StopType.DESTINATION)
                .forEach(stop -> stop.setSequenceOrder(nextOrder + 1));

        Stop stop = Stop.builder()
                .label(request.label().trim())
                .formattedAddress(request.formattedAddress().trim())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .sequenceOrder(nextOrder)
                .stopType(StopType.WAYPOINT)
                .priority(
                        request.priority() != null
                                ? request.priority()
                                : Priority.NORMAL
                )
                .status(StopStatus.PENDING)
                .notes(request.notes())
                .build();

        route.addStop(stop);

        invalidateOptimization(route);

        Route savedRoute = routeRepository.save(route);

        return routeMapper.toResponse(savedRoute);
    }


    // ============================================================
    // UPDATE STOP
    // ============================================================

    @Transactional
    public StopResponse updateStop(
            UUID stopId,
            StopUpdateRequest request
    ) {

        Stop stop = loadOwnedStop(stopId);

        stop.setLabel(request.label().trim());

        stop.setFormattedAddress(
                request.formattedAddress().trim()
        );

        stop.setLatitude(request.latitude());

        stop.setLongitude(request.longitude());

        if (request.priority() != null) {
            stop.setPriority(request.priority());
        }

        stop.setNotes(request.notes());

        invalidateOptimization(stop.getRoute());

        Stop savedStop = stopRepository.save(stop);

        return stopMapper.toResponse(savedStop);
    }


    // ============================================================
    // DELETE STOP
    // ============================================================

    @Transactional
    public RouteResponse deleteStop(UUID stopId) {

        Stop stop = loadOwnedStop(stopId);

        // Origin and destination cannot be deleted
        if (stop.getStopType() != StopType.WAYPOINT) {

            throw new BadRequestException(
                    "The origin and destination stops cannot be deleted"
            );
        }

        Route route = stop.getRoute();

        route.removeStop(stop);

        invalidateOptimization(route);

        Route savedRoute = routeRepository.save(route);

        return routeMapper.toResponse(savedRoute);
    }


    // ============================================================
    // COMPLETE STOP
    // ============================================================

    @Transactional
    public StopResponse completeStop(UUID stopId) {

        Stop stop = loadOwnedStop(stopId);

        stop.setStatus(StopStatus.COMPLETED);

        stop.setCompletedAt(Instant.now());

        Stop savedStop = stopRepository.save(stop);

        maybeCompleteRoute(stop.getRoute());

        return stopMapper.toResponse(savedStop);
    }


    // ============================================================
    // SKIP STOP
    // ============================================================

    @Transactional
    public StopResponse skipStop(UUID stopId) {

        Stop stop = loadOwnedStop(stopId);

        stop.setStatus(StopStatus.SKIPPED);

        stop.setCompletedAt(Instant.now());

        Stop savedStop = stopRepository.save(stop);

        maybeCompleteRoute(stop.getRoute());

        return stopMapper.toResponse(savedStop);
    }


    // ============================================================
    // REORDER STOPS
    // ============================================================

    @Transactional
    public RouteResponse reorderStops(
            UUID routeId,
            StopReorderRequest request
    ) {

        Route route = loadOwnedRoute(routeId);

        // Get all waypoints and store them by ID
        Map<UUID, Stop> waypointsById = route.getStops()
                .stream()
                .filter(stop -> stop.getStopType() == StopType.WAYPOINT)
                .collect(
                        Collectors.toMap(
                                Stop::getId,
                                stop -> stop
                        )
                );


        // Validate received stop IDs
        if (
                waypointsById.size() != request.stopIds().size()
                        ||
                !waypointsById.keySet()
                        .containsAll(request.stopIds())
        ) {

            throw new BadRequestException(
                    "Stop order must include exactly the route's current waypoints"
            );
        }


        // ------------------------------------------------------------
        // Assign sequence numbers
        // ------------------------------------------------------------

        int order = 1;

        for (UUID stopId : request.stopIds()) {

            Stop stop = waypointsById.get(stopId);

            if (stop == null) {
                throw new BadRequestException(
                        "Invalid stop ID: " + stopId
                );
            }

            stop.setSequenceOrder(order);

            // Instead of order++
            order = order + 1;
        }


        // ------------------------------------------------------------
        // Destination must always remain last
        // ------------------------------------------------------------

        final int destinationOrder = order;

        route.getStops()
                .stream()
                .filter(
                        stop ->
                                stop.getStopType()
                                        == StopType.DESTINATION
                )
                .forEach(
                        stop ->
                                stop.setSequenceOrder(
                                        destinationOrder
                                )
                );


        // Reordering means previous optimization is no longer valid
        invalidateOptimization(route);

        Route savedRoute = routeRepository.save(route);

        return routeMapper.toResponse(savedRoute);
    }


    // ============================================================
    // LOAD OWNED ROUTE
    // ============================================================

    private Route loadOwnedRoute(UUID routeId) {

        UUID userId = SecurityUtils.getCurrentUserId();

        return routeRepository
                .findByIdAndUserId(routeId, userId)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Route not found"
                                )
                );
    }


    // ============================================================
    // LOAD OWNED STOP
    // ============================================================

    private Stop loadOwnedStop(UUID stopId) {

        UUID userId = SecurityUtils.getCurrentUserId();

        return stopRepository
                .findByIdAndRouteUserId(stopId, userId)
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Stop not found"
                                )
                );
    }


    // ============================================================
    // INVALIDATE OPTIMIZATION
    // ============================================================

    private void invalidateOptimization(Route route) {

        route.setStatus(RouteStatus.DRAFT);

        route.setDistanceKm(null);

        route.setDurationMinutes(null);

        route.setDistanceSavedKm(null);

        route.setTimeSavedMinutes(null);

        route.setFuelUsedLitres(null);

        route.setFuelCost(null);
    }


    // ============================================================
    // CHECK ROUTE COMPLETION
    // ============================================================

    private void maybeCompleteRoute(Route route) {

        boolean allSettled = route.getStops()
                .stream()
                .allMatch(
                        stop ->
                                stop.getStatus()
                                        == StopStatus.COMPLETED
                                        ||
                                stop.getStatus()
                                        == StopStatus.SKIPPED
                );


        if (
                allSettled
                        &&
                route.getStatus()
                        == RouteStatus.IN_PROGRESS
        ) {

            route.setStatus(RouteStatus.COMPLETED);

            route.setCompletedAt(Instant.now());

            routeRepository.save(route);
        }
    }
}