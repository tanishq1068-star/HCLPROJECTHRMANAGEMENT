package com.hcl.HRmanagementproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.HRmanagementproject.model.Payroll;
import com.hcl.HRmanagementproject.repository.PayrollRepository;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;

    public PayrollService(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id).orElse(null);
    }

    public Payroll savePayroll(Payroll payroll) {
        return payrollRepository.save(payroll);
    }

    public Payroll updatePayroll(Long id, Payroll payroll) {
        Payroll existing = payrollRepository.findById(id).orElse(null);

        if (existing != null) {
            payroll.setId(id);
            return payrollRepository.save(payroll);
        }

        return null;
    }

    public void deletePayroll(Long id) {
        payrollRepository.deleteById(id);
    }
}