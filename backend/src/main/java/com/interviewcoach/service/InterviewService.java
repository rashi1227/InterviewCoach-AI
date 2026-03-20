package com.interviewcoach.service;

import com.interviewcoach.dto.AiEvaluationResponse;
import com.interviewcoach.dto.ApiResponses.*;
import com.interviewcoach.entity.*;
import com.interviewcoach.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final AiService aiService;

    public InterviewService(InterviewRepository interviewRepository, QuestionRepository questionRepository,
                            AnswerRepository answerRepository, UserRepository userRepository,
                            ResumeRepository resumeRepository, AiService aiService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.aiService = aiService;
    }

    public Interview startInterview(Long userId, String role, String experienceLevel, Integer yearsOfExperience) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Interview interview = new Interview(user, role);
        interview.setExperienceLevel(experienceLevel);
        interview.setYearsOfExperience(yearsOfExperience);
        return interviewRepository.save(interview);
    }

    public List<QuestionDto> generateQuestionsForInterview(Long interviewId, Long resumeId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        List<String> generatedText = aiService.generateQuestions(
            resume.getContent(), 
            interview.getRole(), 
            interview.getExperienceLevel(), 
            interview.getYearsOfExperience(), 
            5
        );
        
        List<Question> questions = generatedText.stream().map(text -> {
            Question q = new Question(interview, text);
            return questionRepository.save(q);
        }).toList();

        return questions.stream()
                .map(q -> new QuestionDto(q.getId(), q.getText()))
                .collect(Collectors.toList());
    }

    public AnswerEvaluationDto submitAnswer(Long questionId, String answerText) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        AiEvaluationResponse evaluation = aiService.evaluateAnswer(question.getText(), answerText);

        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnswerText(answerText);
        answer.setClarityScore(evaluation.getClarityScore());
        answer.setTechnicalScore(evaluation.getTechnicalScore());
        answer.setCommunicationScore(evaluation.getCommunicationScore());
        answer.setFeedback(evaluation.getFeedback());
        answer.setMistakes(evaluation.getMistakes());
        answer.setIdealAnswer(evaluation.getIdealAnswer());

        answer = answerRepository.save(answer);

        // Update Interview Overall Score optionally
        // We can do this async or here
        updateInterviewScore(question.getInterview());

        return new AnswerEvaluationDto(
                answer.getId(), answer.getClarityScore(), answer.getTechnicalScore(),
                answer.getCommunicationScore(), answer.getFeedback(), answer.getMistakes(), answer.getIdealAnswer()
        );
    }

    private void updateInterviewScore(Interview interview) {
        List<Question> questions = questionRepository.findByInterview(interview);
        double total = 0;
        int count = 0;
        for (Question q : questions) {
            List<Answer> answers = answerRepository.findByQuestion(q);
            if (!answers.isEmpty()) {
                Answer latest = answers.get(answers.size() - 1);
                double avg = (latest.getClarityScore() + latest.getTechnicalScore() + latest.getCommunicationScore()) / 3.0;
                total += avg;
                count++;
            }
        }
        if (count > 0) {
            interview.setOverallScore(total / count);
            interviewRepository.save(interview);
        }
    }

    public DashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<Interview> interviews = interviewRepository.findByUserOrderByDateDesc(user);
        
        double avgClarity = 0, avgTech = 0, avgComm = 0;
        int answerCount = 0;

        for (Interview inv : interviews) {
            List<Question> qs = questionRepository.findByInterview(inv);
            for (Question q : qs) {
                for (Answer a : answerRepository.findByQuestion(q)) {
                    avgClarity += a.getClarityScore() != null ? a.getClarityScore() : 0;
                    avgTech += a.getTechnicalScore() != null ? a.getTechnicalScore() : 0;
                    avgComm += a.getCommunicationScore() != null ? a.getCommunicationScore() : 0;
                    answerCount++;
                }
            }
        }
        
        if (answerCount > 0) {
            avgClarity /= answerCount;
            avgTech /= answerCount;
            avgComm /= answerCount;
        }

        List<InterviewSummary> history = interviews.stream()
                .map(i -> new InterviewSummary(i.getId(), i.getRole(), i.getDate().toString(), i.getOverallScore()))
                .collect(Collectors.toList());

        return new DashboardResponse(avgClarity, avgTech, avgComm, history);
    }
}
