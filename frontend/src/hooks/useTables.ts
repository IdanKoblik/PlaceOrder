import { useState, useCallback } from 'react';
import type { Table } from '../../../shared/types';

const initialTables: Table[] = [
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

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('restaurant-tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const updateTables = useCallback((newTables: Table[]) => {
    setTables(newTables);
    // Save to localStorage
    localStorage.setItem('restaurant-tables', JSON.stringify(newTables));
  }, []);

  const addTable = useCallback((table: Table) => {
    const newTables = [...tables, table];
    updateTables(newTables);
  }, [tables, updateTables]);

  const updateTable = useCallback((tableId: string, updates: Partial<Table>) => {
    const newTables = tables.map(table =>
      table.id === tableId ? { ...table, ...updates } : table
    );
    updateTables(newTables);
  }, [tables, updateTables]);

  const deleteTable = useCallback((tableId: string) => {
    const newTables = tables.filter(table => table.id !== tableId);
    updateTables(newTables);
  }, [tables, updateTables]);

  const getTablesByArea = useCallback((area: 'bar' | 'inside' | 'outside') => {
    return tables.filter(table => table.area === area);
  }, [tables]);

  const getActiveTablesByArea = useCallback((area: 'bar' | 'inside' | 'outside') => {
    return tables.filter(table => table.area === area && table.isActive);
  }, [tables]);

  const resetTables = useCallback(() => {
    updateTables(initialTables);
  }, [updateTables]);

  return {
    tables,
    updateTables,
    addTable,
    updateTable,
    deleteTable,
    getTablesByArea,
    getActiveTablesByArea,
    resetTables
  };
};