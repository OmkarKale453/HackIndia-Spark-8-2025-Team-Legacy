import { users, type User, type InsertUser, uploads, type Upload, type InsertUpload } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUpload(id: number): Promise<Upload | undefined>;
  updateUploadAnalysis(id: number, result: boolean, details: string): Promise<Upload | undefined>;
  getAllUploads(): Promise<Upload[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private uploads: Map<number, Upload>;
  userCurrentId: number;
  uploadCurrentId: number;

  constructor() {
    this.users = new Map();
    this.uploads = new Map();
    this.userCurrentId = 1;
    this.uploadCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createUpload(insertUpload: InsertUpload): Promise<Upload> {
    const id = this.uploadCurrentId++;
    const upload: Upload = { 
      ...insertUpload, 
      id, 
      analysisResult: null,
      analysisDetails: null,
      createdAt: new Date().toISOString()
    };
    this.uploads.set(id, upload);
    return upload;
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    return this.uploads.get(id);
  }

  async updateUploadAnalysis(id: number, result: boolean, details: string): Promise<Upload | undefined> {
    const upload = this.uploads.get(id);
    if (upload) {
      const updatedUpload = { 
        ...upload, 
        analysisResult: result, 
        analysisDetails: details 
      };
      this.uploads.set(id, updatedUpload);
      return updatedUpload;
    }
    return undefined;
  }

  async getAllUploads(): Promise<Upload[]> {
    return Array.from(this.uploads.values());
  }
}

export const storage = new MemStorage();
