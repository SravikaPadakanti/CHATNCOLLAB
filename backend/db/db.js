import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // ignore if restricted
}

let mongod = null;

async function connect() {
    const mongoUri = process.env.MONGODB_URI;
    const forceMock = process.env.USE_MOCK_MONGO === 'true';

    if (forceMock || !mongoUri) {
        try {
            console.log("Starting in-memory MongoDB engine (zero setup needed)...");
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log("In-memory MongoDB started successfully at:", uri);
            await mongoose.connect(uri);
            console.log("✓ Connected to in-memory MongoDB");
        } catch (err) {
            console.error("Failed to connect to in-memory MongoDB:", err);
        }
    } else {
        try {
            // Mask password in logs for security
            const sanitized = mongoUri.replace(/:([^:@]+)@/, ':****@');
            console.log(`Connecting to external MongoDB (${sanitized})...`);
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("✓ Successfully connected to external MongoDB (Atlas / Cloud)");
        } catch (err) {
            console.error("External MongoDB connection error:", err.message);
            console.log("Falling back to in-memory MongoDB engine so your application stays live...");
            try {
                mongod = await MongoMemoryServer.create();
                await mongoose.connect(mongod.getUri());
                console.log("✓ Connected to fallback in-memory MongoDB");
            } catch (fallbackErr) {
                console.error("Fallback in-memory MongoDB failed:", fallbackErr);
            }
        }
    }
}

export default connect;