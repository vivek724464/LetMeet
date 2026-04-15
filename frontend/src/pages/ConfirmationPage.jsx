import { Link } from 'react-router-dom';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You are scheduled</h1>
        <p className="text-gray-600 mb-8 text-lg">A calendar invitation has been sent to your email address.</p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left max-w-md mx-auto mb-8">
          <h2 className="font-bold text-gray-900 text-xl mb-4">30 Minute Meeting</h2>
          <div className="space-y-3 text-gray-600 font-medium">
            <div className="flex items-start gap-3">
              <span className="text-xl">👤</span> Jane Doe
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📅</span> 10:00 AM - 10:30 AM, Wednesday, October 24, 2024
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🌎</span> Pacific Time - US & Canada
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎥</span> Web conferencing details to follow.
            </div>
          </div>
        </div>

        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}