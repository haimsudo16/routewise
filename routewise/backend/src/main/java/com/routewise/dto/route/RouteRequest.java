package com.routewise.dto.route;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record RouteRequest(
        @NotBlank(message = "Route name is required")
        @Size(max = 150)
        String name,

        UUID vehicleId,

        @NotNull(message = "A route needs an origin and destination")
        @Valid
        StopRequest origin,

        @Valid
        List<StopRequest> waypoints,

        @NotNull(message = "A route needs an origin and destination")
        @Valid
        StopRequest destination
) {
}
