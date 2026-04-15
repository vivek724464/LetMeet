import { useState, useEffect } from 'react';
import EventModal from '../components/EventModal';
import { api } from '../services/api';

export default function EventTypesPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); 
  

  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await api.getEvents();
    setEvents(data);
  };

  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      await api.updateEvent(editingEvent.id, eventData);
    } else {
      await api.createEvent(eventData);
    }
    fetchEvents(); 
    setEditingEvent(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event type?")) {
      await api.deleteEvent(id);
      fetchEvents();
    }
  };

  const openNewModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleShare = (slug) => {
    const fullLink = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(fullLink);
    
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-normal text-gray-800">Events</h1>
        <button 
          onClick={openNewModal}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          + New Event Type
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          No event types found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className={`h-2 w-full ${event.color || 'bg-blue-500'}`}></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium text-gray-900">{event.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(event)} className="text-gray-400 hover:text-blue-600 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-600 text-sm font-medium">Delete</button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-1">{event.duration} mins, {event.type || 'One-on-One'}</p>
                
                {/* Updated single Share button */}
                <div className="pt-5 border-t border-gray-100 flex justify-start items-center">
                  <button 
                    onClick={() => handleShare(event.slug)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {copiedSlug === event.slug ? (
                      <>
                        <span>✅</span> Copied!
                      </>
                    ) : (
                      <>
                        <span>🔗</span> Share
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setEditingEvent(null);}} 
        onSave={handleSaveEvent} 
        editingEvent={editingEvent}
      />
    </div>
  );
}