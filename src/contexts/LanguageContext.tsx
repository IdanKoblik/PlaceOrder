import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, Translation } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Translation> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      reservations: 'Reservations',
      tables: 'Tables',
      customers: 'Customers',
      reports: 'Reports'
    },
    areas: {
      bar: 'Bar Area',
      inside: 'Inside Dining',
      outside: 'Outside Patio'
    },
    reservation: {
      newReservation: 'New Reservation',
      customerName: 'Customer Name',
      phoneNumber: 'Phone Number',
      partySize: 'Party Size',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      specialRequests: 'Special Requests',
      confirmReservation: 'Confirm Reservation',
      editReservation: 'Edit Reservation',
      cancelReservation: 'Cancel Reservation',
      searchReservations: 'Search Reservations...'
    },
    table: {
      available: 'Available',
      reserved: 'Reserved',
      occupied: 'Occupied',
      maintenance: 'Maintenance',
      capacity: 'Capacity',
      selectTables: 'Select Tables'
    },
    time: {
      hours: 'hours',
      minutes: 'minutes',
      from: 'From',
      to: 'To',
      today: 'Today',
      tomorrow: 'Tomorrow'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      export: 'Export'
    },
    status: {
      confirmed: 'Confirmed',
      seated: 'Seated',
      completed: 'Completed',
      cancelled: 'Cancelled',
      noShow: 'No Show'
    },
    messages: {
      reservationCreated: 'Reservation created successfully',
      reservationUpdated: 'Reservation updated successfully',
      reservationCancelled: 'Reservation cancelled',
      noTablesAvailable: 'No tables available for selected time',
      conflictDetected: 'Conflict detected with existing reservation'
    }
  },
  he: {
    nav: {
      dashboard: 'לוח בקרה',
      reservations: 'הזמנות',
      tables: 'שולחנות',
      customers: 'לקוחות',
      reports: 'דוחות'
    },
    areas: {
      bar: 'אזור הבר',
      inside: 'אזור פנימי',
      outside: 'מרפסת חיצונית'
    },
    reservation: {
      newReservation: 'הזמנה חדשה',
      customerName: 'שם הלקוח',
      phoneNumber: 'מספר טלפון',
      partySize: 'מספר אורחים',
      date: 'תאריך',
      time: 'שעה',
      duration: 'משך זמן',
      specialRequests: 'בקשות מיוחדות',
      confirmReservation: 'אישור הזמנה',
      editReservation: 'עריכת הזמנה',
      cancelReservation: 'ביטול הזמנה',
      searchReservations: 'חיפוש הזמנות...'
    },
    table: {
      available: 'זמין',
      reserved: 'מוזמן',
      occupied: 'תפוס',
      maintenance: 'תחזוקה',
      capacity: 'קיבולת',
      selectTables: 'בחירת שולחנות'
    },
    time: {
      hours: 'שעות',
      minutes: 'דקות',
      from: 'מ',
      to: 'עד',
      today: 'היום',
      tomorrow: 'מחר'
    },
    actions: {
      save: 'שמור',
      cancel: 'ביטול',
      delete: 'מחק',
      edit: 'ערוך',
      confirm: 'אישור',
      search: 'חפש',
      filter: 'סנן',
      export: 'ייצא'
    },
    status: {
      confirmed: 'מאושר',
      seated: 'מושב',
      completed: 'הושלם',
      cancelled: 'בוטל',
      noShow: 'לא הגיע'
    },
    messages: {
      reservationCreated: 'ההזמנה נוצרה בהצלחה',
      reservationUpdated: 'ההזמנה עודכנה בהצלחה',
      reservationCancelled: 'ההזמנה בוטלה',
      noTablesAvailable: 'אין שולחנות זמינים בזמן הנבחר',
      conflictDetected: 'זוהה קונפליקט עם הזמנה קיימת'
    }
  },
  ru: {
    nav: {
      dashboard: 'Панель управления',
      reservations: 'Бронирования',
      tables: 'Столики',
      customers: 'Клиенты',
      reports: 'Отчёты'
    },
    areas: {
      bar: 'Барная зона',
      inside: 'Внутренний зал',
      outside: 'Летняя терраса'
    },
    reservation: {
      newReservation: 'Новое бронирование',
      customerName: 'Имя клиента',
      phoneNumber: 'Номер телефона',
      partySize: 'Количество гостей',
      date: 'Дата',
      time: 'Время',
      duration: 'Продолжительность',
      specialRequests: 'Особые пожелания',
      confirmReservation: 'Подтвердить бронирование',
      editReservation: 'Редактировать бронирование',
      cancelReservation: 'Отменить бронирование',
      searchReservations: 'Поиск бронирований...'
    },
    table: {
      available: 'Свободен',
      reserved: 'Забронирован',
      occupied: 'Занят',
      maintenance: 'Обслуживание',
      capacity: 'Вместимость',
      selectTables: 'Выбрать столики'
    },
    time: {
      hours: 'часов',
      minutes: 'минут',
      from: 'с',
      to: 'до',
      today: 'Сегодня',
      tomorrow: 'Завтра'
    },
    actions: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      confirm: 'Подтвердить',
      search: 'Поиск',
      filter: 'Фильтр',
      export: 'Экспорт'
    },
    status: {
      confirmed: 'Подтверждён',
      seated: 'Размещён',
      completed: 'Завершён',
      cancelled: 'Отменён',
      noShow: 'Не явился'
    },
    messages: {
      reservationCreated: 'Бронирование успешно создано',
      reservationUpdated: 'Бронирование успешно обновлено',
      reservationCancelled: 'Бронирование отменено',
      noTablesAvailable: 'Нет свободных столиков на выбранное время',
      conflictDetected: 'Обнаружен конфликт с существующим бронированием'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const isRTL = language === 'he';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};