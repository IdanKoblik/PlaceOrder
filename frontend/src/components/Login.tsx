import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import '../i18n';
import logo from '../assets/logo.png';

const Login: React.FC = () => {
  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.setItem('accessToken', response.access_token);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    },
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img 
            src={logo} 
            alt="Beerline-logo" 
            className="w-16 h-16 mb-4" 
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('Welcome Back')}</h1>
          <p className="text-gray-600 mb-8 text-center">
            {t('Sign in with Google v2')}
          </p>
           {/* Language Switcher Button */}
           <div>
            <button
              onClick={() => handleLanguageChange('en')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 mr-2"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 mr-2"
            >
              Русский
            </button>
            <button
              onClick={() => handleLanguageChange('he')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              עברית
            </button>
          </div>
          <button
            onClick={() => login()}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            {t('Sign in with Google')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
