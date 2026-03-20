import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Mic, LogOut } from 'lucide-react';

const Navbar = ({ user, setUser, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
              <Mic className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">InterviewCoach</span>
              <span className="sm:hidden">Coach</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 sm:p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex-shrink-0"
            >
              {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            
            {user && (
              <>
                <Link to="/dashboard" className="text-sm sm:text-base whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Dashboard</Link>
                <Link to="/resume" className="text-sm sm:text-base whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">New</Link>
                <div className="flex items-center space-x-1 sm:space-x-2 border-l border-gray-300 dark:border-gray-600 pl-2 sm:pl-4 ml-1 sm:ml-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm truncate max-w-[80px] sm:max-w-none">{user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex-shrink-0">
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
