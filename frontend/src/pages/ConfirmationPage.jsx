import { useLocation } from 'react-router-dom';

export default function ConfirmationPage() {
  const location = useLocation();
  
  // Grab the data passed from the Booking Page, or use fallbacks if someone refreshes the page
  const details = location.state || {
    eventTitle: 'Meeting',
    inviteeName: 'Guest',
    date: 'Date to be confirmed',
    time: 'Time to be confirmed',
    timezone: 'Your Local Time'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You are scheduled</h1>
        <p className="text-gray-600 mb-8 text-lg">A calendar invitation has been sent to your email address.</p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left max-w-md mx-auto mb-8">
          <h2 className="font-bold text-gray-900 text-xl mb-4">{details.eventTitle}</h2>
          <div className="space-y-3 text-gray-600 font-medium">
            <div className="flex items-start gap-3">
              <span className="text-xl">👤</span> {details.inviteeName}
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📅</span> {details.time}, {details.date}
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🌎</span> {details.timezone}
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎥</span> Web conferencing details to follow.
            </div>
          </div>
        </div>

        {/* Removed the Dashboard link. It's an Invitee-facing page, so we just let them close the tab! */}
        <p className="text-sm text-gray-500">You may close this window.</p>
      </div>
    </div>
  );
}