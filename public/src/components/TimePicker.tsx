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
  minuteStep?: number;
  minTime?: TimeSlot;
  maxTime?: TimeSlot;
  isDarkMode?: boolean;
  tableNumber: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minuteStep = 15,
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
  const [unavailableTimes, setUnavailableTimes] = useState<Set<string>>(new Set());

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
      const blockedTimes = new Set<string>();

      reservations.forEach((reservation: Order) => {
        const reservationDate = new Date(reservation.time);
        const reservationDateStr = reservationDate.toISOString().split('T')[0];
        
        // Only process reservations for the selected date
        if (reservationDateStr === date) {
          // Block 2 hours before and after the reservation
          for (let i = -2; i <= 2; i++) {
            const blockTime = new Date(reservationDate);
            blockTime.setHours(blockTime.getHours() + i);
            
            // Block all time slots within each hour
            for (let minute = 0; minute < 60; minute += minuteStep) {
              const timeKey = `${blockTime.getHours()}-${minute}`;
              blockedTimes.add(timeKey);
            }
          }
        }
      });

      setUnavailableTimes(blockedTimes);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, tableNumber]);

  const generateTimeOptions = () => {
    const options: { hour: number; minute: number }[] = [];
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    
    for (let hour = minTime.hour; hour <= maxTime.hour; hour++) {
      const startMinute = hour === minTime.hour ? minTime.minute : 0;
      const endMinute = hour === maxTime.hour ? maxTime.minute : 59;
      
      for (let minute = startMinute; minute <= endMinute; minute += minuteStep) {
        // Skip times in the past if it's today
        if (isToday && (
          hour < now.getHours() || 
          (hour === now.getHours() && minute < now.getMinutes())
        )) {
          continue;
        }

        const timeKey = `${hour}-${minute}`;
        if (!unavailableTimes.has(timeKey)) {
          options.push({ hour, minute });
        }
      }
    }
    
    return options;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    updateDateTime(newDate, selectedHour, selectedMinute);
  };

  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    updateDateTime(selectedDate, hour, minute);
  };

  const updateDateTime = (date: string, hour: number, minute: number) => {
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    onChange(newDate);
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
          Time
        </label>
        <div className="grid grid-cols-4 gap-2">
          {generateTimeOptions().map(({ hour, minute }) => (
            <button
              key={`${hour}-${minute}`}
              onClick={() => handleTimeChange(hour, minute)}
              className={`p-2 text-sm rounded-md transition-colors ${
                selectedHour === hour && selectedMinute === minute
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatTime(hour, minute)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};