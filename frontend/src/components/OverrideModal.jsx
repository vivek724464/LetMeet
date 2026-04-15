import { useState } from 'react';

export default function OverrideModal({ isOpen, onClose, onSave }) {
  const [date, setDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [timeBlocks, setTimeBlocks] = useState([{ start: '09:00', end: '17:00' }]);

  const today = new Date().toISOString().split('T')[0];

  const handleClose = () => {
    setDate('');
    setIsAvailable(true);
    setTimeBlocks([{ start: '09:00', end: '17:00' }]);
    onClose();
  };

  const addTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeBlock = (index) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  const updateTimeBlock = (index, field, value) => {
    const newBlocks = [...timeBlocks];
    newBlocks[index][field] = value;
    setTimeBlocks(newBlocks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      date,
      isAvailable,
      blocks: isAvailable ? timeBlocks : []
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Manage Date Override</h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✖</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Date *</label>
            <input 
              required type="date" value={date} min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input 
                type="checkbox" checked={!isAvailable}
                onChange={(e) => setIsAvailable(!e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-800">I am completely unavailable on this date</span>
            </label>

            {isAvailable && (
              <div className="pt-4 border-t border-gray-200 mt-2 space-y-3">
                <span className="text-sm font-medium text-gray-700 block">Set available time blocks:</span>
                
                {timeBlocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="time" value={block.start} required
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                      onChange={e => updateTimeBlock(index, 'start', e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="time" value={block.end} required
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                      onChange={e => updateTimeBlock(index, 'end', e.target.value)}
                    />
                    {timeBlocks.length > 1 && (
                      <button 
                        type="button" onClick={() => removeTimeBlock(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}

                <button 
                  type="button" onClick={addTimeBlock}
                  className="text-blue-600 text-xs font-bold hover:underline"
                >
                  + Add another time block
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-full">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 shadow-sm transition-all active:scale-95">Apply Override</button>
          </div>
        </form>
      </div>
    </div>
  );
}