import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateEventRequest } from '../../../src/modules/order';

interface CreateOrderMenuProps {
  tableNumber?: number;
  isDarkMode: boolean;
  setShowModal: (show: boolean) => void;
}

const CreateOrderMenu: React.FC<CreateOrderMenuProps> = ({ tableNumber, isDarkMode, setShowModal }) => {
  const { t } = useTranslation();
  const [eventForm, setEventForm] = useState<CreateEventRequest>({
    token: '',
    name: '',
    note: '',
    time: '',
    phone_number: '',
    guests: 0,
    table_num: tableNumber || 0,
    active: 0
  });

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toISOString();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventForm.name,
          description: eventForm.note,
          start: {
            dateTime: formatDateTime(eventForm.time),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: formatDateTime(eventForm.time),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create event');
      }

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
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
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
                value={eventForm.phone_number}
                onChange={(e) => setEventForm({ ...eventForm, phone_number: e.target.value })}
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
                value={eventForm.table_num}
                onChange={(e) => setEventForm({ ...eventForm, table_num: parseInt(e.target.value) })}
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
              <input
                type="datetime-local"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
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
    </div>
  );
};

export default CreateOrderMenu;