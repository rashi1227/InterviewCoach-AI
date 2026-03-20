package com.interviewcoach.repository;

import com.interviewcoach.entity.Interview;
import com.interviewcoach.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserOrderByDateDesc(User user);
}
