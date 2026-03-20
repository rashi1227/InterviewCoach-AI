import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Square, PlayCircle, Loader2, CheckCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Interview = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId, questions, role } = location.state || {};
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 mins per question
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/dashboard');
      return;
    }
  }, [questions, navigate]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartRecording = () => {
    setTranscript('');
    setTimeLeft(120);
    setIsRecording(true);
    setFeedback(null);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;
    
    setEvaluating(true);
    try {
      const currentQuestion = questions[currentIdx];
      const res = await axiosClient.post(`/interviews/questions/${currentQuestion.id}/submit-answer`, {
        answerText: transcript
      });
      setFeedback(res.data);
    } catch (err) {
      console.error('Submit answer err:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTranscript('');
      setFeedback(null);
      setTimeLeft(120);
    } else {
      navigate('/dashboard');
    }
  };

  if (!questions) return null;

  const currentQ = questions[currentIdx];
  const isHR = currentQ.text.startsWith('[HR]');
  const isTech = currentQ.text.startsWith('[Technical]');
  const cleanText = currentQ.text.replace(/^\[HR\]\s?|^\[Technical\]\s?/, '');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-100 dark:bg-gray-700">
          <div className="h-1 bg-primary-500 transition-all duration-300" style={{ width: `${((currentIdx) / questions.length) * 100}%` }}></div>
        </div>
        
        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex items-center space-x-3">
             <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Question {currentIdx + 1} of {questions.length}</span>
             {isHR && <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-tighter">Behavioral / HR</span>}
             {isTech && <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-tighter">Technical Round</span>}
          </div>
          <div className={`text-xl font-mono px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed">
          {cleanText}
        </h2>
        
        <button onClick={() => speakQuestion(currentQ.text)} className="mt-4 flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 transition">
          <PlayCircle className="w-5 h-5 mr-1" /> Listen to Question
        </button>
      </div>

      {/* Recording Area */}
      {!feedback ? (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        
        <div className="w-full min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
          {transcript || "Your answer will appear here..."}
        </div>

        <div className="mt-8 flex items-center space-x-6">
          {!isRecording ? (
            <button
               onClick={handleStartRecording}
               className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
            >
              <Mic className="w-8 h-8" />
            </button>
          ) : (
            <button
               onClick={handleStopRecording}
               className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30"
            >
              <Square className="w-8 h-8 fill-current" />
            </button>
          )}
          
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
               {isRecording ? "Recording in progress..." : "Click microphone to answer"}
            </span>
            {isRecording && <span className="text-sm text-red-500">Speak clearly into your microphone</span>}
          </div>
        </div>

        {transcript && !isRecording && (
          <button
            onClick={handleSubmitAnswer}
            disabled={evaluating}
            className="mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-75 flex justify-center items-center text-lg shadow-md"
          >
            {evaluating ? <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Evaluating Answer...</> : 'Submit Final Answer'}
          </button>
        )}
      </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-center mb-6 text-green-500">
              <CheckCircle className="w-12 h-12 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Answer Evaluated</h2>
           </div>
           
           <div className="grid grid-cols-3 gap-4 mb-6 text-center">
             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Clarity</p>
                <p className="text-2xl font-bold text-blue-500">{feedback.clarityScore}/10</p>
             </div>
             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Technical</p>
                <p className="text-2xl font-bold text-green-500">{feedback.technicalScore}/10</p>
             </div>
             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Communication</p>
                <p className="text-2xl font-bold text-purple-500">{feedback.communicationScore}/10</p>
             </div>
           </div>

            <div className="space-y-4">
             <div>
               <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overall Feedback</h3>
               <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 whitespace-pre-wrap">{feedback.feedback}</p>
             </div>
             <div>
               <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Mistakes Identified</h3>
               <p className="text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 whitespace-pre-wrap">{feedback.mistakes}</p>
             </div>
             <div>
               <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Ideal Correct Answer</h3>
               <div className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 whitespace-pre-wrap">
                 {feedback.idealAnswer}
               </div>
             </div>
           </div>

           <button
            onClick={nextQuestion}
            className="mt-8 w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-md"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Interview & View Dashboard'}
          </button>
        </div>
      )}

    </div>
  );
};

export default Interview;
