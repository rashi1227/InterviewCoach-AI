package com.interviewcoach.dto;

import java.util.List;

public class ApiResponses {
    
    public record DashboardResponse(
        Double averageClarity,
        Double averageTechnical,
        Double averageCommunication,
        List<InterviewSummary> recentInterviews
    ) {}

    public record InterviewSummary(
        Long id,
        String role,
        String date,
        Double overallScore
    ) {}
    
    public record QuestionDto(
        Long id,
        String text
    ) {}
    
    public record AnswerEvaluationDto(
        Long id,
        Integer clarityScore,
        Integer technicalScore,
        Integer communicationScore,
        String feedback,
        String mistakes,
        String idealAnswer
    ) {}
}
