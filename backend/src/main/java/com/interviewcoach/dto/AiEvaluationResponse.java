package com.interviewcoach.dto;

public class AiEvaluationResponse {
    private int clarityScore;
    private int technicalScore;
    private int communicationScore;
    private String feedback;
    private String mistakes;
    private String idealAnswer;

    public AiEvaluationResponse() {}

    public AiEvaluationResponse(int clarityScore, int technicalScore, int communicationScore, String feedback, String mistakes, String idealAnswer) {
        this.clarityScore = clarityScore;
        this.technicalScore = technicalScore;
        this.communicationScore = communicationScore;
        this.feedback = feedback;
        this.mistakes = mistakes;
        this.idealAnswer = idealAnswer;
    }

    public int getClarityScore() { return clarityScore; }
    public void setClarityScore(int clarityScore) { this.clarityScore = clarityScore; }
    public int getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(int technicalScore) { this.technicalScore = technicalScore; }
    public int getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(int communicationScore) { this.communicationScore = communicationScore; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getMistakes() { return mistakes; }
    public void setMistakes(String mistakes) { this.mistakes = mistakes; }
    public String getIdealAnswer() { return idealAnswer; }
    public void setIdealAnswer(String idealAnswer) { this.idealAnswer = idealAnswer; }
}
