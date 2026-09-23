package com.routewise.mapper;

import com.routewise.dto.route.StopResponse;
import com.routewise.entity.Stop;
import org.springframework.stereotype.Component;

@Component
public class StopMapper {

    public StopResponse toResponse(Stop stop) {
        return new StopResponse(
                stop.getId(),
                stop.getLabel(),
                stop.getFormattedAddress(),
                stop.getLatitude(),
                stop.getLongitude(),
                stop.getSequenceOrder(),
                stop.getStopType(),
                stop.getPriority(),
                stop.getStatus(),
                stop.getNotes(),
                stop.getCompletedAt()
        );
    }
}
