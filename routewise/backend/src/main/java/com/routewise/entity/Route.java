package com.routewise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.routewise.entity.enums.RouteStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "routes")
public class Route extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RouteStatus status = RouteStatus.DRAFT;

    @Column(precision = 10, scale = 2)
    private BigDecimal distanceKm;

    private Integer durationMinutes;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalDistanceKm;

    private Integer originalDurationMinutes;

    @Column(precision = 10, scale = 2)
    private BigDecimal distanceSavedKm;

    private Integer timeSavedMinutes;

    @Column(precision = 10, scale = 2)
    private BigDecimal fuelUsedLitres;

    @Column(precision = 10, scale = 2)
    private BigDecimal fuelCost;

    private Instant startedAt;

    private Instant completedAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sequenceOrder ASC")
    @Builder.Default
    private List<Stop> stops = new ArrayList<>();

    public void addStop(Stop stop) {
        stops.add(stop);
        stop.setRoute(this);
    }

    public void removeStop(Stop stop) {
        stops.remove(stop);
        stop.setRoute(null);
    }
}
