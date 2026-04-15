import Meeting from '../models/Meeting.js';
import { sendEmail } from '../utils/email.js'; 

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { date, time } = req.body;
    
    const isConflict = await Meeting.findOne({ date, time, status: 'upcoming' });
    if (isConflict) return res.status(400).json({ error: 'This time slot is already booked!' });

    const newMeeting = await Meeting.create(req.body);

    const subject = `Meeting Confirmed: ${newMeeting.event} with OnTime`;
    const html = `
      <h2>Your meeting is scheduled!</h2>
      <p>Hi ${newMeeting.name},</p>
      <p>You are officially booked for a <strong>${newMeeting.event}</strong>.</p>
      <p><strong>Date:</strong> ${newMeeting.date}<br><strong>Time:</strong> ${newMeeting.time}</p>
    `;
    sendEmail(newMeeting.email, subject, html);

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelMeeting = async (req, res) => {
  try {
    const cancelled = await Meeting.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    

    const subject = `Meeting Cancelled: ${cancelled.event}`;
    const html = `
      <h2>Meeting Cancelled</h2>
      <p>Hi ${cancelled.name},</p>
      <p>Your meeting for <strong>${cancelled.event}</strong> on ${cancelled.date} at ${cancelled.time} has been cancelled.</p>
    `;
    sendEmail(cancelled.email, subject, html);

    res.json(cancelled);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const rescheduleMeeting = async (req, res) => {
  try {
    const { date, time } = req.body;

    const isConflict = await Meeting.findOne({ _id: { $ne: req.params.id }, date, time, status: 'upcoming' });
    if (isConflict) return res.status(400).json({ error: 'This time slot is already booked!' });
    const rescheduled = await Meeting.findByIdAndUpdate(req.params.id, { date, time }, { new: true });
    const subject = `Meeting Rescheduled: ${rescheduled.event}`;
    const html = `
      <h2>Meeting Rescheduled</h2>
      <p>Hi ${rescheduled.name},</p>
      <p>Your meeting for <strong>${rescheduled.event}</strong> has been successfully rescheduled.</p>
      <p><strong>New Date:</strong> ${rescheduled.date}<br><strong>New Time:</strong> ${rescheduled.time}</p>
    `;
    sendEmail(rescheduled.email, subject, html);

    res.json(rescheduled);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};