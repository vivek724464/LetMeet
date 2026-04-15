import { useState, useEffect } from 'react';

export default function EventModal({ isOpen, onClose, onSave, editingEvent }) {
  const [formData, setFormData] = useState({
    title: '', duration: 30, slug: '', bufferBefore: 0, bufferAfter: 0
  });


  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent);
    } else {
      setFormData({ title: '', duration: 30, slug: '', bufferBefore: 0, bufferAfter: 0 });
    }
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {editingEvent ? 'Edit Event Type' : 'Add Event Type'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✖</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Event Name *</label>
            <input 
              required type="text"
              value={formData.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Duration (min)</label>
              <input 
                type="number" min="15" step="15" value={formData.duration}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug</label>
              <input 
                type="text" value={formData.slug}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none" readOnly
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Buffer Times (Bonus)</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Before event</label>
                <select value={formData.bufferBefore} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" onChange={e => setFormData({...formData, bufferBefore: e.target.value})}>
                  <option value="0">0 min</option>
                  <option value="15">15 min</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">After event</label>
                <select value={formData.bufferAfter} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" onChange={e => setFormData({...formData, bufferAfter: e.target.value})}>
                  <option value="0">0 min</option>
                  <option value="15">15 min</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-full">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">
              {editingEvent ? 'Save Changes' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}