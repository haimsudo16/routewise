package com.routewise.dto.analytics;

import java.math.BigDecimal;

public record AnalyticsOverviewResponse(
        long totalRoutes,
        long completedRoutes,
        long inProgressRoutes,
        BigDecimal totalDistanceKm,
        int totalTimeSavedMinutes,
        BigDecimal totalDistanceSavedKm,
        BigDecimal totalFuelCost,
        double completionRatePercent
) {
}
