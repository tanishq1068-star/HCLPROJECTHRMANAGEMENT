package com.hcl.HRmanagementproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.HRmanagementproject.model.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

}