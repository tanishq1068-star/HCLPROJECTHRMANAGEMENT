package com.hcl.HRmanagementproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.HRmanagementproject.model.Job;
import com.hcl.HRmanagementproject.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job job) {
        Job existing = jobRepository.findById(id).orElse(null);

        if (existing != null) {
            job.setId(id);
            return jobRepository.save(job);
        }

        return null;
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}