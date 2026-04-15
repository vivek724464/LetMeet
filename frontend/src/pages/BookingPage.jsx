import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function BookingPage() {
  const navigate = useNavigate();
  const { slug } = useParams(); 

  const [eventDetails, setEventDetails] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [bookedMeetings, setBookedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);


  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', purpose: '' });

 
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const [events, schedules, meetings] = await Promise.all([
          api.getEvents(),
          api.getSchedules(),
          api.getMeetings()
        ]);

        const currentEvent = events.find(e => e.slug === slug);
        if (!currentEvent) throw new Error("Event not found");
        
        setEventDetails(currentEvent);
        setSchedule(schedules[0]); 
        setBookedMeetings(meetings);
      } catch (err) {
        setError("Could not load booking details. Please check the link.");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [slug]);
  
const handleDateSelect = (day) => {
  setSelectedDate(day);
  setSelectedTime(null);
  setShowForm(false);
  setError(null);

  if (!schedule || !eventDetails) return;
  const dateString = `${shortMonthNames[month]} ${day}, ${year}`;
  
  const comparisonDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  const dateObj = new Date(year, month, day);
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const dayName = daysOfWeek[dateObj.getDay()];

  const override = schedule.overrides?.find(ov => ov.date === comparisonDate);
  
  let activeBlocks = [];

  if (override) {
    if (!override.isAvailable) {
      setAvailableSlots([]); 
      return;
    }
    activeBlocks = override.blocks;
  } else {
    const dayRules = schedule.defaultHours.find(d => d.day === dayName);
    if (!dayRules || !dayRules.active) {
      setAvailableSlots([]); 
      return;
    }
    activeBlocks = [{ start: dayRules.start, end: dayRules.end }];
  }
    let slots = [];
    
    activeBlocks.forEach(block => {
      let [startH, startM] = block.start.split(':').map(Number);
      let [endH, endM] = block.end.split(':').map(Number);
      
      let current = new Date(year, month, day, startH, startM, 0);
      let end = new Date(year, month, day, endH, endM, 0);

      while (current < end) {
        let h = current.getHours().toString().padStart(2, '0');
        let m = current.getMinutes().toString().padStart(2, '0');
        let timeString = `${h}:${m}`;
        
        const isBooked = bookedMeetings.some(m => 
          m.date === dateString && 
          m.time === timeString && 
          m.status === 'upcoming'
        );
        
        if (!isBooked) {
          slots.push(timeString);
        }
        
        current.setMinutes(current.getMinutes() + eventDetails.duration);
      }
    });

    setAvailableSlots(slots);
  };

  const handleNext = () => setShowForm(true);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null); 
    setAvailableSlots([]);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null); 
    setAvailableSlots([]);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dateString = `${shortMonthNames[month]} ${selectedDate}, ${year}`;
      await api.createMeeting({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        purpose: formData.purpose,
        date: dateString,
        time: selectedTime,
        event: eventDetails.title 
      });
      
      navigate('/success', { 
        state: { 
          eventTitle: eventDetails.title,
          inviteeName: formData.name,
          date: dateString,
          time: selectedTime,
          timezone: schedule?.timezone
        } 
      });
      
    } catch (err) {
      setError(err.message || "This time slot was just booked by someone else!");
      const latestMeetings = await api.getMeetings();
      setBookedMeetings(latestMeetings);
      handleDateSelect(selectedDate); 
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading availability...</div>;
  if (!eventDetails) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel */}
        <div className="w-full md:w-[35%] p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10">
          {showForm && (
            <button onClick={() => {setShowForm(false); setError(null);}} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mb-8 hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 text-xl leading-none">←</span>
            </button>
          )}
          <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase mb-2">Host</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{eventDetails.title}</h1>
          <div className="space-y-4 text-gray-600 font-medium">
            <div className="flex items-center gap-3"><span className="text-2xl">⏱️</span> {eventDetails.duration} min</div>
            {selectedDate && selectedTime && showForm && (
              <div className="flex items-start gap-3 text-blue-700">
                <span className="text-2xl mt-0.5">📅</span> 
                <span className="leading-tight">{selectedTime}<br/>{monthNames[month]} {selectedDate}, {year}</span>
              </div>
            )}
            <div className="flex items-center gap-3"><span className="text-2xl">🌍</span> {schedule?.timezone}</div>
            <div className="flex items-center gap-3"><span className="text-2xl">🎥</span> Web conferencing details provided upon confirmation.</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[65%] p-8 bg-white">
          {!showForm ? (
            <div className="flex flex-col md:flex-row gap-8 h-full">
              {/* Calendar View */}
              <div className={`transition-all duration-300 ${selectedDate ? 'md:w-[55%]' : 'w-full'}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Select a Date & Time</h2>
                
                {/* NEW: Month/Year Header with Arrows */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-blue-600 transition-colors">
                    &lt;
                  </button>
                  <div className="font-semibold text-gray-800 text-lg w-32 text-center">
                    {monthNames[month]} {year}
                  </div>
                  <button onClick={handleNextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-blue-600 transition-colors">
                    &gt;
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-gray-500 mb-2">
                  <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                </div>
                
                {/* NEW: Dynamic Grid rendering with blanks */}
                <div className="grid grid-cols-7 gap-2">
                  {blanks.map((blank) => (
                    <div key={`blank-${blank}`} className="p-2"></div>
                  ))}
                  {days.map((day) => {
                    // Check if it's a past date to disable it
                    const isPast = new Date(year, month, day).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                    
                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && handleDateSelect(day)}
                        disabled={isPast}
                        className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                          isPast ? 'text-gray-300 cursor-not-allowed' :
                          selectedDate === day ? 'bg-blue-600 text-white shadow-md' : 
                          'text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 font-medium">
                  🌍 {schedule?.timezone}
                </div>
              </div>
              
              {/* Time Slots */}
              {selectedDate && (
                <div className="w-full md:w-[45%] flex flex-col h-[480px]">
                  <h3 className="text-gray-800 font-medium mb-4 text-center md:text-left">{shortMonthNames[month]} {selectedDate}</h3>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {availableSlots.length === 0 ? (
                      <div className="text-center text-gray-500 mt-10">No available times on this day.</div>
                    ) : (
                      availableSlots.map((time) => (
                        <div key={time} className="flex gap-2">
                          <button
                            onClick={() => { setSelectedTime(time); setError(null); }}
                            className={`flex-1 py-3.5 px-4 border rounded-md font-bold text-center transition-all bg-white ${
                              selectedTime === time ? 'border-gray-500 text-gray-600 w-1/2' : 'border-blue-500 text-blue-600 hover:border-blue-700 hover:border-2 hover:py-[13px] w-full'
                            }`}
                          >
                            {time}
                          </button>
                          {selectedTime === time && (
                            <button onClick={handleNext} className="w-1/2 py-3.5 px-4 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors">
                              Next
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto animation-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4 mt-2">
                  <h4 className="text-sm font-bold text-gray-800">Additional Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Purpose</label>
                    <textarea rows="2" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                  </div>
                </div>
                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">⚠️ {error}</div>}
                <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors w-auto">Schedule Event</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}