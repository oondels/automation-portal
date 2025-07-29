import { useState } from "react";
import { CheckCheckIcon } from "lucide-react";

export function IntervalInput({ onChange }: { onChange: (interval: string) => void }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleChange = (setter: (val: number) => void, value: string) => {
    const number = Math.max(0, parseInt(value) || 0);
    setter(number);
  };

  const getIntervalString = () => {
    const parts = [];
    if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(" ") : "0 minutes";
  };

  const handleUpdate = () => {
    const interval = getIntervalString();
    onChange(interval); // envia para o pai
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md shadow-sm max-w-sm">
      <div className="flex justify-between items-center gap-2">
        <label className="w-20 font-semibold">Dias</label>
        <input
          type="number"
          min="0"
          value={days}
          onChange={(e) => handleChange(setDays, e.target.value)}
          className="w-full px-3 py-1 border rounded-md text-black"
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <label className="w-20 font-semibold">Horas</label>
        <input
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={(e) => handleChange(setHours, e.target.value)}
          className="w-full px-3 py-1 border rounded-md text-black"
        />
      </div>
      {/* <div className="flex justify-between items-center gap-2">
        <label className="w-20 font-semibold">Minutos</label>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleChange(setMinutes, e.target.value)}
          className="w-full px-3 py-1 border rounded-md text-black"
        />
      </div> */}
      <button 
        onClick={handleUpdate} 
        className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-all duration-200 active:scale-95 active:bg-green-800"
      >
        Definir <CheckCheckIcon className="inline h-4 w-4 mr-1" />
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Valor gerado: <code>{getIntervalString()}</code>
      </p>
    </div>
  );
}
