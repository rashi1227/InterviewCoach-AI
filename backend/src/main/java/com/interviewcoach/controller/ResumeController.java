package com.interviewcoach.controller;

import com.interviewcoach.entity.Resume;
import com.interviewcoach.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("userId") Long userId, @RequestParam("file") MultipartFile file) {
        try {
            Resume resume = resumeService.processAndSaveResume(userId, file);
            return ResponseEntity.ok(Map.of("id", resume.getId(), "message", "Resume uploaded and processed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
