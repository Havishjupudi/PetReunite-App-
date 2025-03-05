import mongoose from 'mongoose';

const connectDB = async () => {
    const uri = 'mongodb+srv://krypton052:Havi%401234@cluster0.pvy5x.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=Cluster0';
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectDB;
