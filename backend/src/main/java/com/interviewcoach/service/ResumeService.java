package com.interviewcoach.service;

import com.interviewcoach.entity.Resume;
import com.interviewcoach.entity.User;
import com.interviewcoach.repository.ResumeRepository;
import com.interviewcoach.repository.UserRepository;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume processAndSaveResume(Long userId, MultipartFile file) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Tika tika = new Tika();
        String extractedText = tika.parseToString(file.getInputStream());

        Resume resume = new Resume(user, extractedText);
        return resumeRepository.save(resume);
    }
}
