package com.hcl.HRmanagementproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.HRmanagementproject.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}