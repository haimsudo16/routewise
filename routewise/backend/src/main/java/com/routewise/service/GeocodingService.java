package com.routewise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.routewise.dto.geocode.GeocodeResult;
import com.routewise.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Forward-geocodes free-text address queries into coordinates.
 *
 * Backed by the public OpenStreetMap Nominatim API by default (configurable
 * via routewise.geocoding.provider-url so a paid provider can be swapped in
 * for production traffic - Nominatim's usage policy caps it at ~1 request/sec
 * and is not intended for high-volume commercial use).
 */
@Slf4j
@Service
public class GeocodingService {

    private final WebClient webClient;

    public GeocodingService(@Value("${routewise.geocoding.provider-url}") String providerUrl,
                             @Value("${routewise.geocoding.user-agent}") String userAgent) {
        this.webClient = WebClient.builder()
                .baseUrl(providerUrl)
                .defaultHeader(HttpHeaders.USER_AGENT, userAgent)
                .build();
    }

    public List<GeocodeResult> search(String query) {
        if (query == null || query.isBlank()) {
            throw new BadRequestException("Search query cannot be empty");
        }

        try {
            JsonNode response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", query)
                            .queryParam("format", "jsonv2")
                            .queryParam("limit", 6)
                            .queryParam("addressdetails", 0)
                            .build())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            List<GeocodeResult> results = new ArrayList<>();
            if (response != null && response.isArray()) {
                for (JsonNode node : response) {
                    double lat = node.path("lat").asDouble();
                    double lon = node.path("lon").asDouble();
                    String displayName = node.path("display_name").asText();
                    results.add(new GeocodeResult(displayName, lat, lon));
                }
            }
            return results;
        } catch (Exception ex) {
            log.warn("Geocoding lookup failed for query '{}': {}", query, ex.getMessage());
            return List.of();
        }
    }
}
