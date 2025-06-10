import { useState, useCallback, useMemo } from 'react';
import type { Reservation, Customer, Table } from '../types';

const mockTables: Table[] = [
  // Bar Area - Adjustable chairs
  { id: 'bar-1', name: 'Bar 1-2', area: 'bar', capacity: { min: 1, max: 2 }, isAdjustable: true, position: { x: 50, y: 20 }, isActive: true },
  { id: 'bar-2', name: 'Bar 3-4', area: 'bar', capacity: { min: 1, max: 2 }, isAdjustable: true, position: { x: 150, y: 20 }, isActive: true },
  { id: 'bar-3', name: 'Bar 5-6', area: 'bar', capacity: { min: 1, max: 2 }, isAdjustable: true, position: { x: 250, y: 20 }, isActive: true },
  { id: 'bar-4', name: 'Bar 7-8', area: 'bar', capacity: { min: 1, max: 2 }, isAdjustable: true, position: { x: 350, y: 20 }, isActive: true },
  
  // Inside Dining - Flexible tables
  { id: 'in-1', name: 'Table 1', area: 'inside', capacity: { min: 2, max: 4 }, isAdjustable: true, position: { x: 80, y: 80 }, isActive: true },
  { id: 'in-2', name: 'Table 2', area: 'inside', capacity: { min: 2, max: 4 }, isAdjustable: true, position: { x: 200, y: 80 }, isActive: true },
  { id: 'in-3', name: 'Table 3', area: 'inside', capacity: { min: 4, max: 6 }, isAdjustable: true, position: { x: 320, y: 80 }, isActive: true },
  { id: 'in-4', name: 'Table 4', area: 'inside', capacity: { min: 2, max: 4 }, isAdjustable: true, position: { x: 80, y: 160 }, isActive: true },
  { id: 'in-5', name: 'Table 5', area: 'inside', capacity: { min: 4, max: 8 }, isAdjustable: true, position: { x: 200, y: 160 }, isActive: true },
  { id: 'in-6', name: 'Table 6', area: 'inside', capacity: { min: 2, max: 4 }, isAdjustable: true, position: { x: 320, y: 160 }, isActive: true },
  
  // Outside Patio - Fixed tables
  { id: 'out-1', name: 'Patio 1', area: 'outside', capacity: { min: 2, max: 2 }, isAdjustable: false, position: { x: 60, y: 60 }, isActive: true },
  { id: 'out-2', name: 'Patio 2', area: 'outside', capacity: { min: 4, max: 4 }, isAdjustable: false, position: { x: 180, y: 60 }, isActive: true },
  { id: 'out-3', name: 'Patio 3', area: 'outside', capacity: { min: 2, max: 2 }, isAdjustable: false, position: { x: 300, y: 60 }, isActive: true },
  { id: 'out-4', name: 'Patio 4', area: 'outside', capacity: { min: 6, max: 6 }, isAdjustable: false, position: { x: 120, y: 140 }, isActive: true },
  { id: 'out-5', name: 'Patio 5', area: 'outside', capacity: { min: 4, max: 4 }, isAdjustable: false, position: { x: 240, y: 140 }, isActive: true },
];

const mockReservations: Reservation[] = [
  {
    id: '1',
    customer: { id: '1', name: 'John Smith', phone: '+1-555-0123' },
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '21:00',
    tableIds: ['in-1'],
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    customer: { id: '2', name: 'Sarah Johnson', phone: '+1-555-0456' },
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '20:00',
    endTime: '22:00',
    tableIds: ['bar-1'],
    status: 'seated',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [tables] = useState<Table[]>(mockTables);

  const createReservation = useCallback((reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setReservations(prev => [...prev, newReservation]);
    return newReservation;
  }, []);

  const updateReservation = useCallback((id: string, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === id 
        ? { ...reservation, ...updates, updatedAt: new Date().toISOString() }
        : reservation
    ));
  }, []);

  const deleteReservation = useCallback((id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  }, []);

  const getAvailableTables = useCallback((date: string, startTime: string, endTime: string, partySize: number) => {
    const conflictingReservations = reservations.filter(reservation => 
      reservation.date === date &&
      reservation.status !== 'cancelled' &&
      !(endTime <= reservation.startTime || startTime >= reservation.endTime)
    );

    const occupiedTableIds = new Set(
      conflictingReservations.flatMap(reservation => reservation.tableIds)
    );

    return tables.filter(table => 
      table.isActive &&
      !occupiedTableIds.has(table.id) &&
      table.capacity.min <= partySize &&
      table.capacity.max >= partySize
    );
  }, [reservations, tables]);

  const getTableStatus = useCallback((tableId: string, date: string, time: string) => {
    const currentReservation = reservations.find(reservation =>
      reservation.date === date &&
      reservation.tableIds.includes(tableId) &&
      reservation.startTime <= time &&
      reservation.endTime > time &&
      reservation.status !== 'cancelled'
    );

    if (!currentReservation) return 'available';
    
    switch (currentReservation.status) {
      case 'confirmed':
        return 'reserved';
      case 'seated':
        return 'occupied';
      default:
        return 'available';
    }
  }, [reservations]);

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    for (let hour = 12; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  const searchReservations = useCallback((query: string) => {
    if (!query.trim()) return reservations;
    
    const lowercaseQuery = query.toLowerCase();
    return reservations.filter(reservation =>
      reservation.customer.name.toLowerCase().includes(lowercaseQuery) ||
      reservation.customer.phone.includes(query) ||
      reservation.id.includes(query)
    );
  }, [reservations]);

  const getReservationsByDate = useCallback((date: string) => {
    return reservations.filter(reservation => reservation.date === date);
  }, [reservations]);

  return {
    reservations,
    tables,
    createReservation,
    updateReservation,
    deleteReservation,
    getAvailableTables,
    getTableStatus,
    generateTimeSlots,
    searchReservations,
    getReservationsByDate
  };
};