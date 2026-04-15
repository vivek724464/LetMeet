import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  slug: { type: String, required: true, unique: true },
  bufferBefore: { type: Number, default: 0 },
  bufferAfter: { type: Number, default: 0 },
  color: { type: String, default: 'bg-blue-500' },
  type: { type: String, default: 'One-on-One' }
}, { timestamps: true });

eventSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; } });

export default mongoose.model('Event', eventSchema);