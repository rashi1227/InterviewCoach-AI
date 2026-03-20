package com.interviewcoach.service;

import com.interviewcoach.dto.AiEvaluationResponse;
import java.util.List;

public interface AiService {
    List<String> generateQuestions(String resumeContent, String role, String experienceLevel, Integer yearsOfExperience, int count);
    AiEvaluationResponse evaluateAnswer(String question, String answer);
}
