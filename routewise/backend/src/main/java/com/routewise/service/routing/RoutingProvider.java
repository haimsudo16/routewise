package com.routewise.service.routing;

/**
 * Abstraction over "how do I get from point A to point B".
 *
 * RouteOptimizationService and every caller depend only on this interface, so
 * swapping the underlying routing engine - e.g. plugging in a real road-network
 * provider such as OSRM, Mapbox Directions, or Google Routes - never requires
 * touching the optimization algorithm or the controllers built on top of it.
 *
 * {@link BasicRoutingProvider} is the default implementation shipped with
 * RouteWise: it estimates road distance/time from great-circle coordinates.
 * A future {@code ExternalRoutingProvider} would implement this same
 * interface, call out to a routing API, and be swapped in purely via Spring
 * configuration (a single @Bean / @Primary change) with zero call-site edits.
 */
public interface RoutingProvider {

    RouteLeg getLeg(double fromLat, double fromLon, double toLat, double toLon);
}
