import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import Meeting from './models/Meeting.js';
import Schedule from './models/Schedule.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

   
    await Event.deleteMany();
    await Meeting.deleteMany();
    await Schedule.deleteMany();
    console.log('Cleared existing data.');


    await Event.insertMany([
      { title: '15 Min Catch Up', duration: 15, slug: '15-min-catch-up', bufferBefore: 0, bufferAfter: 0, color: 'bg-blue-500', type: 'One-on-One' },
      { title: '30 Min Discovery Call', duration: 30, slug: '30-min-discovery-call', bufferBefore: 5, bufferAfter: 10, color: 'bg-green-500', type: 'One-on-One' },
      { title: '60 Min Deep Dive', duration: 60, slug: '60-min-deep-dive', bufferBefore: 15, bufferAfter: 15, color: 'bg-purple-500', type: 'One-on-One' }
    ]);
    console.log('Seeded Event Types.');


    await Schedule.create({
      name: 'Working Hours',
      timezone: 'India Standard Time (IST)',
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
    console.log('Seeded Default Schedule.');

    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const formatDate = (date) => date.toISOString().split('T')[0];

    await Meeting.insertMany([
      { name: 'Vivek kumar', email: 'vivek@gmail.com', phone: '123-456-7890', purpose: 'Initial sync', date: formatDate(tomorrow), time: '10:00', event: '15 Min Catch Up', status: 'upcoming' },
      { name: 'Sanam singh', email: 'sanam@gmail.com', purpose: 'Project scoping', date: formatDate(nextWeek), time: '14:30', event: '30 Min Discovery Call', status: 'upcoming' },
      { name: 'Ravi singh', email: 'ravi@gmail.com', date: formatDate(today), time: '09:00', event: '60 Min Deep Dive', status: 'past' }
    ]);
    console.log('Seeded Meetings.');

    console.log('Seeding complete! You can now exit.');
    process.exit(); 
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();