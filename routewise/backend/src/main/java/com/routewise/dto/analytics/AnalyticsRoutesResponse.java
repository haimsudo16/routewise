package com.routewise.dto.analytics;

import java.util.List;

public record AnalyticsRoutesResponse(
        List<ChartPoint> routesPerWeek,
        List<ChartPoint> completionRateByStatus
) {
}
