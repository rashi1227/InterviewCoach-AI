import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const ResumeUpload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartInterview = async () => {
    if (!file || !role) return alert('Please upload a resume and specify a role.');
    setLoading(true);
    
    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      const resumeRes = await axiosClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const resumeId = resumeRes.data.id;

      // 2. Start Interview
      const interviewRes = await axiosClient.post('/interviews/start', {
        userId: user.id,
        role: role,
        experienceLevel: experienceLevel,
        yearsOfExperience: experienceLevel === 'Experienced' ? parseInt(yearsOfExperience) : 0
      });
      const interviewId = interviewRes.data.id;

      // 3. Generate Questions
      const questionsRes = await axiosClient.post(`/interviews/${interviewId}/generate-questions`, {
        resumeId: resumeId
      });

      // Navigate to Interview screen passing state
      navigate('/interview', {
        state: { 
          interviewId, 
          questions: questionsRes.data,
          role 
        }
      });

    } catch (err) {
      console.error('Failed to start interview', err);
      alert('Error starting interview. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Prepare for Interview</h2>
      
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Role</label>
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={role ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
              {role || "Select a role..."}
            </span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto top-full">
              {['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Mobile Developer', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer', 'Machine Learning Engineer', 'QA Engineer'].map(r => (
                <div 
                  key={r}
                  className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${role === r ? 'bg-primary-50 dark:bg-gray-600 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                  onClick={() => { setRole(r); setIsDropdownOpen(false); }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
            <select 
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="Fresher">Fresher / Student</option>
              <option value="Experienced">Experienced Professional</option>
            </select>
          </div>
          
          {experienceLevel === 'Experienced' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Exp.</label>
              <input 
                type="number"
                min="1"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
            </div>
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Resume (PDF)</label>
           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="space-y-1 text-center">
              {file ? (
                <div className="flex flex-col items-center text-primary-600 dark:text-primary-400">
                  <FileText className="mx-auto h-12 w-12" />
                  <span className="mt-2 font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">PDF up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleStartInterview}
          disabled={loading || !file || !role}
          className="w-full py-3 px-4 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
        >
          {loading ? 'Initializing Interface & Generating Questions...' : 'Start Mock Interview'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
