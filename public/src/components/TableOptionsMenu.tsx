import React, { useEffect, useState } from 'react';
import { Plus, Hash, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Table } from '../layouts/TableLayout';
import CreateOrderMenu from '../components/CreateOrderMenu';

interface TableOptionsMenuProps {
  table: Table;
  isDarkMode: boolean;
  onSetTableNumber: (tableId: number) => void;
  onRemoveTable: (tableId: number) => void;
  onClose: () => void;
}

const TableOptionsMenu: React.FC<TableOptionsMenuProps> = ({
  table,
  isDarkMode,
  onSetTableNumber,
  onRemoveTable,
  onClose,
}) => {
  const { t } = useTranslation();
  const [showModel, setShowModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateReservation = (tableNumber?: number) => {
    if (!tableNumber) {
      alert(t("Please set a table number first"));
      return;
    }

    setShowModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={handleBackdropClick}>
      <div 
        className={`${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        } rounded-lg shadow-lg p-4 min-w-[200px] max-w-sm mx-auto relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('Table Options')}
        </h3>
        <button
          onClick={() => {
            handleCreateReservation(table.number);
          }}
          className={`w-full mb-2 px-4 py-2 rounded flex items-center ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Create Reservation')}
        </button>
        <button
          onClick={() => {
            onSetTableNumber(table.id);
            onClose();
          }}
          className={`w-full mb-2 px-4 py-2 rounded flex items-center ${
            isDarkMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          <Hash className="w-4 h-4 mr-2" />
          {t('Set Table Number')}
        </button>
        <button
          onClick={() => {
            onRemoveTable(table.id);
            onClose();
          }}
          className={`w-full px-4 py-2 rounded flex items-center ${
            isDarkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('Remove Table')}
        </button>
      </div>

      {showModel && (
            <CreateOrderMenu
              tableNumber={table?.number}
              isDarkMode={isDarkMode}
              setShowModal={setShowModal}
            />
          )
     }
    </div>
  );
};

export default TableOptionsMenu;