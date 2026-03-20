package com.interviewcoach.dto;

public class ApiRequests {
    
    public record StartInterviewRequest(Long userId, String role, String experienceLevel, Integer yearsOfExperience) {}
    
    public record GenerateQuestionsRequest(Long resumeId) {}
    
    public record SubmitAnswerRequest(String answerText) {}
}
