package com.tphr.hr.allowance.service;

import com.tphr.hr.allowance.dto.AllowanceDto;
import com.tphr.hr.allowance.dto.EmployeeAllowanceDto;
import com.tphr.hr.allowance.entity.Allowance;
import com.tphr.hr.allowance.entity.EmployeeAllowance;
import com.tphr.hr.allowance.repository.AllowanceRepository;
import com.tphr.hr.allowance.repository.EmployeeAllowanceRepository;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.common.exception.ApiException;
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
        return allowanceRepository.findByDeletedFalseOrderByIdAsc().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public AllowanceDto.Response updateAllowance(Long id, AllowanceDto.Request req) {
        Allowance entity = findActive(id);
        entity.update(req.getName(), req.isTaxable(), req.isFixed());
        return toDto(entity);
    }

    /** 비활성 수당은 신규 지급 설정에서 제외된다. 이미 지급된 이력은 건드리지 않는다. */
    @Transactional
    public AllowanceDto.Response setAllowanceActive(Long id, boolean active) {
        Allowance entity = findActive(id);
        entity.changeActive(active);
        return toDto(entity);
    }

    @Transactional
    public void deleteAllowance(Long id) {
        Allowance entity = findActive(id);
        if (employeeAllowanceRepository.existsByAllowance_IdAndDeletedFalse(id)) {
            throw ApiException.conflict("이 수당을 지급받는 교직원이 있어 삭제할 수 없습니다. 비활성 처리를 사용하세요.");
        }
        entity.delete();
    }

    private Allowance findActive(Long id) {
        return allowanceRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> ApiException.notFound("수당을 찾을 수 없습니다. id=" + id));
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
