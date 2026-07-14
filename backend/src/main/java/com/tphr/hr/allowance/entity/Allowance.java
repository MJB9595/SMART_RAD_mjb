package com.tphr.hr.allowance.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "allowance")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Allowance extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allowance_id")
    private Long id;

    @Column(name = "allowance_name", nullable = false, length = 100)
    private String name;

    @Column(name = "taxable", nullable = false)
    private boolean taxable;

    @Column(name = "fixed", nullable = false)
    private boolean fixed;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Builder
    public Allowance(String name, boolean taxable, boolean fixed) {
        this.name = name;
        this.taxable = taxable;
        this.fixed = fixed;
        this.active = true;
    }
}
