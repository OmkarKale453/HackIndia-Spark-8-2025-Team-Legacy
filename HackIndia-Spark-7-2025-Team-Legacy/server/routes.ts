import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { insertUploadSchema } from "@shared/schema";
import { z } from "zod";

// Setup storage for multer
const uploadDir = path.join(process.cwd(), "uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API route to upload an image
  app.post('/api/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const file = req.file;

      const uploadData = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        userId: null // We're not implementing auth for this demo
      };

      // Validate the upload data
      const validatedUpload = insertUploadSchema.parse(uploadData);
      
      // Store the upload in our in-memory database
      const uploadRecord = await storage.createUpload(validatedUpload);
      
      return res.status(201).json({ 
        message: 'File uploaded successfully',
        uploadId: uploadRecord.id,
        filename: uploadRecord.filename
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid upload data', errors: error.errors });
      }
      
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading file' });
    }
  });

  // API route to analyze an uploaded image
  app.post('/api/analyze/:id', async (req: Request, res: Response) => {
    try {
      const uploadId = parseInt(req.params.id);
      
      if (isNaN(uploadId)) {
        return res.status(400).json({ message: 'Invalid upload ID' });
      }
      
      const upload = await storage.getUpload(uploadId);
      
      if (!upload) {
        return res.status(404).json({ message: 'Upload not found' });
      }
      
      // Simulate ML analysis with random result (for demo purposes)
      const isAlert = Math.random() > 0.5;
      const details = isAlert 
        ? 'Our ML model has detected patterns consistent with a potential flood risk in the analyzed area. The satellite imagery shows signs of excessive water accumulation and terrain vulnerabilities.'
        : 'Our ML model analysis indicates normal conditions in the captured area. No signs of imminent natural disasters were detected in the satellite imagery.';
      
      // Update the upload record with the analysis result
      const updatedUpload = await storage.updateUploadAnalysis(uploadId, isAlert, details);
      
      // Send the analysis result back to the client
      return res.status(200).json({
        uploadId: uploadId,
        filename: upload.filename,
        isAlert: isAlert,
        details: details,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analysis error:', error);
      return res.status(500).json({ message: 'Error analyzing image' });
    }
  });

  // API route to get an uploaded image
  app.get('/api/uploads/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
