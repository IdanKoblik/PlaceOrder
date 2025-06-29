import React, { useState } from 'react';
import { Calendar, Users, LayoutGrid, BarChart3, Plus } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSwitch } from './components/LanguageSwitch';
import { Dashboard } from './components/Dashboard';
import { ReservationList } from './components/ReservationList';
import { ReservationForm } from './components/ReservationForm';
import { useReservations } from './hooks/useReservations';
import type { Reservation } from '../../shared/types';

type ActiveView = 'dashboard' | 'reservations' | 'form' | 'tables';

function AppContent() {
  const { t } = useLanguage();
  const { 
    reservations, 
    tables, 
    createReservation, 
    updateReservation, 
    deleteReservation 
  } = useReservations();

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();

  const navigation = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutGrid },
    { id: 'reservations', label: t('nav.reservations'), icon: Calendar },
  ];

  const handleSaveReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingReservation) {
      updateReservation(editingReservation.id, reservationData);
    } else {
      createReservation(reservationData);
    }
    setActiveView('reservations');
    setEditingReservation(undefined);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setActiveView('form');
  };

  const handleDeleteReservation = (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      deleteReservation(id);
    }
  };

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    updateReservation(id, { status });
  };

  const handleNewReservation = () => {
    setEditingReservation(undefined);
    setActiveView('form');
  };

  const handleCancelForm = () => {
    setEditingReservation(undefined);
    setActiveView('reservations');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ReserveFlow</h1>
              </div>

              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as ActiveView)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {activeView === 'reservations' && (
                <button
                  onClick={handleNewReservation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  {t('reservation.newReservation')}
                </button>
              )}
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <Dashboard reservations={reservations} tables={tables} />
        )}

        {activeView === 'reservations' && (
          <ReservationList
            reservations={reservations}
            onEdit={handleEditReservation}
            onDelete={handleDeleteReservation}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeView === 'form' && (
          <ReservationForm
            reservation={editingReservation}
            onSave={handleSaveReservation}
            onCancel={handleCancelForm}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`flex flex-col items-center gap-1 p-3 ${
                  activeView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;