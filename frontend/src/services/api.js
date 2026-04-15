// src/services/api.js

// Fake Database (Simulating MongoDB)
let db = {
  events: [
    { id: '1', title: '30 Minute Meeting', duration: 30, slug: '30min', bufferBefore: 0, bufferAfter: 15 },
  ],
availability: {
    schedules: [
      {
        id: '1',
        name: 'Working Hours',
        timezone: 'India Standard Time (IST)',
        defaultHours: [
          { day: 'SUNDAY', active: false, start: '09:00', end: '17:00' },
          { day: 'MONDAY', active: true, start: '09:00', end: '17:00' },
          { day: 'TUESDAY', active: true, start: '09:00', end: '17:00' },
          { day: 'WEDNESDAY', active: true, start: '09:00', end: '17:00' },
          { day: 'THURSDAY', active: true, start: '09:00', end: '17:00' },
          { day: 'FRIDAY', active: true, start: '09:00', end: '16:00' },
          { day: 'SATURDAY', active: false, start: '09:00', end: '17:00' },
        ],
        overrides: []
      }
    ]
  },
  meetings: []
};

// API Methods
export const api = {
  // --- EVENT TYPES ---
  getEvents: async () => [...db.events],
  createEvent: async (eventData) => {
    const newEvent = { id: Date.now().toString(), ...eventData };
    db.events.push(newEvent);
    return newEvent;
  },
  deleteEvent: async (id) => {
    db.events = db.events.filter(e => e.id !== id);
    return true;
  },
  updateEvent: async (id, eventData) => {
    const index = db.events.findIndex(e => e.id === id);
    if (index !== -1) {
      db.events[index] = { ...db.events[index], ...eventData };
      return db.events[index];
    }
    throw new Error("Event not found");
  },

  // --- MEETINGS ---
  getMeetings: async () => [...db.meetings],
  createMeeting: async (meetingData) => {
    // Check for double booking (Core Requirement)
    const isConflict = db.meetings.some(m => m.date === meetingData.date && m.time === meetingData.time);
    if (isConflict) throw new Error("Time slot already booked!");

    const newMeeting = { id: Date.now().toString(), status: 'upcoming', ...meetingData };
    db.meetings.push(newMeeting);
    return newMeeting;
  },
  cancelMeeting: async (id) => {
    const meeting = db.meetings.find(m => m.id === id);
    if (meeting) meeting.status = 'cancelled';
    return true;
  },
  // --- AVAILABILITY ---
  getSchedules: async () => {
    return JSON.parse(JSON.stringify(db.availability.schedules));
  },
  saveSchedule: async (scheduleData) => {
    const index = db.availability.schedules.findIndex(s => s.id === scheduleData.id);
    if (index !== -1) {
      db.availability.schedules[index] = JSON.parse(JSON.stringify(scheduleData));
    } else {
      db.availability.schedules.push(JSON.parse(JSON.stringify(scheduleData)));
    }
    return true;
  },
  createSchedule: async (name) => {
    const newSchedule = {
      id: Date.now().toString(),
      name: name,
      timezone: 'India Standard Time (IST)',
      defaultHours: [
        { day: 'SUNDAY', active: false, start: '09:00', end: '17:00' },
        { day: 'MONDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'TUESDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'WEDNESDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'THURSDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'FRIDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'SATURDAY', active: false, start: '09:00', end: '17:00' },
      ],
      overrides: []
    };
    db.availability.schedules.push(newSchedule);
    return JSON.parse(JSON.stringify(newSchedule));
  },
};
