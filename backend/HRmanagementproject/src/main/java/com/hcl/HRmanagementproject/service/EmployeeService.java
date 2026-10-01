package com.hcl.HRmanagementproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.HRmanagementproject.model.Employee;
import com.hcl.HRmanagementproject.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employee) {
        Employee existing = employeeRepository.findById(id).orElse(null);

        if (existing != null) {
            employee.setId(id);
            return employeeRepository.save(employee);
        }

        return null;
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}