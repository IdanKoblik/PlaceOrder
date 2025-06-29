export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  vipStatus?: boolean;
}

export interface Table {
  id: string;
  name: string;
  area: 'bar' | 'inside' | 'outside';
  capacity: {
    min: number;
    max: number;
  };
  isAdjustable: boolean;
  position: {
    x: number;
    y: number;
  };
  isActive: boolean;
}

export interface Reservation {
  id: string;
  customer: Customer;
  partySize: number;
  date: string;
  startTime: string;
  endTime: string;
  tableIds: string[];
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  reservationId?: string;
}

export type Language = 'en' | 'he' | 'ru';

export interface Translation {
  [key: string]: string | Translation;
}