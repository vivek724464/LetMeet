
const BASE_URL = import.meta.env.VITE_API_URL;


const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong on the server');
  }
  return data;
};

export const api = {
  // --- EVENT TYPES ---
  getEvents: async () => {
    const res = await fetch(`${BASE_URL}/events`);
    return handleResponse(res);
  },
  createEvent: async (eventData) => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return handleResponse(res);
  },
  updateEvent: async (id, eventData) => {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return handleResponse(res);
  },
  deleteEvent: async (id) => {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // --- MEETINGS ---
  getMeetings: async () => {
    const res = await fetch(`${BASE_URL}/meetings`);
    return handleResponse(res);
  },
  createMeeting: async (meetingData) => {
    const res = await fetch(`${BASE_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData)
    });
    return handleResponse(res);
  },
  cancelMeeting: async (id) => {
    const res = await fetch(`${BASE_URL}/meetings/${id}/cancel`, {
      method: 'PUT'
    });
    return handleResponse(res);
  },
  rescheduleMeeting: async (id, newDate, newTime) => {
    const res = await fetch(`${BASE_URL}/meetings/${id}/reschedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate, time: newTime })
    });
    return handleResponse(res);
  },

  // --- AVAILABILITY SCHEDULES ---
  getSchedules: async () => {
    const res = await fetch(`${BASE_URL}/schedules`);
    return handleResponse(res);
  },
  createSchedule: async (name) => {
    const res = await fetch(`${BASE_URL}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return handleResponse(res);
  },
  saveSchedule: async (scheduleData) => {
    const res = await fetch(`${BASE_URL}/schedules/${scheduleData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData)
    });
    return handleResponse(res);
  },
  addOverride: async (scheduleId, overrideData) => {
    const res = await fetch(`${BASE_URL}/schedules/${scheduleId}/overrides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overrideData)
    });
    return handleResponse(res);
  },
  deleteOverride: async (scheduleId, overrideId) => {
    const res = await fetch(`${BASE_URL}/schedules/${scheduleId}/overrides/${overrideId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};