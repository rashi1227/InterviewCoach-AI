package com.interviewcoach.service;

import com.interviewcoach.dto.AiEvaluationResponse;
import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

@Service
@ConditionalOnProperty(name = "ai.provider", havingValue = "mock", matchIfMissing = true)
public class MockAiService implements AiService {

    @Override
    public List<String> generateQuestions(String resumeContent, String role, String experienceLevel, Integer yearsOfExperience, int count) {
        boolean isExperienced = "Experienced".equalsIgnoreCase(experienceLevel) || (yearsOfExperience != null && yearsOfExperience > 0);
        int years = (yearsOfExperience != null) ? yearsOfExperience : 0;

        // 1. HR Questions Pool (Adjusted for experience)
        List<String> hrPool = new ArrayList<>();
        if (!isExperienced) {
            hrPool.addAll(Arrays.asList(
                "Tell me about your academic background and why you chose " + role + ".",
                "Describe a successful project you completed during your studies.",
                "How do you prioritize your learning in a fast-paced environment?",
                "What made you interested in the tech industry?",
                "How do you handle feedback from professors or mentors?",
                "What is your biggest accomplishment outside of academics?"
            ));
        } else {
            hrPool.addAll(Arrays.asList(
                "Walk me through your career journey and your transition into your current role.",
                "Describe a time you had to lead a project or mentor a junior team member.",
                "How do you manage complex stakeholder expectations in a " + years + "-year career?",
                "Tell me about a time you failed to meet a deadline. How did you recover?",
                "What is your philosophy on building scalable and maintainable team processes?",
                "How do you decide which technical debt to pay down first?"
            ));
        }
        
        // 2. Technical Questions mapped by Role & Difficulty
        Map<String, List<String>> juniorTech = new HashMap<>();
        Map<String, List<String>> seniorTech = new HashMap<>();
        
        // --- Software Engineer ---
        juniorTech.put("Software Engineer", Arrays.asList(
            "Explain the difference between an Abstract Class and an Interface.",
            "What is Recursion? Can you give an example of when to use it over a loop?",
            "How does a Hash Map work under the hood?",
            "Explain the basic principles of Object-Oriented Programming (OOP).",
            "What is the difference between a Stack and a Queue data structure?"
        ));
        seniorTech.put("Software Engineer", Arrays.asList(
            "Design a URL shortening service (like Bitly). How would you handle scaling and concurrency?",
            "How do you approach refactoring a large legacy codebase without breaking existing features?",
            "Explain the CAP theorem and how it influences your choice of database for a distributed system.",
            "Describe your experience with CI/CD pipelines and how you ensure high code quality at scale.",
            "How would you optimize a system experiencing high latency in its microservices communication?"
        ));

        // --- Frontend Developer ---
        juniorTech.put("Frontend Developer", Arrays.asList(
            "What is the difference between 'let', 'const', and 'var' in JavaScript?",
            "Explain the concept of CSS specificity and the Box Model.",
            "What are React Hooks, and why were they introduced?",
            "How do you handle basic form validation in a React component?",
            "Describe the difference between client-side and server-side rendering."
        ));
        seniorTech.put("Frontend Developer", Arrays.asList(
            "How would you architect a large-scale design system that works across multiple micro-frontends?",
            "Explain your strategy for Web Vitals optimization and reducing Time to Interactive (TTI).",
            "How do you handle complex state synchronization across multiple browser tabs?",
            "Describe your approach to implementing secure authentication (JWT/OAuth) in a SPA.",
            "How do you manage cross-browser compatibility for advanced CSS features and Web APIs?"
        ));

        // --- Backend Developer ---
        juniorTech.put("Backend Developer", Arrays.asList(
            "What is a RESTful API, and what are the main HTTP methods used?",
            "Explain the difference between a SQL and a NoSQL database.",
            "What is an ORM (like Hibernate), and what are its benefits/drawbacks?",
            "How do you handle basic error logging in a backend service?",
            "Explain the concept of environment variables and why we use them."
        ));
        seniorTech.put("Backend Developer", Arrays.asList(
            "Design a highly available notification system that can handle millions of events per second.",
            "How do you implement distributed locking in a microservices environment?",
            "Describe your strategy for database sharding and partitioning for a high-growth app.",
            "How do you ensure data consistency across multiple services using the Saga pattern or 2PC?",
            "Explain how you would secure a cloud-native backend against DDoS and SQL injection attacks."
        ));

        // Get the appropriate tech pool
        List<String> roleTech = (isExperienced ? seniorTech : juniorTech).get(role);
        if (roleTech == null) {
            roleTech = Arrays.asList(
                "Explain a complex technical concept you recently learned.",
                "Describe your favorite project and the technical choices you made.",
                "How do you approach learning a new programming language or framework?",
                "What tools do you use for debugging and performance profiling?",
                "Walk me through a difficult technical bug you solved."
            );
        }
        
        List<String> mutableHR = new ArrayList<>(hrPool);
        List<String> mutableTech = new ArrayList<>(roleTech);
        
        Collections.shuffle(mutableHR);
        Collections.shuffle(mutableTech);
        
        List<String> finalQuestions = new ArrayList<>();
        
        // Add HR questions (Labels for UI logic later)
        int hrCount = (count > 2) ? 2 : 1;
        for(int i = 0; i < hrCount; i++) {
            finalQuestions.add("[HR] " + mutableHR.get(i));
        }
        
        // Add Technical questions
        int techRemaining = count - finalQuestions.size();
        for(int i = 0; i < Math.min(techRemaining, mutableTech.size()); i++) {
            finalQuestions.add("[Technical] " + mutableTech.get(i));
        }
        
        return finalQuestions;
    }

    @Override
    public AiEvaluationResponse evaluateAnswer(String question, String answer) {
        if (answer == null || answer.trim().isEmpty()) {
            return new AiEvaluationResponse(1, 1, 1, "No answer provided.", "Missing answer content.", "An ideal answer directly addresses the question with specific details.");
        }
        
        String lowerAnswer = answer.toLowerCase();
        String[] words = lowerAnswer.split("\\s+");
        int wordCount = words.length;
        
        // 1. Communication Score
        int fillerCount = 0;
        String[] fillers = {"um", "uh", "like", "basically", "you know", "sort of", "kinda"};
        for (String word : words) {
            for (String filler : fillers) {
                if (word.equals(filler)) fillerCount++;
            }
        }
        
        int communicationScore = 10;
        if (fillerCount >= 2) communicationScore -= 2;
        if (fillerCount >= 5) communicationScore -= 2;
        if (wordCount < 10) communicationScore -= 3;
        communicationScore = Math.max(1, communicationScore);
        
        // 2. Clarity Score
        int clarityScore = 5;
        String[] transitions = {"first", "second", "however", "therefore", "specifically", "for example", "resulted in", "because"};
        for (String transition : transitions) {
            if (lowerAnswer.contains(transition)) clarityScore += 1;
        }
        if (wordCount > 30) clarityScore += 2;
        if (wordCount < 15) clarityScore -= 2;
        clarityScore = Math.min(10, Math.max(1, clarityScore));
        
        // 3. Technical Score
        int technicalScore = 4;
        String[] actionVerbs = {"developed", "designed", "implemented", "managed", "created", "built", "optimized", "analyzed", "led", "resolved", "improved", "integrated"};
        int actionsFound = 0;
        for (String verb : actionVerbs) {
            if (lowerAnswer.contains(verb)) actionsFound++;
        }
        technicalScore += (actionsFound * 2);
        if (wordCount > 40) technicalScore += 1;
        technicalScore = Math.min(10, Math.max(1, technicalScore));
        
        // 4. Feedback Generation
        StringBuilder feedback = new StringBuilder();
        if (wordCount < 15) {
            feedback.append("Try to expand more on your points. ");
        } else {
            feedback.append("Good length and coverage. ");
        }
        if (technicalScore >= 7) {
            feedback.append("Strong technical depth shown. ");
        } else {
            feedback.append("Consider adding more specific technical details. ");
        }
        
        // 4. Highlight Mistakes
        StringBuilder mistakes = new StringBuilder();
        if (fillerCount > 0) {
            mistakes.append("Used ").append(fillerCount).append(" filler words (").append(String.join(", ", fillers)).append("). ");
        }
        if (wordCount < 20) {
            mistakes.append("Answer was too short to demonstrate depth. ");
        }
        if (technicalScore < 5) {
            mistakes.append("Lacked specific technical action verbs like 'optimized' or 'implemented'. ");
        }
        if (mistakes.length() == 0) {
            mistakes.append("No major mistakes identified. Focus on refining your delivery speed.");
        }

        // 5. Ideal Answer Strategy with Example and Explanation
        String ideal = "### How to Answer Properly:\n" +
                          "You should use the **STAR Method** to ensure your answer is structured and impactful.\n\n" +
                          "### Example Answer:\n" +
                          "\"When faced with " + question.replace("[HR] ", "").replace("[Technical] ", "") + ", I approach it by first identifying the core objective.\n\n" +
                          "For example, in my last project, I **implemented** a solution that **optimized** our data processing speed by 30%. I used specific tools like React and Node.js to achieve this, ensuring the codebase remained **maintainable**.\"\n\n" +
                          "### Explanation:\n" +
                          "• **Context:** Start by acknowledging the challenge.\n\n" +
                          "• **Action Verbs:** Use words like 'implemented', 'optimized', and 'architected' (as seen in the example).\n\n" +
                          "• **Metrics:** Always try to quantify your results (e.g., '30% speed increase') to show real-world impact.\n\n" +
                          "• **Clarity:** Keep your sentences concise and use transition words.";
                          
        return new AiEvaluationResponse(clarityScore, technicalScore, communicationScore, feedback.toString(), mistakes.toString(), ideal);
    }
}
