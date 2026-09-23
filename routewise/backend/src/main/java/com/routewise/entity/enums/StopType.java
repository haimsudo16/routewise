package com.routewise.entity.enums;

/**
 * Identifies the structural role of a stop within a route.
 * ORIGIN and DESTINATION are fixed endpoints; WAYPOINT stops are the
 * ones the optimization algorithm is free to reorder.
 */
public enum StopType {
    ORIGIN,
    WAYPOINT,
    DESTINATION
}
