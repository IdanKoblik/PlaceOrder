import React, { useState, useEffect } from 'react';
import { Calendar, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { CreateEventRequest, OrderResponse } from '../../../src/modules/order';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState<CreateEventRequest>({
    token: '',
    name: '',
    note: '',
    time: '',
    phone_number: '',
    guests: 0,
    table_num: 0,
    active: 0
  });
  const [reservations, setReservations] = useState<OrderResponse[]>([]);

  useEffect(() => {
    fetchReservationsForToday();
  }, []);

  const fetchReservationsForToday = async () => {
    const response = await fetch("http://localhost:3001/orders/get?today=true", {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      alert(t('Error fetching reservations'));
      throw new Error(`Error! status: ${response.status}`);
    }

    const data = await response.json();
    setReservations(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    const updatedEventForm = { ...eventForm, token: accessToken! };
    const response = await fetch("http://localhost:3001/orders/create", {
      method: "POST",
      body: JSON.stringify(updatedEventForm),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      alert(t('Error scheduling'));
      throw new Error(`Error! status: ${response.status}`);
    }

    alert(t('Success'));
    setShowModal(false);
    setEventForm({
      token: '',
      name: '',
      note: '',
      time: '',
      phone_number: '',
      guests: 0,
      table_num: 0,
      active: 0
    });

    fetchReservationsForToday();
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); 
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h1 className="ml-2 text-xl font-semibold text-gray-800">BeerLine - {t('Calendar Dashboard')}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {t('Logout')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('Create Event')}
          </button>
          
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
        </div>

        {/* Reservations Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('Reservations for Today')}</h2>
          {reservations.length === 0 ? (
            <p>{t('No reservations for today')}</p>
          ) : (
            <ul className="space-y-4">
              {reservations.map((reservation, index) => (
                <li key={index} className="border p-4 rounded-lg">
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">{t('Create New Event')}</h2>
              <form onSubmit={handleCreateEvent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Event Title')}</label>
                    <input
                      type="text"
                      value={eventForm.name}
                      onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Phone number')}</label>
                    <input
                      type="text"
                      value={eventForm.phone_number}
                      onChange={(e) => setEventForm({ ...eventForm, phone_number: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Table number')}</label>
                    <input
                      type="number"
                      value={eventForm.table_num}
                      onChange={(e) => setEventForm({ ...eventForm, table_num: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Guest number')}</label>
                    <input
                      type="number"
                      value={eventForm.guests}
                      onChange={(e) => setEventForm({ ...eventForm, guests: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Note')}</label>
                    <textarea
                      value={eventForm.note}
                      onChange={(e) => setEventForm({ ...eventForm, note: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Start Date & Time')}</label>
                    <input
                      type="datetime-local"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {t('Create Event')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;