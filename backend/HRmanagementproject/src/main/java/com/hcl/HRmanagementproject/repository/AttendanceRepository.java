package com.hcl.HRmanagementproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.HRmanagementproject.model.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

}