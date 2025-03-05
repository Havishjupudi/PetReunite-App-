import mongoose from 'mongoose';


const temporaryFoundPetSchema = new mongoose.Schema({
    species: { type: String, required: true },
    foundArea: { type: String, required: true },
    nearestLandmark: { type: String },
    description: { type: String },
    pictureUrl: { type: String },
    emailAddress: { type: String },
    reuniteId: { type: String, required: true, unique: true },
    dateFound: { type: Date, default: Date.now },
});

const TemporaryFoundPet = mongoose.model('TemporaryFoundPet', temporaryFoundPetSchema);

export default TemporaryFoundPet;
