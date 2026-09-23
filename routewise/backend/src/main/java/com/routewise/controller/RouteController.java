package com.routewise.controller;

import com.routewise.dto.common.PageResponse;
import com.routewise.dto.route.OptimizationResponse;
import com.routewise.dto.route.RouteRequest;
import com.routewise.dto.route.RouteResponse;
import com.routewise.dto.route.StopRequest;
import com.routewise.dto.route.StopReorderRequest;
import com.routewise.entity.enums.RouteStatus;
import com.routewise.service.RouteService;
import com.routewise.service.StopService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Routes")
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;
    private final StopService stopService;

    @GetMapping
    public PageResponse<RouteResponse> listRoutes(
            @RequestParam(required = false) RouteStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        return routeService.searchRoutes(status, search, sort, page, size);
    }

    @GetMapping("/recent")
    public List<RouteResponse> recentRoutes() {
        return routeService.getRecentRoutes();
    }

    @GetMapping("/{id}")
    public RouteResponse getRoute(@PathVariable UUID id) {
        return routeService.getRoute(id);
    }

    @PostMapping
    public ResponseEntity<RouteResponse> createRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routeService.createRoute(request));
    }

    @PutMapping("/{id}")
    public RouteResponse updateRoute(@PathVariable UUID id, @Valid @RequestBody RouteRequest request) {
        return routeService.updateRoute(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable UUID id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/optimize")
    public OptimizationResponse optimizeRoute(@PathVariable UUID id) {
        return routeService.optimizeRoute(id);
    }

    @PostMapping("/{id}/start")
    public RouteResponse startRoute(@PathVariable UUID id) {
        return routeService.startRoute(id);
    }

    @PostMapping("/{id}/complete")
    public RouteResponse completeRoute(@PathVariable UUID id) {
        return routeService.completeRoute(id);
    }

    @PostMapping("/{id}/cancel")
    public RouteResponse cancelRoute(@PathVariable UUID id) {
        return routeService.cancelRoute(id);
    }

    @PostMapping("/{routeId}/stops")
    public ResponseEntity<RouteResponse> addStop(@PathVariable UUID routeId, @Valid @RequestBody StopRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stopService.addStop(routeId, request));
    }

    @PutMapping("/{routeId}/stops/reorder")
    public RouteResponse reorderStops(@PathVariable UUID routeId, @Valid @RequestBody StopReorderRequest request) {
        return stopService.reorderStops(routeId, request);
    }
}
