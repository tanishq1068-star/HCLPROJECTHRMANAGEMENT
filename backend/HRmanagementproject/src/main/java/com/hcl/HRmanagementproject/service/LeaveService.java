package com.hcl.HRmanagementproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.HRmanagementproject.model.Leave;
import com.hcl.HRmanagementproject.repository.LeaveRepository;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public Leave getLeaveById(Long id) {
        return leaveRepository.findById(id).orElse(null);
    }

    public Leave saveLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    public Leave updateLeave(Long id, Leave leave) {
        Leave existing = leaveRepository.findById(id).orElse(null);

        if (existing != null) {
            leave.setId(id);
            return leaveRepository.save(leave);
        }

        return null;
    }

    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }
}