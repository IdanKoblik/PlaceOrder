import React, { useState } from 'react';
import { Calendar, Users, LayoutGrid, BarChart3, Plus, Settings } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageSwitch } from './components/LanguageSwitch';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { PasswordModal } from './components/PasswordModal';
import { Dashboard } from './components/Dashboard';
import { ReservationList } from './components/ReservationList';
import { ReservationForm } from './components/ReservationForm';
import { TableManagement } from './components/TableManagement';
import { useReservations } from './hooks/useReservations';
import { useTables } from './hooks/useTables';
import type { Reservation } from '../../shared/types';

type ActiveView = 'dashboard' | 'reservations' | 'form' | 'tables';

function AppContent() {
  const { t } = useLanguage();
  const { isAuthenticated, checkAdminAccess } = useAuth();
  const { 
    reservations, 
    createReservation, 
    updateReservation, 
    deleteReservation 
  } = useReservations();
  
  const { tables, updateTables, isLoading } = useTables();

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isTableManagementUnlocked, setIsTableManagementUnlocked] = useState(false);

  const navigation = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutGrid },
    { id: 'reservations', label: t('nav.reservations'), icon: Calendar },
    { id: 'tables', label: 'Table Management', icon: Settings },
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

  const handleNavigationClick = (viewId: string) => {
    if (viewId === 'tables') {
      // Check if user is authenticated first
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }
      
      // If authenticated but not admin, show auth modal with admin requirement
      if (!checkAdminAccess()) {
        setShowAuthModal(true);
        return;
      }
      
      // If admin but table management not unlocked, show password modal
      if (!isTableManagementUnlocked) {
        setShowPasswordModal(true);
        return;
      }
    }
    setActiveView(viewId as ActiveView);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    
    // After successful auth, check if we need password for table management
    if (checkAdminAccess() && !isTableManagementUnlocked) {
      setShowPasswordModal(true);
    } else {
      setActiveView('tables');
    }
  };

  const handlePasswordSuccess = () => {
    setIsTableManagementUnlocked(true);
    setShowPasswordModal(false);
    setActiveView('tables');
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
                  const isLocked = item.id === 'tables' && (!isAuthenticated || !checkAdminAccess() || !isTableManagementUnlocked);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigationClick(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      } ${isLocked ? 'relative' : ''}`}
                    >
                      <Icon size={16} />
                      {item.label}
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
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
              <UserProfile />
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
            tables={tables}
          />
        )}

        {activeView === 'tables' && isAuthenticated && checkAdminAccess() && isTableManagementUnlocked && (
          <TableManagement
            tables={tables}
            onUpdateTables={updateTables}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isLocked = item.id === 'tables' && (!isAuthenticated || !checkAdminAccess() || !isTableManagementUnlocked);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item.id)}
                className={`flex flex-col items-center gap-1 p-3 relative ${
                  activeView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
                {isLocked && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Table Management Access"
        requireAdmin={true}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        title="Table Management Access"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;