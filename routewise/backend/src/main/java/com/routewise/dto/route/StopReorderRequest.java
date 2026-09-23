package com.routewise.dto.route;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

/**
 * The new order of WAYPOINT stop ids (origin/destination stay fixed).
 * Used by the drag-and-drop stop builder on the Create Route page.
 */
public record StopReorderRequest(
        @NotEmpty(message = "Stop order cannot be empty")
        List<UUID> stopIds
) {
}
