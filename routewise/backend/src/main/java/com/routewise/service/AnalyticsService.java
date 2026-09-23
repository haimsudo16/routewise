package com.routewise.service;

import com.routewise.dto.analytics.AnalyticsDistanceResponse;
import com.routewise.dto.analytics.AnalyticsOverviewResponse;
import com.routewise.dto.analytics.AnalyticsRoutesResponse;
import com.routewise.dto.analytics.AnalyticsTimeSavedResponse;
import com.routewise.dto.analytics.ChartPoint;
import com.routewise.entity.Route;
import com.routewise.entity.enums.RouteStatus;
import com.routewise.repository.RouteRepository;
import com.routewise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int WEEKS_OF_HISTORY = 8;
    private static final DateTimeFormatter WEEK_LABEL_FORMAT = DateTimeFormatter.ofPattern("MMM d");

    private final RouteRepository routeRepository;

    @Transactional(readOnly = true)
    public AnalyticsOverviewResponse overview() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Route> routes = allRoutesFor(userId);

        long total = routes.size();
        long completed = routes.stream().filter(r -> r.getStatus() == RouteStatus.COMPLETED).count();
        long inProgress = routes.stream().filter(r -> r.getStatus() == RouteStatus.IN_PROGRESS).count();

        BigDecimal totalDistance = sum(routes, Route::getDistanceKm);
        BigDecimal totalDistanceSaved = sum(routes, Route::getDistanceSavedKm);
        BigDecimal totalFuelCost = sum(routes, Route::getFuelCost);
        int totalTimeSaved = routes.stream()
                .map(Route::getTimeSavedMinutes)
                .filter(java.util.Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        double completionRate = total == 0 ? 0 : (completed * 100.0) / total;

        return new AnalyticsOverviewResponse(
                total,
                completed,
                inProgress,
                totalDistance,
                totalTimeSaved,
                totalDistanceSaved,
                totalFuelCost,
                Math.round(completionRate * 10) / 10.0
        );
    }

    @Transactional(readOnly = true)
    public AnalyticsRoutesResponse routesAnalytics() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Route> routes = recentRoutesFor(userId);

        Map<LocalDate, Long> perWeek = groupByWeek(routes);
        List<ChartPoint> routesPerWeek = toChartPoints(perWeek);

        Map<RouteStatus, Long> byStatus = routes.stream()
                .collect(Collectors.groupingBy(Route::getStatus, Collectors.counting()));
        List<ChartPoint> completionByStatus = byStatus.entrySet().stream()
                .map(e -> ChartPoint.of(e.getKey().name(), e.getValue()))
                .sorted(Comparator.comparing(ChartPoint::label))
                .toList();

        return new AnalyticsRoutesResponse(routesPerWeek, completionByStatus);
    }

    @Transactional(readOnly = true)
    public AnalyticsDistanceResponse distanceAnalytics() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Route> routes = recentRoutesFor(userId).stream()
                .filter(r -> r.getDistanceKm() != null)
                .toList();

        Map<LocalDate, BigDecimal> perWeek = new TreeMap<>();
        for (Route route : routes) {
            LocalDate week = startOfWeek(route.getCreatedAt());
            perWeek.merge(week, route.getDistanceKm(), BigDecimal::add);
        }
        List<ChartPoint> points = perWeek.entrySet().stream()
                .map(e -> ChartPoint.of(e.getKey().format(WEEK_LABEL_FORMAT), e.getValue().setScale(1, RoundingMode.HALF_UP)))
                .toList();
        return new AnalyticsDistanceResponse(fillMissingWeeks(points));
    }

    @Transactional(readOnly = true)
    public AnalyticsTimeSavedResponse timeSavedAnalytics() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<Route> routes = recentRoutesFor(userId).stream()
                .filter(r -> r.getTimeSavedMinutes() != null)
                .toList();

        Map<LocalDate, Integer> perWeek = new TreeMap<>();
        for (Route route : routes) {
            LocalDate week = startOfWeek(route.getCreatedAt());
            perWeek.merge(week, route.getTimeSavedMinutes(), Integer::sum);
        }
        List<ChartPoint> points = perWeek.entrySet().stream()
                .map(e -> ChartPoint.of(e.getKey().format(WEEK_LABEL_FORMAT), (long) e.getValue()))
                .toList();
        return new AnalyticsTimeSavedResponse(fillMissingWeeks(points));
    }

    // -- helpers ------------------------------------------------------------

    private List<Route> allRoutesFor(UUID userId) {
        Instant from = Instant.EPOCH;
        Instant to = Instant.now().plus(1, ChronoUnit.DAYS);
        return routeRepository.findByUserIdAndCreatedAtBetween(userId, from, to);
    }

    private List<Route> recentRoutesFor(UUID userId) {
        Instant to = Instant.now();
        Instant from = to.minus(WEEKS_OF_HISTORY * 7L, ChronoUnit.DAYS);
        return routeRepository.findByUserIdAndCreatedAtBetween(userId, from, to);
    }

    private LocalDate startOfWeek(Instant instant) {
        return instant.atZone(ZoneOffset.UTC).toLocalDate().with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
    }

    private Map<LocalDate, Long> groupByWeek(List<Route> routes) {
        return routes.stream()
                .collect(Collectors.groupingBy(r -> startOfWeek(r.getCreatedAt()), TreeMap::new, Collectors.counting()));
    }

    private List<ChartPoint> toChartPoints(Map<LocalDate, Long> perWeek) {
        List<ChartPoint> points = perWeek.entrySet().stream()
                .map(e -> ChartPoint.of(e.getKey().format(WEEK_LABEL_FORMAT), e.getValue()))
                .toList();
        return fillMissingWeeks(points);
    }

    /** Ensures the chart always shows WEEKS_OF_HISTORY points, even when some weeks had zero activity. */
    private List<ChartPoint> fillMissingWeeks(List<ChartPoint> existing) {
        if (existing.size() >= WEEKS_OF_HISTORY) {
            return existing;
        }
        Map<String, ChartPoint> byLabel = existing.stream()
                .collect(Collectors.toMap(ChartPoint::label, p -> p, (a, b) -> a));
        List<ChartPoint> result = new ArrayList<>();
        LocalDate cursor = LocalDate.now(ZoneOffset.UTC).with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                .minusWeeks(WEEKS_OF_HISTORY - 1L);
        for (int i = 0; i < WEEKS_OF_HISTORY; i++) {
            String label = cursor.format(WEEK_LABEL_FORMAT);
            result.add(byLabel.getOrDefault(label, ChartPoint.of(label, BigDecimal.ZERO)));
            cursor = cursor.plusWeeks(1);
        }
        return result;
    }

    private BigDecimal sum(List<Route> routes, java.util.function.Function<Route, BigDecimal> extractor) {
        return routes.stream()
                .map(extractor)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
