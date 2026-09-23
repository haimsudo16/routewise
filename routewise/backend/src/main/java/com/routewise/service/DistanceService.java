package com.routewise.service;

import com.routewise.entity.Stop;
import org.springframework.stereotype.Service;

/**
 * Isolated distance/duration math so the optimizer and the RoutingProvider
 * implementations never duplicate geospatial formulas.
 *
 * Distances are computed with the Haversine great-circle formula. This is the
 * "as the crow flies" distance rather than an actual road distance; a
 * road-network-aware ExternalRoutingProvider can be dropped in later (see
 * RoutingProvider) without touching any caller of this service.
 */
@Service
public class DistanceService {

    private static final double EARTH_RADIUS_KM = 6371.0088;

    /** A flat multiplier applied to straight-line distance to approximate real road travel. */
    private static final double ROAD_FACTOR = 1.30;

    /** Assumed average urban/inter-city travel speed in km/h, used to estimate duration. */
    private static final double AVERAGE_SPEED_KMH = 32.0;

    public double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public double roadDistanceKm(Stop a, Stop b) {
        double straightLine = haversineKm(a.getLatitude(), a.getLongitude(), b.getLatitude(), b.getLongitude());
        return straightLine * ROAD_FACTOR;
    }

    public double roadDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        return haversineKm(lat1, lon1, lat2, lon2) * ROAD_FACTOR;
    }

    public int estimatedMinutes(double distanceKm) {
        double hours = distanceKm / AVERAGE_SPEED_KMH;
        return (int) Math.round(hours * 60);
    }
}
