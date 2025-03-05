import mongoose from 'mongoose'; 

const tempFoundPetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sex: { type: String },
    species: { type: String, required: true },
    foundArea: { type: String, required: true },
    nearestLandmark: { type: String },
    description: { type: [String] },
    pictureUrl: { type: String },
    reuniteId: { type: String, required: true, unique: true },
    dateFound: { type: Date, default: Date.now },
});

const TempFoundPet = mongoose.model('TempFoundPet', tempFoundPetSchema); 
export default TempFoundPet; 