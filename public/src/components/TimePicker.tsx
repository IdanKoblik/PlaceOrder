import React, { useEffect, useState } from 'react';
import { API_URL } from '../App';
import { Order } from '../../../src/modules/order';

interface TimeSlot {
  hour: number;
  minute: number;
}

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minTime?: TimeSlot;
  maxTime?: TimeSlot;
  isDarkMode?: boolean;
  tableNumber: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minTime = { hour: 9, minute: 0 },
  maxTime = { hour: 22, minute: 0 },
  isDarkMode = false,
  tableNumber
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    value.toISOString().split('T')[0]
  );
  const [selectedHour, setSelectedHour] = useState<number>(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(value.getMinutes());
  const [reservedSlots, setReservedSlots] = useState<Set<string>>(new Set());

  const fetchReservations = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/?tableNumber=${tableNumber}`, {
        method: "GET"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get reservations');
      }

      const reservations: Order[] = await response.json();
      const reserved = new Set<string>();

      reservations.forEach((reservation: Order) => {
        const reservationDate = new Date(reservation.time);
        const reservationDateStr = reservationDate.toISOString().split('T')[0];
        
        if (reservationDateStr === date) {
          const timeKey = `${reservationDate.getHours()}-${reservationDate.getMinutes()}`;
          reserved.add(timeKey);
        }
      });

      setReservedSlots(reserved);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, tableNumber]);

  const generateTimeOptions = () => {
    const options: { startHour: number; startMinute: number; endHour: number; endMinute: number }[] = [];
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    
    for (let hour = minTime.hour; hour <= maxTime.hour - 2; hour += 2) {
      // Skip times in the past if it's today
      if (isToday && hour < now.getHours()) {
        continue;
      }

      const timeKey = `${hour}-0`;
      if (!reservedSlots.has(timeKey)) {
        options.push({
          startHour: hour,
          startMinute: 0,
          endHour: hour + 2,
          endMinute: 0
        });
      }
    }
    
    return options;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    updateDateTime(newDate, selectedHour, selectedMinute);
  };

  const handleTimeChange = (startHour: number, startMinute: number) => {
    setSelectedHour(startHour);
    setSelectedMinute(startMinute);
    updateDateTime(selectedDate, startHour, startMinute);
  };

  const updateDateTime = (date: string, hour: number, minute: number) => {
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    onChange(newDate);
  };

  const formatTimeRange = (startHour: number, startMinute: number, endHour: number, endMinute: number): string => {
    const formatTime = (hour: number, minute: number) => 
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return `${formatTime(startHour, startMinute)}-${formatTime(endHour, endMinute)}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className={`block w-full rounded-md ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300 text-gray-900'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          Time Slots (2 hours)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {generateTimeOptions().map(({ startHour, startMinute, endHour, endMinute }) => (
            <button
              key={`${startHour}-${startMinute}`}
              onClick={() => handleTimeChange(startHour, startMinute)}
              className={`p-2 text-sm rounded-md transition-colors ${
                selectedHour === startHour && selectedMinute === startMinute
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatTimeRange(startHour, startMinute, endHour, endMinute)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};