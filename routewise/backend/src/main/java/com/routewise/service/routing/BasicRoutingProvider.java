package com.routewise.service.routing;

import com.routewise.service.DistanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Default RoutingProvider: estimates road distance and travel time from
 * straight-line (Haversine) coordinates via DistanceService. No external
 * network call is required, which keeps route optimization fast and free to
 * run, at the cost of not knowing about actual road geometry, one-way streets,
 * or live traffic.
 */
@Component
@RequiredArgsConstructor
public class BasicRoutingProvider implements RoutingProvider {

    private final DistanceService distanceService;

    @Override
    public RouteLeg getLeg(double fromLat, double fromLon, double toLat, double toLon) {
        double distanceKm = distanceService.roadDistanceKm(fromLat, fromLon, toLat, toLon);
        int durationMinutes = distanceService.estimatedMinutes(distanceKm);
        return new RouteLeg(distanceKm, durationMinutes);
    }
}
