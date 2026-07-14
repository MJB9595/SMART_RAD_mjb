package com.tphr.hr.leave.service;

import com.tphr.hr.leave.LeaveType;
import com.tphr.hr.leave.dto.LeavePolicyDto;
import com.tphr.hr.leave.dto.LeaveTypeDto;
import com.tphr.hr.leave.entity.LeavePolicy;
import com.tphr.hr.leave.repository.LeavePolicyRepository;
import com.tphr.hr.leave.repository.LeaveTypeRepository;
import com.tphr.hr.position.Position;
import com.tphr.hr.position.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeavePolicyRepository leavePolicyRepository;
    private final PositionRepository positionRepository;

    @Transactional
    public LeaveTypeDto.Response createLeaveType(LeaveTypeDto.Request req) {
        LeaveType type = new LeaveType(req.getName(), req.isPaid(), req.getDefaultDays(), req.getNote());
        return toDto(leaveTypeRepository.save(type));
    }

    public List<LeaveTypeDto.Response> getAllLeaveTypes() {
        return leaveTypeRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public LeavePolicyDto.Response createLeavePolicy(LeavePolicyDto.Request req) {
        Position pos = req.getPositionId() != null ? positionRepository.findById(req.getPositionId()).orElse(null) : null;
        LeavePolicy policy = LeavePolicy.builder()
                .position(pos)
                .annualLeaveDays(req.getAnnualLeaveDays())
                .maxCarryOverDays(req.getMaxCarryOverDays())
                .halfDayAllowed(req.getHalfDayAllowed())
                .note(req.getNote())
                .build();
        return toDto(leavePolicyRepository.save(policy));
    }

    public List<LeavePolicyDto.Response> getAllLeavePolicies() {
        return leavePolicyRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    private LeaveTypeDto.Response toDto(LeaveType t) {
        return LeaveTypeDto.Response.builder()
                .id(t.getId())
                .name(t.getName())
                .paid(t.isPaid())
                .defaultDays(t.getDefaultDays())
                .note(t.getNote())
                .build();
    }

    private LeavePolicyDto.Response toDto(LeavePolicy p) {
        return LeavePolicyDto.Response.builder()
                .id(p.getId())
                .positionId(p.getPosition() != null ? p.getPosition().getId() : null)
                .annualLeaveDays(p.getAnnualLeaveDays())
                .maxCarryOverDays(p.getMaxCarryOverDays())
                .halfDayAllowed(p.getHalfDayAllowed())
                .note(p.getNote())
                .build();
    }
}
