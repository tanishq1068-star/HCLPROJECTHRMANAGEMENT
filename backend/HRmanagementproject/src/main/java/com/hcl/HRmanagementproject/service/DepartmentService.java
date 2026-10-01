package com.hcl.HRmanagementproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.HRmanagementproject.model.Department;
import com.hcl.HRmanagementproject.repository.DepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Department existing = departmentRepository.findById(id).orElse(null);

        if (existing != null) {
            department.setId(id);
            return departmentRepository.save(department);
        }

        return null;
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}