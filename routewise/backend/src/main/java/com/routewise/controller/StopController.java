package com.routewise.controller;

import com.routewise.dto.route.RouteResponse;
import com.routewise.dto.route.StopResponse;
import com.routewise.dto.route.StopUpdateRequest;
import com.routewise.service.StopService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(name = "Stops")
@RestController
@RequestMapping("/api/stops")
@RequiredArgsConstructor
public class StopController {

    private final StopService stopService;

    @PutMapping("/{id}")
    public StopResponse updateStop(@PathVariable UUID id, @Valid @RequestBody StopUpdateRequest request) {
        return stopService.updateStop(id, request);
    }

    @DeleteMapping("/{id}")
    public RouteResponse deleteStop(@PathVariable UUID id) {
        return stopService.deleteStop(id);
    }

    @PostMapping("/{id}/complete")
    public StopResponse completeStop(@PathVariable UUID id) {
        return stopService.completeStop(id);
    }

    @PostMapping("/{id}/skip")
    public StopResponse skipStop(@PathVariable UUID id) {
        return stopService.skipStop(id);
    }
}
