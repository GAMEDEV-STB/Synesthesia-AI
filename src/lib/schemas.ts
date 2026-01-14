import { z } from "zod";

// --- Input Validation Schemas ---

// 1. Emotion Detection Input
export const emotionDetectionSchema = z.object({
    // Accept base64 image or audio buffer
    media: z.string().min(1, "Media data is required").max(10 * 1024 * 1024, "File too large (max 10MB)"),
    mimeType: z.enum(["image/jpeg", "image/png", "audio/webm", "audio/wav"]),
    timestamp: z.number().int().positive(),
});

// 2. Chat Message Input
export const chatMessageSchema = z.object({
    message: z
        .string()
        .min(1, "Message cannot be empty")
        .max(1000, "Message too long")
        .trim(), // Sanitization: trim whitespace
    history: z.array(
        z.object({
            role: z.enum(["user", "model"]),
            text: z.string(),
        })
    ).max(10, "History limited to 10 messages"), // Security: Limit context size
});

// 3. Journal Entry Input
export const journalEntrySchema = z.object({
    emotion: z.string().max(50),
    intensity: z.number().min(0).max(10),
    notes: z.string().max(5000).optional(),
    tags: z.array(z.string().max(20)).max(10),
});

export type EmotionDetectionInput = z.infer<typeof emotionDetectionSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
