import Schedule from '../models/Schedule.js';

export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const newSchedule = await Schedule.create({
      name: req.body.name,
      defaultHours: [
        { day: 'SUNDAY', active: false, start: '09:00', end: '17:00' },
        { day: 'MONDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'TUESDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'WEDNESDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'THURSDAY', active: true, start: '09:00', end: '17:00' },
        { day: 'FRIDAY', active: true, start: '09:00', end: '16:00' },
        { day: 'SATURDAY', active: false, start: '09:00', end: '17:00' }
      ]
    });
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};