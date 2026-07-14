package com.tphr.hr.allowance.service;

import com.tphr.hr.allowance.dto.AllowanceDto;
import com.tphr.hr.allowance.dto.EmployeeAllowanceDto;
import com.tphr.hr.allowance.entity.Allowance;
import com.tphr.hr.allowance.entity.EmployeeAllowance;
import com.tphr.hr.allowance.repository.AllowanceRepository;
import com.tphr.hr.allowance.repository.EmployeeAllowanceRepository;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AllowanceService {

    private final AllowanceRepository allowanceRepository;
    private final EmployeeAllowanceRepository employeeAllowanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AllowanceDto.Response createAllowance(AllowanceDto.Request req) {
        Allowance entity = Allowance.builder()
                .name(req.getName())
                .taxable(req.isTaxable())
                .fixed(req.isFixed())
                .build();
        return toDto(allowanceRepository.save(entity));
    }

    public List<AllowanceDto.Response> getAllAllowances() {
        return allowanceRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public EmployeeAllowanceDto.Response createEmployeeAllowance(EmployeeAllowanceDto.Request req) {
        Employee emp = employeeRepository.findById(req.getEmployeeId()).orElseThrow();
        Allowance allowance = allowanceRepository.findById(req.getAllowanceId()).orElseThrow();
        EmployeeAllowance entity = EmployeeAllowance.builder()
                .employee(emp)
                .allowance(allowance)
                .amount(req.getAmount())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
        return toDto(employeeAllowanceRepository.save(entity));
    }

    public List<EmployeeAllowanceDto.Response> getAllEmployeeAllowances() {
        return employeeAllowanceRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    private AllowanceDto.Response toDto(Allowance a) {
        return AllowanceDto.Response.builder()
                .id(a.getId())
                .name(a.getName())
                .taxable(a.isTaxable())
                .fixed(a.isFixed())
                .active(a.isActive())
                .build();
    }

    private EmployeeAllowanceDto.Response toDto(EmployeeAllowance ea) {
        return EmployeeAllowanceDto.Response.builder()
                .id(ea.getId())
                .employeeId(ea.getEmployee().getId())
                .allowanceId(ea.getAllowance().getId())
                .amount(ea.getAmount())
                .startDate(ea.getStartDate())
                .endDate(ea.getEndDate())
                .active(ea.isActive())
                .build();
    }
}
