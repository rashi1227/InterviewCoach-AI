import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Bot, Sparkles, Code2, GraduationCap } from 'lucide-react';

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The backend actually handles both login and signup in one endpoint right now,
      // but separating the UI gives clarity to the user.
      const { data } = await axiosClient.post('/users/login', { 
        name: isSignup ? name : 'Student', // Fake name if just logging in, though backend uses it if new
        email 
      });
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login/Signup failed', err);
      alert('Authentication failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-4">
      {/* Top/Left Side - Creative Student Branding */}
      <div className="flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-purple-600 to-blue-700 p-8 lg:p-12 text-white flex-col justify-center lg:justify-between overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 opacity-20 animate-pulse"><Code2 size={120} /></div>
        <div className="absolute -bottom-10 -left-10 opacity-20"><GraduationCap size={180} /></div>
        <div className="absolute top-1/2 left-1/4 opacity-30 animate-bounce hidden sm:block"><Sparkles size={60} /></div>

        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 lg:mt-0">
          <div className="flex items-center space-x-3 mb-6 lg:mb-8">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Bot size={32} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">InterviewCoach AI</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-2 lg:mb-6">
            Land your dream <br className="hidden lg:block"/> tech job faster.
          </h1>
          <p className="hidden md:block lg:block text-lg lg:text-xl text-primary-100 max-w-md leading-relaxed mt-4">
            Practice AI-driven mock interviews, get instant actionable feedback, and conquer your next coding interview with confidence.
          </p>
        </div>
        
        <div className="relative z-10 hidden lg:flex items-center space-x-4 mt-12">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <img key={i} className="w-10 h-10 rounded-full border-2 border-primary-300" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" />
            ))}
          </div>
          <p className="text-sm font-medium text-primary-100">Join 10,000+ CS students practicing today</p>
        </div>
      </div>

      {/* Bottom/Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8 lg:mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              {isSignup ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
              {isSignup ? "Start your interview prep journey today." : "Log in to track your interview progress."}
            </p>
          </div>

          <form className="space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="transition-all duration-300 transform scale-100 opacity-100">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required={isSignup}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-base sm:text-lg"
                  placeholder="e.g. Alice Hacker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">University / Personal Email</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-base sm:text-lg"
                placeholder="alice@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] text-base sm:text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isSignup ? 'Creating Account...' : 'Signing in...') : (isSignup ? 'Start Practicing Now' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 text-center text-base sm:text-lg">
            <p className="text-gray-600 dark:text-gray-400">
              {isSignup ? "Already have an account?" : "New to InterviewCoach?"}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 font-extrabold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
              >
                {isSignup ? "Sign in instead" : "Create an account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
