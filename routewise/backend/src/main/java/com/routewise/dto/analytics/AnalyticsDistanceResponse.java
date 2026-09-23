package com.routewise.dto.analytics;

import java.util.List;

public record AnalyticsDistanceResponse(
        List<ChartPoint> distancePerWeek
) {
}
