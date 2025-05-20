import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateOrderRequest } from '../../../src/modules/order';
import { API_URL } from '../App';
import { TimePicker } from './TimePicker';

interface CreateOrderMenuProps {
  tableNumber?: number;
  isDarkMode: boolean;
  setShowModal: (show: boolean) => void;
}

const CreateOrderMenu: React.FC<CreateOrderMenuProps> = ({ tableNumber, isDarkMode, setShowModal }) => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventForm, setEventForm] = useState<CreateOrderRequest>({
    googleToken: '',
    name: '',
    note: '',
    time: new Date().toISOString(),
    phoneNumber: '',
    guests: 0,
    tableNumber: tableNumber || 0,
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/orders/create`, {
      method: "PUT",
      body: JSON.stringify({ ...eventForm, googleToken: accessToken! }),
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
      googleToken: '',
      name: '',
      note: '',
      time: '',
      phoneNumber: '',
      guests: 0,
      tableNumber: 0,
    });
  };

  const handleDateTimeChange = (date: Date) => {
    setEventForm(prev => ({
      ...prev,
      time: date.toISOString()
    }));
    setShowDatePicker(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md transition-colors`}>
        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('Create New Event')}
        </h2>
        <form onSubmit={handleCreateEvent}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Event Title')}
              </label>
              <input
                type="text"
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Description')}
              </label>
              <textarea
                value={eventForm.note}
                onChange={(e) => setEventForm({ ...eventForm, note: e.target.value })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                rows={3}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Phone Number')}
              </label>
              <input
                type="tel"
                value={eventForm.phoneNumber}
                onChange={(e) => setEventForm({ ...eventForm, phoneNumber: e.target.value })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Number of Guests')}
              </label>
              <input
                type="number"
                value={eventForm.guests}
                onChange={(e) => setEventForm({ ...eventForm, guests: parseInt(e.target.value) })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Table Number')}
              </label>
              <input
                type="number"
                value={eventForm.tableNumber}
                onChange={(e) => setEventForm({ ...eventForm, tableNumber: parseInt(e.target.value) })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('Date & Time')}
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!eventForm.tableNumber) {
                    alert("table num req!");
                    return;
                  }
                
                  setShowDatePicker(true);
                }}
                className={`mt-1 block w-full text-left px-3 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              >
                {eventForm.time ? new Date(eventForm.time).toLocaleString() : t('Select Date & Time')}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`px-4 py-2 rounded-md ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {t('Create Event')}
            </button>
          </div>
        </form>
      </div>

      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('Select Date & Time')}
              </h3>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('Cancel')}
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              <TimePicker
                value={new Date(eventForm.time)}
                onChange={handleDateTimeChange}
                minTime={{ hour: 9, minute: 0 }}
                maxTime={{ hour: 22, minute: 0 }}
                isDarkMode={isDarkMode}
                tableNumber={eventForm.tableNumber}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderMenu;