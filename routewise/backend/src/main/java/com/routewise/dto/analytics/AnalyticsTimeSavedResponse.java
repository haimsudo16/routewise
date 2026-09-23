package com.routewise.dto.analytics;

import java.util.List;

public record AnalyticsTimeSavedResponse(
        List<ChartPoint> timeSavedPerWeek
) {
}
