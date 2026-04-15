import { useState } from 'react';

export default function RescheduleModal({ isOpen, onClose, onSave, meeting, error }) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  if (!isOpen || !meeting) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
        const dateObj = new Date(newDate);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const formattedDate = `${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

    onSave(meeting.id, formattedDate, newTime);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Reschedule Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✖</button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">Current Time:</p>
            <p className="text-blue-900 font-bold">{meeting.date} at {meeting.time}</p>
            <p className="text-blue-700 text-sm mt-1">with {meeting.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Date *</label>
              <input 
                required type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={e => setNewDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Time *</label>
              <select 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                onChange={e => setNewTime(e.target.value)}
              >
                <option value="">Select a time...</option>
                <option value="09:00">09:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-full">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">Confirm Reschedule</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}