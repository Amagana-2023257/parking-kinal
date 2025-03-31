import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true, 
  },
  entryTime: {
    type: Date,
    default: null,
  },
  photo: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const Car = mongoose.model('Car', carSchema);

export default Car;