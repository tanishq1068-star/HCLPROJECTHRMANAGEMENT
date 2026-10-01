package com.hcl.HRmanagementproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.HRmanagementproject.model.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

}