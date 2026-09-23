package com.routewise.controller;

import com.routewise.dto.geocode.GeocodeResult;
import com.routewise.service.GeocodingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Geocoding")
@RestController
@RequestMapping("/api/geocode")
@RequiredArgsConstructor
public class GeocodeController {

    private final GeocodingService geocodingService;

    @GetMapping("/search")
    public List<GeocodeResult> search(@RequestParam String query) {
        return geocodingService.search(query);
    }
}
