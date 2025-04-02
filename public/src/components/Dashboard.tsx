import React, { useState, useEffect } from 'react';
import { Calendar, LogOut, Plus, Trash2, Layout, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TableLayout from '../layouts/TableLayout';
import '../i18n';
import { CreateEventRequest, RemoveOrderRequest, UpdateActivityRequest } from '../../../src/modules/order';
import CreateOrderMenu from './CreateOrderMenu';
import { table } from 'console';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showTableLayout, setShowTableLayout] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [reservations, setReservations] = useState<RemoveOrderRequest[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    fetchReservationsForToday();
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const fetchReservationsForToday = async () => {
    // TODO Implementation for fetching reservations
  };

  const removeReservation = async (index: number) => {
    // TODO Implementation for removing reservation
  };

  const setActivity = async (index: number) => {
    // TODO Implementation for setting activity
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h1 className={`ml-2 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                BeerLine - {t('Calendar Dashboard')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'} hover:opacity-80 transition-all`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setShowTableLayout(true)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-200 text-blue-600'} hover:opacity-80 transition-all`}
              >
                <Layout size={20} />
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t('Logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center px-4 py-2 ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg transition-colors`}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('Create Event')}
          </button>
          
          <div className="flex space-x-2">
            {['en', 'ru', 'he'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : 'עברית'}
              </button>
            ))}
          </div>
        </div>

        <div className={`${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } p-6 rounded-lg shadow-md mb-6 transition-colors`}>
          <h2 className="text-2xl font-semibold mb-4">{t('Reservations for Today')}</h2>
          {reservations.length === 0 ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {t('No reservations for today')}
            </p>
          ) : (
            <ul className="space-y-4">
              {reservations.map((reservation, index) => (
                <li
                  key={index}
                  className={`border p-4 rounded-lg relative transition-all ${
                    isDarkMode
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      : 'border-gray-200 hover:shadow-lg bg-white'
                  }`}
                >
                  <button 
                    onClick={() => removeReservation(index)} 
                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                  
                  <button 
                    onClick={() => setActivity(index)} 
                    className="absolute top-12 right-2 p-1"
                  >
                    {reservation.active === 1 ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </button>

                  <h3 className="text-lg font-semibold">{reservation.name}</h3>
                  <p>{t('Phone number')}: {reservation.phone_number}</p>
                  <p>{t('Table number')}: {reservation.table_num}</p>
                  <p>{t('Guest number')}: {reservation.guests}</p>
                  <p>{t('Note')}: {reservation.note}</p>
                  <p>{t('Time')}: {new Date(reservation.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showModal && (
          <div>
            <CreateOrderMenu
              setSelectedTable={() => null}
              isDarkMode = {isDarkMode}
              setShowModal={(show) => setShowModal(show)}
            />
          </div>
        )}

        {showTableLayout && (
          <TableLayout onClose={() => setShowTableLayout(false)} isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;