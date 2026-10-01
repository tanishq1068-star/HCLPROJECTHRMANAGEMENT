package com.hcl.HRmanagementproject.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.HRmanagementproject.model.Leave;
import com.hcl.HRmanagementproject.service.LeaveService;

@RestController
@RequestMapping("/leaves")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Get all leave records
    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    // Get leave by ID
    @GetMapping("/{id}")
    public Leave getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

    // Apply for leave
    @PostMapping
    public Leave applyLeave(@RequestBody Leave leave) {
        return leaveService.saveLeave(leave);
    }

    // Update leave
    @PutMapping("/{id}")
    public Leave updateLeave(
            @PathVariable Long id,
            @RequestBody Leave leave) {

        return leaveService.updateLeave(id, leave);
    }

    // Delete leave
    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {

        leaveService.deleteLeave(id);

        return "Leave deleted successfully";
    }
}