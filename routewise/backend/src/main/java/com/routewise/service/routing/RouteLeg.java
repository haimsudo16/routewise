package com.routewise.service.routing;

/** One point-to-point hop in a route: how far, and how long it takes. */
public record RouteLeg(double distanceKm, int durationMinutes) {
}
