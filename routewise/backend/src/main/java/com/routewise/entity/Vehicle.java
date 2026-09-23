package com.routewise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.routewise.entity.enums.FuelType;
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

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "vehicles")
public class Vehicle extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    /** Fuel efficiency expressed as km travelled per litre (or per kWh-equivalent unit for EVs). */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fuelEfficiencyKmPerLitre;

    /** Price of one unit (litre / kWh) of fuel, in the user's local currency. */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fuelPricePerUnit;

    @Column(nullable = false)
    @Builder.Default
    private boolean isDefault = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
