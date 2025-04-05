import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { X, Beer, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TableOptionsPopup from '../components/TableOptionsMenu';
import CreateTablePopup from '../components/CreateTableMenu';

export interface Table {
  id: number;
  x: number;
  y: number;
  number?: number;
  area: 'inside' | 'entrance' | 'outside';
  shape: 'square' | 'circle';
}

interface TableLayoutProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const STORAGE_KEY = 'tableLayout';

const TableLayout: React.FC<TableLayoutProps> = ({ onClose, isDarkMode }) => {
  const [layouts, setLayouts] = useState<{[key: string]: Table[]}>({ inside: [], entrance: [], outside: [] });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showCreateTablePopup, setShowCreateTablePopup] = useState(false);
  const [selectedArea, setSelectedArea] = useState<'inside' | 'entrance' | 'outside'>('inside');
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      const savedLayouts = JSON.parse(savedLayout);
      setLayouts(savedLayouts);
    }
  }, []);

  const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('layout-container')) {
      const rect = target.getBoundingClientRect();
      setClickPosition({
        x: e.clientX - rect.left - 60,
        y: e.clientY - rect.top - 40
      });
      setShowCreateTablePopup(true);
    }
  };

  const handleCreateTable = (shape: 'square' | 'circle') => {
    const newTable: Table = {
      id: Date.now(),
      x: clickPosition.x,
      y: clickPosition.y,
      area: selectedArea,
      shape
    };
    
    setLayouts(prev => ({
      ...prev,
      [selectedArea]: [...prev[selectedArea], newTable]
    }));
    
    setShowCreateTablePopup(false);
  };

  const handleDragStop = (_e: any, data: any, tableId: number) => {
    setLayouts(prev => ({
      ...prev,
      [selectedArea]: prev[selectedArea].map(table => 
        table.id === tableId 
          ? { ...table, x: data.x, y: data.y }
          : table
      )
    }));
  };

  const handleTableClick = (e: React.MouseEvent, table: Table) => {
    e.stopPropagation();
    setSelectedTable(selectedTable?.id === table.id ? null : table);
  };

  const handleRemoveTable = (tableId: number) => {
    setLayouts(prev => ({
      ...prev,
      [selectedArea]: prev[selectedArea].filter(table => table.id !== tableId)
    }));
    setSelectedTable(null);
  };

  const handleCreateReservation = (tableNumber?: number) => {
    if (!tableNumber) {
      alert(t("Please set a table number first"));
      return;
    }
    setShowModal(true);
  };

  const handleSetTableNumber = (tableId: number) => {  
    const number = prompt(t('Enter table number:'));
    
    if (number !== null) {
      const parsedNumber = parseInt(number, 10);
  
      if (!isNaN(parsedNumber)) {
        const isNumberTaken = layouts[selectedArea].some(table => table.number === parsedNumber && table.id !== tableId);
  
        if (isNumberTaken) {
          alert(t('This table number is already taken. Please choose a different one.'));
          return;
        }
  
        setLayouts(prev => ({
          ...prev,
          [selectedArea]: prev[selectedArea].map(table =>
            table.id === tableId
              ? { ...table, number: parsedNumber }
              : table
          )
        }));
      } else {
        alert(t('Please enter a valid number.'));
      }
    }
  
    setSelectedTable(null);
  };  
  
  const handleSaveLayout = () => {
    const layoutData = {
      ...layouts,
      [selectedArea]: layouts[selectedArea]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutData));
    alert(t('Layout saved successfully!'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`relative w-full max-w-4xl h-[80vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleSaveLayout}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } transition-colors`}
            title={t('Save Layout')}
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              isDarkMode
                ? 'hover:bg-gray-700 text-white'
                : 'hover:bg-gray-200 text-gray-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('Table Layout')}
            </h2>
            <div className="flex gap-2">
              {(['inside', 'entrance', 'outside'] as const).map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedArea === area
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {t(area.charAt(0).toUpperCase() + area.slice(1))}
                </button>
              ))}
            </div>
          </div>
          
          <div
            className={`layout-container w-full h-[60vh] border-2 ${
              isDarkMode ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-gray-50'
            } rounded-lg relative overflow-hidden`}
            onClick={handleLayoutClick}
          >
            {/* Fixed Areas */}
            {selectedArea === 'inside' && (
              <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-emerald-600 flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                  <Beer className="w-8 h-8 mb-2" />
                  <span className="font-bold">BAR</span>
                </div>
              </div>
            )}

            {layouts[selectedArea].map((table) => (
              <Draggable
                key={table.id}
                defaultPosition={{ x: table.x, y: table.y }}
                onStop={(e, data) => handleDragStop(e, data, table.id)}
                bounds="parent"
              >
                <div className="absolute">
                  <div
                    onClick={(e) => handleTableClick(e, table)}
                    className={`cursor-move select-none w-32 h-20 ${
                      table.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                    } flex items-center justify-center font-bold text-xl ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    } shadow-lg transition-colors ${
                      selectedTable?.id === table.id ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  >
                    {table.number || '?'}
                  </div>
                </div>
              </Draggable>
            ))}
          </div>

          {selectedTable && (
            <TableOptionsPopup
              table={selectedTable}
              isDarkMode={isDarkMode}
              onSetTableNumber={handleSetTableNumber}
              onRemoveTable={handleRemoveTable}
              onClose={() => setSelectedTable(null)}
            />
          )}

          {showCreateTablePopup && (
            <CreateTablePopup
              isDarkMode={isDarkMode}
              onCreateTable={handleCreateTable}
              onClose={() => setShowCreateTablePopup(false)}
            />
          )}

          <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('Select an area and click anywhere on the layout to add a table. Click on a table to see options.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableLayout;