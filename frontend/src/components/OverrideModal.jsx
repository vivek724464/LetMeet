import { useState } from 'react';

export default function OverrideModal({ isOpen, onClose, onSave }) {
  const [date, setDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(), 
      date,
      isAvailable,
      start: isAvailable ? start : null,
      end: isAvailable ? end : null
    });
   
    setDate('');
    setIsAvailable(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Add Date Override</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✖</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Date *</label>
            <input 
              required type="date" value={date}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input 
                type="checkbox" checked={!isAvailable}
                onChange={(e) => setIsAvailable(!e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-800">I am completely unavailable on this date</span>
            </label>

            {isAvailable && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Available from:</span>
                <input 
                  type="time" value={start} required
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                  onChange={e => setStart(e.target.value)}
                />
                <span className="text-gray-500">-</span>
                <input 
                  type="time" value={end} required
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                  onChange={e => setEnd(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-full">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">Apply Override</button>
          </div>
        </form>
      </div>
    </div>
  );
}