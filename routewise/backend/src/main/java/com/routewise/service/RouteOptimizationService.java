package com.routewise.service;

import com.routewise.entity.Stop;
import com.routewise.service.routing.RouteLeg;
import com.routewise.service.routing.RoutingProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implements the route optimization "DSA" piece of RouteWise: a Nearest
 * Neighbor heuristic over the route's waypoints, with the origin and
 * destination held fixed as the two endpoints.
 *
 * Nearest Neighbor is O(n^2) but for the multi-stop delivery routes RouteWise
 * targets (a handful to a few dozen stops) it is fast, deterministic, and
 * produces a materially better sequence than an unoptimized list - which is
 * the practical bar this feature needs to clear. {@link RoutingProvider} is
 * injected so the distance used at every step can later be swapped for a
 * real road-network engine without touching this algorithm.
 */
@Service
@RequiredArgsConstructor
public class RouteOptimizationService {

    private final RoutingProvider routingProvider;

    public OptimizationResult optimize(Stop origin, List<Stop> waypoints, Stop destination) {
        List<Stop> originalOrder = new ArrayList<>();
        originalOrder.add(origin);
        originalOrder.addAll(waypoints);
        originalOrder.add(destination);
        RouteTotals originalTotals = totalsFor(originalOrder);

        List<Stop> optimizedOrder = nearestNeighborOrder(origin, waypoints, destination);
        RouteTotals optimizedTotals = totalsFor(optimizedOrder);

        for (int i = 0; i < optimizedOrder.size(); i++) {
            optimizedOrder.get(i).setSequenceOrder(i);
        }

        return new OptimizationResult(
                optimizedOrder,
                originalTotals.distanceKm(),
                originalTotals.durationMinutes(),
                optimizedTotals.distanceKm(),
                optimizedTotals.durationMinutes()
        );
    }

    private List<Stop> nearestNeighborOrder(Stop origin, List<Stop> waypoints, Stop destination) {
        List<Stop> remaining = new ArrayList<>(waypoints);
        List<Stop> ordered = new ArrayList<>();
        ordered.add(origin);

        Stop current = origin;
        while (!remaining.isEmpty()) {
            Stop nearest = null;
            double nearestDistance = Double.MAX_VALUE;
            for (Stop candidate : remaining) {
                double distance = routingProvider.getLeg(
                        current.getLatitude(), current.getLongitude(),
                        candidate.getLatitude(), candidate.getLongitude()
                ).distanceKm();
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearest = candidate;
                }
            }
            ordered.add(nearest);
            remaining.remove(nearest);
            current = nearest;
        }

        ordered.add(destination);
        return ordered;
    }

    private RouteTotals totalsFor(List<Stop> orderedStops) {
        double totalDistance = 0;
        int totalDuration = 0;
        for (int i = 0; i < orderedStops.size() - 1; i++) {
            Stop from = orderedStops.get(i);
            Stop to = orderedStops.get(i + 1);
            RouteLeg leg = routingProvider.getLeg(
                    from.getLatitude(), from.getLongitude(),
                    to.getLatitude(), to.getLongitude()
            );
            totalDistance += leg.distanceKm();
            totalDuration += leg.durationMinutes();
        }
        return new RouteTotals(totalDistance, totalDuration);
    }

    private record RouteTotals(double distanceKm, int durationMinutes) {
    }

    public record OptimizationResult(
            List<Stop> orderedStops,
            double originalDistanceKm,
            int originalDurationMinutes,
            double optimizedDistanceKm,
            int optimizedDurationMinutes
    ) {
    }
}
