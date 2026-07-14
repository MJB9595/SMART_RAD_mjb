package com.tphr.hr.allowance.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.Employee;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_allowance")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeAllowance extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_allowance_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "allowance_id", nullable = false)
    private Allowance allowance;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Builder
    public EmployeeAllowance(Employee employee, Allowance allowance, BigDecimal amount, LocalDate startDate, LocalDate endDate) {
        this.employee = employee;
        this.allowance = allowance;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = true;
    }
}
