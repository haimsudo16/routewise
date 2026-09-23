package com.routewise.controller;

import com.routewise.dto.analytics.AnalyticsDistanceResponse;
import com.routewise.dto.analytics.AnalyticsOverviewResponse;
import com.routewise.dto.analytics.AnalyticsRoutesResponse;
import com.routewise.dto.analytics.AnalyticsTimeSavedResponse;
import com.routewise.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Analytics")
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public AnalyticsOverviewResponse overview() {
        return analyticsService.overview();
    }

    @GetMapping("/routes")
    public AnalyticsRoutesResponse routes() {
        return analyticsService.routesAnalytics();
    }

    @GetMapping("/distance")
    public AnalyticsDistanceResponse distance() {
        return analyticsService.distanceAnalytics();
    }

    @GetMapping("/time-saved")
    public AnalyticsTimeSavedResponse timeSaved() {
        return analyticsService.timeSavedAnalytics();
    }
}
