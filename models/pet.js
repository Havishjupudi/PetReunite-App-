import mongoose from 'mongoose'; 

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sex: { type: String },
    species: { type: String },
    dateLastSeen: { type: Date },
    areaLastSeen: { type: String },
    nearestLandmark: { type: String },
    description: { type: String },
    emailAddress: { type: String },
    pictureUrl: { type: String },
    reuniteId: { type: String, unique: true },
    isLost: { type: Boolean, required: true }
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 
