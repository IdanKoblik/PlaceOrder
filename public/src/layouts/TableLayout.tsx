import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { X, Beer, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import TableOptionsPopup from "../components/TableOptionsMenu";
import CreateTablePopup from "../components/CreateTableMenu";
import { API_URL } from "../App";

export interface Table {
  id: number;
  x: number;
  y: number;
  number?: number;
  area: "inside" | "entrance" | "outside";
  shape: "square" | "circle";
}

interface TableLayoutProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const TableLayout: React.FC<TableLayoutProps> = ({ onClose, isDarkMode }) => {
  const [layouts, setLayouts] = useState<{ [key: string]: Table[] }>({
    inside: [],
    entrance: [],
    outside: [],
  });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showCreateTablePopup, setShowCreateTablePopup] = useState(false);
  const [selectedArea, setSelectedArea] = useState<
    "inside" | "entrance" | "outside"
  >("inside");
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`${API_URL}/config/tables/layout`, {method: "GET"})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch layout");
        return res.json();
      })
      .then((json) => {
        const data = JSON.parse(json); 
        setLayouts({
          inside: data.inside || [],
          entrance: data.entrance || [],
          outside: data.outside || [],
        });
      })
      .catch((err) => {
        console.error("Fetch layout error:", err);
        alert(t("Failed to load layout."));
      });
  }, []);

  const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("layout-container")) {
      const rect = target.getBoundingClientRect();
      setClickPosition({
        x: e.clientX - rect.left - 60,
        y: e.clientY - rect.top - 40,
      });
      setShowCreateTablePopup(true);
    }
  };

  const handleCreateTable = (shape: "square" | "circle") => {
    const newTable: Table = {
      id: Date.now(),
      x: clickPosition.x,
      y: clickPosition.y,
      area: selectedArea,
      shape,
    };

    setLayouts((prev) => ({
      ...prev,
      [selectedArea]: [...prev[selectedArea], newTable],
    }));

    setShowCreateTablePopup(false);
  };

  const handleDragStop = (_e: any, data: any, tableId: number) => {
    setLayouts((prev) => ({
      ...prev,
      [selectedArea]: prev[selectedArea].map((table) =>
        table.id === tableId ? { ...table, x: data.x, y: data.y } : table
      ),
    }));
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(selectedTable?.id === table.id ? null : table);
  };

  const handleRemoveTable = (tableId: number) => {
    setLayouts((prev) => ({
      ...prev,
      [selectedArea]: prev[selectedArea].filter(
        (table) => table.id !== tableId
      ),
    }));
    setSelectedTable(null);
  };

  const handleSetTableNumber = (tableId: number) => {
    const number = prompt(t("Enter table number:"));

    if (number !== null) {
      const parsedNumber = parseInt(number, 10);

      if (!isNaN(parsedNumber)) {
        const isNumberTaken = layouts[selectedArea].some(
          (table) => table.number === parsedNumber && table.id !== tableId
        );

        if (isNumberTaken) {
          alert(
            t(
              "This table number is already taken. Please choose a different one."
            )
          );
          return;
        }

        setLayouts((prev) => ({
          ...prev,
          [selectedArea]: prev[selectedArea].map((table) =>
            table.id === tableId ? { ...table, number: parsedNumber } : table
          ),
        }));
      } else {
        alert(t("Please enter a valid number."));
      }
    }

    setSelectedTable(null);
  };

  const handleSaveLayout = () => {
    const layoutData = {
      ...layouts,
      [selectedArea]: layouts[selectedArea],
    };

    console.log(JSON.stringify(layoutData));
    fetch(`${API_URL}/config/tables/layout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(layoutData),
            })
              .then((res) => {
                if (!res.ok) throw new Error(`Failed to save layout ${res.json}`);
                alert(t("Layout saved successfully!"));
              })
              .catch((err) => {
                console.error("Save error:", err);
                alert(t("Failed to save layout."));
              }
            );
    alert(t("Layout saved successfully!"));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div
        className={`relative w-full max-w-4xl h-[90vh] sm:h-[80vh] ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-xl overflow-hidden`}
      >
        <div className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 sm:gap-6">
            <h2
              className={`text-xl sm:text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {t("Table Layout")}
            </h2>

            <div className="flex-1 flex justify-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {(["inside", "entrance", "outside"] as const).map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg ${
                      selectedArea === area
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {t(area.charAt(0).toUpperCase() + area.slice(1))}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveLayout}
                className={`p-1.5 sm:p-2 rounded-full ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } transition-colors`}
                title={t("Save Layout")}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={onClose}
                className={`p-1.5 sm:p-2 rounded-full ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div
            className={`layout-container w-full h-[50vh] sm:h-[60vh] border-2 ${
              isDarkMode
                ? "border-gray-600 bg-gray-900"
                : "border-gray-300 bg-gray-50"
            } rounded-lg relative overflow-hidden`}
            onClick={handleLayoutClick}
          >
            {selectedArea === "inside" && (
              <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-emerald-600 flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                  <Beer className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                  <span className="text-sm sm:text-base font-bold">BAR</span>
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
                    onClick={() => handleTableClick(table)}
                    onTouchEnd={() => handleTableClick(table)}
                    className={`cursor-move select-none w-24 h-16 sm:w-32 sm:h-20 ${
                      table.shape === "circle" ? "rounded-full" : "rounded-lg"
                    } flex items-center justify-center font-bold text-lg sm:text-xl ${
                      isDarkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } shadow-lg transition-colors ${
                      selectedTable?.id === table.id
                        ? "ring-4 ring-yellow-400"
                        : ""
                    }`}
                  >
                    {table.number || "?"}
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

          <p
            className={`mt-4 text-xs sm:text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t(
              "Select an area and click anywhere on the layout to add a table. Click on a table to see options."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableLayout;