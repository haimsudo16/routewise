package com.routewise.dto.route;

import java.math.BigDecimal;

public record OptimizationResponse(
        RouteResponse route,
        BigDecimal originalDistanceKm,
        Integer originalDurationMinutes,
        BigDecimal optimizedDistanceKm,
        Integer optimizedDurationMinutes,
        BigDecimal distanceSavedKm,
        Integer timeSavedMinutes,
        double distanceSavedPercent
) {
}
