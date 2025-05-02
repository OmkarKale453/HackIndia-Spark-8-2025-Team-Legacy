import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalname: text("originalname").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  userId: integer("user_id").references(() => users.id),
  analysisResult: boolean("analysis_result"),
  analysisDetails: text("analysis_details"),
  createdAt: text("created_at").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  filename: true,
  originalname: true,
  mimetype: true,
  size: true,
  userId: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;
