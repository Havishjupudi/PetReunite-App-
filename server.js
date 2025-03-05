import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Pet from './models/pet.js';
import TempFoundPet from './models/tempFoundPet.js';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp'; 
import axios from 'axios';
import TemporaryFoundPet from './models/tempFoundPetModel.js'; 


dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Multer config [memory storage]
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
connectDB().then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from /public directory
app.use('/public', express.static(path.join(__dirname, 'public')));;

app.get('/html/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', req.params.filename));
});

// Route to serve the root index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// Fetch all lost pets (latest first) LOST PETS --> listing page
app.get('/pets/lost', async (req, res) => {
    try {
        const lostPets = await Pet.find({ isLost: true }).sort({ _id: -1 }); 
        res.json(lostPets);
    } catch (error) {
        console.error('Error fetching lost pets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all found pets (latest first) FOUND PETS --> listing page
app.get('/TempFoundPet', async (req, res) => {
    try {
        const foundPets = await TempFoundPet.find().sort({ _id: -1 }); 
        res.json(foundPets);
    } catch (err) {
        console.error('Error fetching found pets:', err);
        res.status(500).json({ error: 'Failed to fetch found pets' });
    }
});

  

// Get specific found pet with reuniteId FOUND PETS--> details page
app.get('/TempFoundPet/:reuniteId', async (req, res) => { 
    const reuniteId = req.params.reuniteId;

    try {
        const pet = await TempFoundPet.findOne({ reuniteId });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.json(pet);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pet details' });
    }
});

// Fetch pet details by reuniteId LOST PETS DB-> details page
app.get('/pets/:reuniteId', async (req, res) => {
    const reuniteId = req.params.reuniteId;

    try {
        const pet = await Pet.findOne({ reuniteId });

        if (!pet) {
            return res.status(404).send('Pet not found');
        }

        res.json(pet);
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).send('Server error');
    }
});

// Fetch pets from FoundPets DB [NOID] --> listing page
app.get('/FoundPets', async (req, res) => {
    try {
        const foundPets = await TemporaryFoundPet.find().sort({ _id: -1 }); 
        res.json(foundPets);
    } catch (err) {
        console.error('Error fetching found pets:', err);
        res.status(500).json({ error: 'Failed to fetch found pets' });
    }
});

// Get pet by reuniteId  FoundPets DB [NOID]
app.get('/FoundPets/:reuniteId', async (req, res) => {
    const reuniteId = req.params.reuniteId;

    try {
        const pet = await TemporaryFoundPet.findOne({ reuniteId });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.json(pet);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pet details' });
    }
});

// Stamp Found
const stampImage = async (buffer, status) => {

    const { width, height } = await sharp(buffer).metadata();

    const stampWidth = Math.floor(width * 0.9); 
    const stampHeight = Math.floor(height * 0.9); 

    
    const stampImageBuffer = await sharp(path.join(__dirname, 'public', 'images', 'stamps', 'lost_stamp.png'))
    .resize({ width: stampWidth, height: stampHeight }) 
    .toBuffer(); 

    
    return sharp(buffer)
    .composite([{ 
        input: stampImageBuffer, 
        gravity: 'center',
        blend: 'over',
        opacity: 0.1 
    }])
    .toBuffer();
}

// Inata Integration

import { IgApiClient } from 'instagram-private-api'; 


const postNewPetToInstagram = async (newPet) => {
    const username = process.env.INSTAGRAM_USERNAME; 
    const password = process.env.INSTAGRAM_PASSWORD; 

    const ig = new IgApiClient();
    ig.state.generateDevice(username); 

    try {
        const { name, sex, species, dateLastSeen, areaLastSeen, nearestLandmark, description, pictureUrl } = newPet;

        const caption = `
            🐾 *Pet Alert* 🐾
            Name: ${name}
            Sex: ${sex}
            Species: ${species}
            Last Seen: ${dateLastSeen}
            Area Last Seen: ${areaLastSeen}
            Nearest Landmark: ${nearestLandmark}
            Description: ${description}
        `;

        
        await ig.account.login(username, password);

        // Fetch the image from Cloudinary (or any URL) using axios
        const response = await axios.get(pictureUrl, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;

        // Post the image to Instagram
        await ig.publish.photo({
            file: imageBuffer,
            caption: caption,
        });

        console.log('New pet posted to Instagram:', caption);
    } catch (error) {
        console.error('Error posting to Instagram:', error);
    }
};


// Lost Pet DB Upload
app.post('/pets', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded.' });
    }

    try {
        const reuniteId = await generateUniqueReuniteId(); // Generate Reunite ID

        // Stamp 
        const stampedImageBuffer = await stampImage(req.file.buffer, 'lost');

        // Upload stamped image directly to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'pets', public_id: `${reuniteId}-${req.file.originalname}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(stampedImageBuffer);
        });

        const newPet = new Pet({
            name: req.body['lost-pet-name'],
            sex: req.body.sex,
            species: req.body.species,
            dateLastSeen: req.body['date-last-seen'],
            areaLastSeen: req.body['area-last-seen'],
            nearestLandmark: req.body['nearest-landmark'],
            description: req.body.description,
            emailAddress: req.body.email,
            pictureUrl: result.secure_url, 
            reuniteId: reuniteId,
            isLost: true
        });
    
        await newPet.save();
        await postNewPetToInstagram(newPet);

        res.status(201).json({
            message: 'Pet reported successfully.',
            pet: newPet 
        });
    } catch (error) {
        console.error('Error saving pet:', error);
        res.status(400).json({ message: error.message });
    }
});

const postNOIDFoundPetToInstagram = async (newPet) => {
    const username = process.env.INSTAGRAM_USERNAME; 
    const password = process.env.INSTAGRAM_PASSWORD; 

    const ig = new IgApiClient();

    // Generate a device ID and other settings
    // Use username to generate device ID
    ig.state.generateDevice(username); 

    try {
        const { name, sex, species, dateFound, foundArea, nearestLandmark, description, pictureUrl } = newPet;

        const caption = `\
            🐾 *Found Pet Alert* 🐾
            Name: ${name}
            Sex: ${sex}
            Species: ${species}
            Date Found: ${dateFound}
            Found Area: ${foundArea}
            Nearest Landmark: ${nearestLandmark}
            Description: ${description}
        `;

        console.log('Caption for Instagram:', caption);

        // Log in using username and password
        await ig.account.login(username, password);

        // Fetch the image from Cloudinary (or any URL) using axios
        const response = await axios.get(pictureUrl, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;

        // Post the image to Instagram
        await ig.publish.photo({
            file: imageBuffer,
            caption: caption,
        });

        console.log('Found pet posted to Instagram:', caption);
        return { success: true, message: 'Posted on Instagram!' };
    } catch (error) {
        console.error('Error posting to Instagram:', error);
        return { success: false, message: 'Failed to post on Instagram.' };
    }
};


app.use(express.json()); 

// Found Pets DB Upload
app.post('/FoundPets', upload.single('image'), async (req, res) => {
    console.log('Request Body:', req.body); 
    console.log('Uploaded File:', req.file);  

    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded.' });
    }

    try {
        const reuniteId = await generateUniqueReuniteId(); // Generate Reunite ID

        // Stamp 
        const stampedImageBuffer = await stampImageFound(req.file.buffer, 'lost');

        // Upload stamped image directly to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'pets', public_id: `${reuniteId}-${req.file.originalname}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(stampedImageBuffer);
        });

        const newPet = new TemporaryFoundPet({
            species: req.body['fill-species'],
            foundArea: req.body['fill-found-area'],
            nearestLandmark: req.body['fill-nearest-landmark'],
            description: req.body['fill-description'],
            emailAddress: req.body['fill-email'],
            pictureUrl: result.secure_url, 
            reuniteId: reuniteId
        });

        await newPet.save();
        await postNOIDFoundPetToInstagram(newPet);

        res.status(201).json({
            message: 'Pet reported successfully.',
            pet: newPet 
        });
    } catch (error) {
        console.error('Error saving pet:', error);
        res.status(500).json({ message: error.message });
    }
});


// Stamp function [LOST]
const stampImageFound = async (buffer) => {
    
    const { width, height } = await sharp(buffer).metadata();

    
    const stampWidth = Math.floor(width * 0.9); 
    const stampHeight = Math.floor(height * 0.9); 

    // Load the stamp image and resize it
    const stampImageBuffer = await sharp(path.join(__dirname, 'public', 'images', 'stamps', 'found_stamp.png'))
        .resize({ width: stampWidth, height: stampHeight }) 
        .toBuffer(); 

    return sharp(buffer)
        .composite([{
            input: stampImageBuffer,
            gravity: 'center',
            blend: 'over',
            opacity: 0.1 // Adjust opacity (0.0 to 1.0)
        }])
        .toBuffer();
};

const postFoundPetToInstagram = async (newPet) => {
    const username = process.env.INSTAGRAM_USERNAME; 
    const password = process.env.INSTAGRAM_PASSWORD; 

    const ig = new IgApiClient();

    // Generate a device ID and other settings
    ig.state.generateDevice(username); // Use username to generate device ID

    try {
        const { name, sex, species, dateFound, foundArea, nearestLandmark, description, pictureUrl } = newPet;

        const caption = `\
            🐾 *Found Pet Alert* 🐾
            Name: ${name}
            Sex: ${sex}
            Species: ${species}
            Date Found: ${dateFound}
            Found Area: ${foundArea}
            Nearest Landmark: ${nearestLandmark}
            Description: ${description}
        `;

        console.log('Caption for Instagram:', caption);

        // Log in using username and password
        await ig.account.login(username, password);

        // Fetch the image from Cloudinary (or any URL) using axios
        const response = await axios.get(pictureUrl, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;

        // Post the image to Instagram
        await ig.publish.photo({
            file: imageBuffer,
            caption: caption,
        });

        console.log('Found pet posted to Instagram:', caption);
        return { success: true, message: 'Posted on Instagram!' };
    } catch (error) {
        console.error('Error posting to Instagram:', error);
        return { success: false, message: 'Failed to post on Instagram.' };
    }
};


app.post('/TempFoundPet', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded.' });
    }

    try {
        // Stamp the image with "Found"
        const stampedImageBuffer = await stampImageFound(req.file.buffer);

        // Upload stamped image directly to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'foundPets', public_id: `${req.body['found-reunite-id']}-${req.file.originalname}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(stampedImageBuffer);
        });

        // Find and delete the corresponding lost pet
        const lostPet = await Pet.findOneAndDelete({ reuniteId: req.body['found-reunite-id'] });
        
        if (!lostPet) {
            return res.status(404).json({ message: 'No lost pet found with the provided Reunite ID.' });
        }

        // Save the found pet to TempFoundPet
        const tempfoundPet = new TempFoundPet({
            name: req.body['found-pet-name'],
            sex: req.body.sex,
            species: req.body.species,
            foundArea: req.body['found-area'],
            nearestLandmark: req.body['found-nearest-landmark'],
            description: req.body['found-description'],
            emailAddress: req.body.email,
            pictureUrl: result.secure_url,
            reuniteId: req.body['found-reunite-id'],
        });

        await tempfoundPet.save();
        await postFoundPetToInstagram(tempfoundPet);

        
        res.status(201).json({
            message: 'Found pet reported successfully, and lost pet deleted.',
            pet: tempfoundPet 
        });
    } catch (error) {
        console.error('Error saving temp found pet:', error);
        res.status(400).json({ message: error.message });
    }
});



// Function to generate a unique Reunite ID
const generateUniqueReuniteId = async () => {
    let reuniteId;
    const min = 10000; // Min 5-digits
    const max = 99999; // Max 5-digits
    let isUnique = false;

    while (!isUnique) {
        reuniteId = Math.floor(Math.random() * (max - min + 1)) + min;

        try {
            const existingPet = await Pet.findOne({ reuniteId });
            isUnique = !existingPet; // If no existing pet is found, the ID is unique
        } catch (error) {
            console.error('Error checking for existing reunite ID:', error);
        }
    }

    return reuniteId.toString(); // Convert to string for consistency
};

// WebSocket server to notify the frontend
const WS_PORT = process.env.WS_PORT || 8081;
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`WebSocket server running on port ${PORT}`);


wss.on('connection', (ws) => {
    console.log('Frontend connected via WebSocket');

    const changeStream = Pet.watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newPet = change.fullDocument;
            ws.send(JSON.stringify({
                message: 'New pet added',
                data: newPet
            }));
        }
    });

    ws.on('close', () => {
        console.log('Frontend disconnected');
        changeStream.close(); // Close change stream on disconnect
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
