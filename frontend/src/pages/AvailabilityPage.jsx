import { useState, useEffect } from 'react';
import { api } from '../services/api';
import OverrideModal from '../components/OverrideModal';

const TIMEZONES = [
  "Pacific Time - US & Canada",
  "Mountain Time - US & Canada",
  "Central Time - US & Canada",
  "Eastern Time - US & Canada",
  "Greenwich Mean Time (GMT)",
  "Central European Time (CET)",
  "India Standard Time (IST)",
  "Australian Eastern Time (AET)"
];

export default function AvailabilityPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  

  const [schedules, setSchedules] = useState([]);
  const [activeScheduleId, setActiveScheduleId] = useState('');

  
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [weeklyHours, setWeeklyHours] = useState([]);
  const [overrides, setOverrides] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAllSchedules();
  }, []);

  const loadAllSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
      if (data.length > 0) {
        setActiveScheduleId(data[0].id);
        loadScheduleIntoView(data[0]);
      }
    } catch (error) {
      console.error("Failed to load schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadScheduleIntoView = (schedule) => {
    setTimezone(schedule.timezone || TIMEZONES[0]);
    setWeeklyHours(schedule.defaultHours || []);
    setOverrides(schedule.overrides || []);
  };

  
  const handleSwitchSchedule = (id) => {
    const selected = schedules.find(s => s.id === id);
    if (selected) {
      setActiveScheduleId(id);
      loadScheduleIntoView(selected);
    }
  };

  const handleCreateSchedule = async () => {
    const name = window.prompt("Enter a name for your new schedule (e.g., Weekend Hours):");
    if (!name || name.trim() === '') return;

    setIsLoading(true);
    try {
      const newSchedule = await api.createSchedule(name);
      setSchedules([...schedules, newSchedule]);
      setActiveScheduleId(newSchedule.id);
      loadScheduleIntoView(newSchedule);
    } catch (error) {
      console.error("Error creating schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleDay = (index) => {
    setWeeklyHours(prev => {
      const newSched = [...prev];
      newSched[index] = { ...newSched[index], active: !newSched[index].active };
      return newSched;
    });
  };

  const handleTimeChange = (index, field, value) => {
    setWeeklyHours(prev => {
      const newSched = [...prev];
      newSched[index] = { ...newSched[index], [field]: value };
      return newSched;
    });
  };


  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    const currentScheduleName = schedules.find(s => s.id === activeScheduleId)?.name || 'Working Hours';

    const scheduleDataToSave = {
      id: activeScheduleId,
      name: currentScheduleName,
      timezone: timezone,
      defaultHours: weeklyHours,
      overrides: overrides
    };

    try {
      await api.saveSchedule(scheduleDataToSave);
      
      setSchedules(prev => prev.map(s => s.id === activeScheduleId ? scheduleDataToSave : s));
      
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      setSaveMessage('Error saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // Override handlers
  const handleAddOverride = (newOverride) => {
    setOverrides(prev => [...prev, newOverride]);
    setIsModalOpen(false);
  };

  const handleDeleteOverride = (id) => {
    setOverrides(prev => prev.filter(ov => ov.id !== id));
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-12 text-center text-gray-500">Loading schedules...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto font-sans">
      
      {/* HEADER: Title & Multiple Schedule Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <h1 className="text-3xl font-normal text-gray-800">Availability</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm font-bold text-gray-500">Schedule:</span>
              <select 
                value={activeScheduleId}
                onChange={(e) => handleSwitchSchedule(e.target.value)}
                className="text-sm font-bold text-gray-900 border-none outline-none bg-transparent cursor-pointer w-40 truncate"
              >
                {schedules.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleCreateSchedule} className="text-blue-600 text-sm font-bold hover:underline">
              + New Schedule
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saveMessage && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full animate-pulse">{saveMessage}</span>}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
              isSaving ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex gap-6 border-b border-gray-200 px-6 pt-4 bg-gray-50">
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'weekly' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Weekly hours
          </button>
          <button 
            onClick={() => setActiveTab('overrides')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overrides' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Date-specific hours
          </button>
        </div>

        {/* Tab Content: Weekly Hours */}
        {activeTab === 'weekly' ? (
          <>
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Working Hours</h2>
                <p className="text-sm text-gray-500 mt-1">Set the default weekly hours for this schedule.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Timezone:</span>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 divide-y divide-gray-100">
              {weeklyHours.map((slot, index) => (
                <div key={slot.day} className="py-4 flex items-center sm:flex-row flex-col gap-4">
                  <div className="w-full sm:w-40 flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={slot.active} 
                      onChange={() => toggleDay(index)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`text-sm font-medium w-24 ${slot.active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {slot.day}
                    </span>
                  </div>

                  {slot.active ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input type="time" value={slot.start || ''} onChange={(e) => handleTimeChange(index, 'start', e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      <span className="text-gray-500">-</span>
                      <input type="time" value={slot.end || ''} onChange={(e) => handleTimeChange(index, 'end', e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      <button onClick={() => toggleDay(index)} className="ml-4 text-gray-400 hover:text-gray-700 text-lg" title="Mark as unavailable">✖</button>
                    </div>
                  ) : (
                    <div className="flex-1 text-sm text-gray-400 italic">Unavailable</div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Tab Content: Date Overrides */
          <div className="p-6 min-h-[400px]">
            {overrides.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-900">Add date-specific hours</h3>
                <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                  Override your availability for specific dates for this schedule.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                >
                  + Add Date Override
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Your Overrides</h3>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-full text-sm transition-colors"
                  >
                    + Add Override
                  </button>
                </div>
                
                <div className="space-y-3">
                  {overrides.map(override => (
                    <div key={override.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-bold text-gray-900 w-32">{new Date(override.date).toLocaleDateString()}</span>
                        {override.isAvailable ? (
                          <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-md">
                            Available: {override.start} - {override.end}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm italic bg-gray-50 px-3 py-1 rounded-md">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteOverride(override.id)}
                        className="text-gray-400 hover:text-red-600 px-2 py-1"
                        title="Delete override"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <OverrideModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOverride}
      />
    </div>
  );
}