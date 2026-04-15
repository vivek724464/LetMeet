import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  purpose: { type: String, default: '' },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  event: { type: String, required: true }, 
  status: { type: String, enum: ['upcoming', 'past', 'cancelled'], default: 'upcoming' }
}, { timestamps: true });

meetingSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; } });

export default mongoose.model('Meeting', meetingSchema);