package com.interviewcoach.service;

import com.interviewcoach.dto.AiEvaluationResponse;
import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.List;
import java.util.ArrayList;

@Service
@ConditionalOnProperty(name = "ai.provider", havingValue = "openai")
public class OpenAiService implements AiService {

    // private final RestTemplate restTemplate;
    // private final String apiKey; // Injected from properties

    @Override
    public List<String> generateQuestions(String resumeContent, String role, String experienceLevel, Integer yearsOfExperience, int count) {
        // Implementation for calling OpenAI API would go here
        // E.g., building JSON request for completions and parsing the response
        List<String> list = new ArrayList<>();
        list.add("OpenAI generated question: Could you explain this project?");
        return list;
    }

    @Override
    public AiEvaluationResponse evaluateAnswer(String question, String answer) {
        // Implementation for calling OpenAI API would go here
        return new AiEvaluationResponse(7, 7, 7, "OpenAI Feedback", "OpenAI Mistakes", "OpenAI Ideal Answer");
    }
}
