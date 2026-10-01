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

import com.hcl.HRmanagementproject.model.Payroll;
import com.hcl.HRmanagementproject.service.PayrollService;

@RestController
@RequestMapping("/payroll")
@CrossOrigin(origins = "http://localhost:4200")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    // Get all payroll records
    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    // Get payroll by ID
    @GetMapping("/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    // Add payroll
    @PostMapping
    public Payroll addPayroll(@RequestBody Payroll payroll) {
        return payrollService.savePayroll(payroll);
    }

    // Update payroll
    @PutMapping("/{id}")
    public Payroll updatePayroll(
            @PathVariable Long id,
            @RequestBody Payroll payroll) {

        return payrollService.updatePayroll(id, payroll);
    }

    // Delete payroll
    @DeleteMapping("/{id}")
    public String deletePayroll(@PathVariable Long id) {

        payrollService.deletePayroll(id);

        return "Payroll deleted successfully";
    }
}