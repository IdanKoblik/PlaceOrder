import React, { useEffect } from 'react';
import { Square, Circle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateTableMenuProps {
  isDarkMode: boolean;
  onCreateTable: (shape: 'square' | 'circle') => void;
  onClose: () => void;
}

const CreateTableMenu: React.FC<CreateTableMenuProps> = ({
  isDarkMode,
  onCreateTable,
  onClose,
}) => {
  const { t } = useTranslation();

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" onClick={handleBackdropClick}>
      <div
        className={`${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        } rounded-lg shadow-lg p-4 w-full max-w-xs sm:max-w-sm mx-auto relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <h3 className={`text-base sm:text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('Select Table Shape')}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() => onCreateTable('square')}
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Square className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
            <span className="text-sm sm:text-base">{t('Square Table')}</span>
          </button>
          
          <button
            onClick={() => onCreateTable('circle')}
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center ${
              isDarkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Circle className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
            <span className="text-sm sm:text-base">{t('Round Table')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTableMenu;