import { useState, useEffect } from 'react';

// A palette of Tailwind colors for the user to choose from
const EVENT_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
  'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
];

export default function EventModal({ isOpen, onClose, onSave, editingEvent }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [slug, setSlug] = useState('');
  const [bufferBefore, setBufferBefore] = useState(0);
  const [bufferAfter, setBufferAfter] = useState(0);
  
  // NEW: State for Color and Type
  const [color, setColor] = useState(EVENT_COLORS[0]);
  const [type, setType] = useState('One-on-One');

  // Populate the form if we are editing, or reset it if creating new
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setDuration(editingEvent.duration || 30);
      setSlug(editingEvent.slug || '');
      setBufferBefore(editingEvent.bufferBefore || 0);
      setBufferAfter(editingEvent.bufferAfter || 0);
      setColor(editingEvent.color || EVENT_COLORS[0]);
      setType(editingEvent.type || 'One-on-One');
    } else {
      setTitle('');
      setDuration(30);
      setSlug('');
      setBufferBefore(0);
      setBufferAfter(0);
      setColor(EVENT_COLORS[0]);
      setType('One-on-One');
    }
  }, [editingEvent, isOpen]);

  // Auto-generate the URL link (slug) when the user types a title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!editingEvent) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      title, 
      duration: Number(duration), 
      slug, 
      bufferBefore: Number(bufferBefore), 
      bufferAfter: Number(bufferAfter),
      color, // Save the new color
      type   // Save the new type
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header - Dynamically changes color based on selection! */}
        <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${color.replace('bg-', 'bg-').replace('500', '50')}`}>
          <h2 className="text-xl font-bold text-gray-900">
            {editingEvent ? 'Edit Event Type' : 'New Event Type'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✖</button>
        </div>
        
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Title & Duration */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Event Name *</label>
              <input required type="text" value={title} onChange={handleTitleChange} placeholder="e.g. 30 Minute Discovery Call" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Duration (mins) *</label>
                <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>
              </div>

              {/* NEW: Event Type Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Event Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="One-on-One">One-on-One</option>
                  <option value="Group">Group</option>
                </select>
              </div>
            </div>

            {/* URL Link */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug *</label>
              <div className="flex items-center">
                <span className="text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-sm select-none">
                  /book/
                </span>
                <input required type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* NEW: Color Picker */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Event Color</label>
              <div className="flex gap-3">
                {EVENT_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${c} transition-transform ${color === c ? 'ring-4 ring-offset-2 ring-gray-300 scale-110 shadow-md' : 'hover:scale-110 border border-black/10'}`}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Buffers */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Buffer Before</label>
                <select value={bufferBefore} onChange={e => setBufferBefore(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="0">0 mins</option>
                  <option value="5">5 mins</option>
                  <option value="10">10 mins</option>
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Buffer After</label>
                <select value={bufferAfter} onChange={e => setBufferAfter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="0">0 mins</option>
                  <option value="5">5 mins</option>
                  <option value="10">10 mins</option>
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-full">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700">Save Event</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}