package com.routewise.dto.geocode;

public record GeocodeResult(
        String formattedAddress,
        double latitude,
        double longitude
) {
}
