import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function BookingPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', purpose: '' });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00'];

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError(null); 
  };
  
  const handleNext = () => setShowForm(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dateString = `Oct ${selectedDate}, 2024`;

      await api.createMeeting({
        name: formData.name,
        email: formData.email,
        date: dateString,
        time: selectedTime,
        event: '30 Minute Meeting'
      });

      
      navigate('/success');
    } catch (err) {
     
      setError(err.message || "This time slot is no longer available.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel - Fixed Info */}
        <div className="w-full md:w-[35%] p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10">
          {showForm && (
            <button onClick={() => {setShowForm(false); setError(null);}} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mb-8 hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 text-xl leading-none">←</span>
            </button>
          )}
          <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase mb-2">Jane Doe</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">30 Minute Meeting</h1>
          <div className="space-y-4 text-gray-600 font-medium">
            <div className="flex items-center gap-3"><span className="text-2xl">⏱️</span> 30 min</div>
            {selectedDate && selectedTime && showForm && (
              <div className="flex items-start gap-3 text-blue-700">
                <span className="text-2xl mt-0.5">📅</span> 
                <span className="leading-tight">{selectedTime} - 30 mins<br/>Wednesday, Oct {selectedDate}, 2024</span>
              </div>
            )}
            <div className="flex items-center gap-3"><span className="text-2xl">🎥</span> Web conferencing details provided upon confirmation.</div>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="w-full md:w-[65%] p-8 bg-white">
          {!showForm ? (
            <div className="flex flex-col md:flex-row gap-8 h-full">
              {/* Calendar View */}
              <div className={`transition-all duration-300 ${selectedDate ? 'md:w-[55%]' : 'w-full'}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Select a Date & Time</h2>
                <div className="text-center font-semibold text-gray-800 mb-6 text-lg">October 2024</div>
                
                <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold text-gray-500 mb-2">
                  <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => { setSelectedDate(day); setSelectedTime(null); setError(null); }}
                      className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        selectedDate === day ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 font-medium">🌎 Pacific Time - US & Canada</div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="w-full md:w-[45%] flex flex-col h-[480px]">
                  <h3 className="text-gray-800 font-medium mb-4 text-center md:text-left">Wednesday, Oct {selectedDate}</h3>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {times.map((time) => (
                      <div key={time} className="flex gap-2">
                        <button
                          onClick={() => handleTimeSelect(time)}
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Booking Form */
            <div className="max-w-md mx-auto animation-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Standard Fields */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Name *</label>
                  <input 
                    type="text" required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Email *</label>
                  <input 
                    type="email" required 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                {/* Bonus: Custom Questions */}
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4 mt-2">
                  <h4 className="text-sm font-bold text-gray-800">Additional Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Purpose</label>
                    <textarea 
                      rows="2" 
                      value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Error Message UI */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors w-auto">
                  Schedule Event
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}