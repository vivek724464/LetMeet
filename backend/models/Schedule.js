import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timezone: { type: String, required: true, default: 'India Standard Time (IST)' },
  defaultHours: [{
    day: String,
    active: Boolean,
    start: String,
    end: String
  }],
  overrides: [{
    id: String, 
    date: String,
    isAvailable: Boolean,
    blocks: [{
      start: String,
      end: String
    }]
  }]
}, { timestamps: true });

scheduleSchema.set('toJSON', { 
  virtuals: true, 
  transform: (doc, ret) => { 
    ret.id = ret._id; 
    delete ret._id; 
    delete ret.__v; 
  } 
});

export default mongoose.model('Schedule', scheduleSchema);