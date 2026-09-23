package com.routewise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.routewise.entity.enums.Priority;
import com.routewise.entity.enums.StopStatus;
import com.routewise.entity.enums.StopType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "stops")
public class Stop extends BaseEntity {

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String formattedAddress;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    /** Position in the route as currently sequenced (0 = origin). Mutated by the optimizer. */
    @Column(nullable = false)
    private Integer sequenceOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StopType stopType = StopType.WAYPOINT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StopStatus status = StopStatus.PENDING;

    private String notes;

    private Instant completedAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;
}
