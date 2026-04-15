import { useState, useEffect } from 'react';
import { api } from '../services/api';
import RescheduleModal from '../components/RescheduleModal';

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [rescheduleError, setRescheduleError] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this meeting?")) return;
    try {
      await api.cancelMeeting(id);
      fetchMeetings();
    } catch (error) {
      console.error("Failed to cancel:", error);
    }
  };

  const openRescheduleModal = (meeting) => {
    setRescheduleError(null);
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };


  const handleSaveReschedule = async (id, newDate, newTime) => {
    setRescheduleError(null);
    try {
      await api.rescheduleMeeting(id, newDate, newTime);
      setIsModalOpen(false);
      fetchMeetings(); 
    } catch (error) {
      setRescheduleError(error.message);
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (activeTab === 'upcoming') return m.status === 'upcoming';
    if (activeTab === 'past') return m.status === 'past' || m.status === 'cancelled';
    return false;
  });

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-normal text-gray-800 mb-8">Scheduled Meetings</h1>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'past' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Past & Cancelled
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading meetings...</div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500 shadow-sm">
            No {activeTab} events found.
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div key={meeting.id} className={`bg-white p-6 rounded-xl border ${meeting.status === 'cancelled' ? 'border-red-100 bg-red-50/30' : 'border-gray-200'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${meeting.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {meeting.name ? meeting.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{meeting.time}</h3>
                    {meeting.status === 'cancelled' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">Cancelled</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{meeting.date}</p>
                  <p className="text-gray-800 font-medium">
                    {meeting.name} 
                    <span className="font-normal text-gray-500"> — {meeting.event || 'Meeting'}</span>
                  </p>
                  {meeting.email && <p className="text-sm text-gray-500 mt-1">✉️ {meeting.email}</p>}
                </div>
              </div>
              
              {meeting.status === 'upcoming' && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={() => openRescheduleModal(meeting)}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleCancel(meeting.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* The Reschedule Modal */}
      <RescheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReschedule}
        meeting={selectedMeeting}
        error={rescheduleError}
      />
    </div>
  );
}