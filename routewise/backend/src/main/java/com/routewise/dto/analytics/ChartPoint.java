package com.routewise.dto.analytics;

import java.math.BigDecimal;

/** Generic (label, value) pair used to feed Recharts on the frontend. */
public record ChartPoint(
        String label,
        BigDecimal value
) {
    public static ChartPoint of(String label, BigDecimal value) {
        return new ChartPoint(label, value);
    }

    public static ChartPoint of(String label, long value) {
        return new ChartPoint(label, BigDecimal.valueOf(value));
    }
}
