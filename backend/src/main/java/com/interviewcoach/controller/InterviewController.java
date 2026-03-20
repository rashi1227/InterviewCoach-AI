package com.interviewcoach.controller;

import com.interviewcoach.dto.ApiRequests.*;
import com.interviewcoach.dto.ApiResponses.*;
import com.interviewcoach.entity.Interview;
import com.interviewcoach.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/start")
    public ResponseEntity<Interview> startInterview(@RequestBody StartInterviewRequest request) {
        Interview interview = interviewService.startInterview(
            request.userId(), 
            request.role(), 
            request.experienceLevel(), 
            request.yearsOfExperience()
        );
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{interviewId}/generate-questions")
    public ResponseEntity<List<QuestionDto>> generateQuestions(@PathVariable Long interviewId, @RequestBody GenerateQuestionsRequest request) {
        List<QuestionDto> questions = interviewService.generateQuestionsForInterview(interviewId, request.resumeId());
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/questions/{questionId}/submit-answer")
    public ResponseEntity<AnswerEvaluationDto> submitAnswer(@PathVariable Long questionId, @RequestBody SubmitAnswerRequest request) {
        AnswerEvaluationDto evaluation = interviewService.submitAnswer(questionId, request.answerText());
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/users/{userId}/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long userId) {
        DashboardResponse dashboard = interviewService.getDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }
}
