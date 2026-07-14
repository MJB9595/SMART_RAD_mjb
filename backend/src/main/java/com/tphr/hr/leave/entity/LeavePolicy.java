package com.tphr.hr.leave.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.position.Position;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "leave_policy")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LeavePolicy extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_policy_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @Column(name = "annual_leave_days", nullable = false, precision = 4, scale = 1)
    private BigDecimal annualLeaveDays;

    @Column(name = "max_carry_over_days", precision = 4, scale = 1)
    private BigDecimal maxCarryOverDays;

    @Column(name = "half_day_allowed")
    private Boolean halfDayAllowed;

    @Column(name = "note", length = 255)
    private String note;

    @Builder
    public LeavePolicy(Position position, BigDecimal annualLeaveDays, BigDecimal maxCarryOverDays, Boolean halfDayAllowed, String note) {
        this.position = position;
        this.annualLeaveDays = annualLeaveDays;
        this.maxCarryOverDays = maxCarryOverDays;
        this.halfDayAllowed = halfDayAllowed;
        this.note = note;
    }
}
