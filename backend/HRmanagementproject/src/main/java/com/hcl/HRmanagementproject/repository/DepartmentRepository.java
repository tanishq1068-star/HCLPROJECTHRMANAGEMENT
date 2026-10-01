package com.hcl.HRmanagementproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.HRmanagementproject.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

}