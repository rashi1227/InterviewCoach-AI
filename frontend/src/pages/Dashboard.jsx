import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { PlusCircle, Award, Target, MessageSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Dashboard = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosClient.get(`/interviews/users/${user.id}/dashboard`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  const hasData = data && data.recentInterviews && data.recentInterviews.length > 0;

  const chartData = [
    { name: 'Clarity', score: data?.averageClarity || 0 },
    { name: 'Technical', score: data?.averageTechnical || 0 },
    { name: 'Communication', score: data?.averageCommunication || 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your interview performance and improve your skills.</p>
        </div>
        <button
          onClick={() => navigate('/resume')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Start New Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard icon={<Target />} title="Average Clarity" value={data?.averageClarity?.toFixed(1) || 'N/A'} color="text-blue-500" />
        <StatusCard icon={<Award />} title="Average Technical" value={data?.averageTechnical?.toFixed(1) || 'N/A'} color="text-green-500" />
        <StatusCard icon={<MessageSquare />} title="Average Communication" value={data?.averageCommunication?.toFixed(1) || 'N/A'} color="text-purple-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Performance Overview</h2>
        {hasData ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis domain={[0, 10]} stroke="#8884d8" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none'}} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No interview data yet. Start your first mock interview to see analytics!</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Interviews</h2>
         {hasData ? (
           <div className="divide-y divide-gray-200 dark:divide-gray-700">
             {data.recentInterviews.map((interview) => (
                <div key={interview.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{interview.role}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(interview.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400 mr-2">
                        {interview.overallScore ? interview.overallScore.toFixed(1) : 'Processing'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ 10</span>
                  </div>
                </div>
             ))}
           </div>
         ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4">You haven't completed any interviews yet.</p>
         )}
      </div>
    </div>
  );
};

const StatusCard = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
    <div className={`p-4 rounded-full bg-opacity-10 dark:bg-opacity-20 bg-current ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default Dashboard;
