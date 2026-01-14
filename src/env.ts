import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FIREBASE_API_KEY: z.string().min(1).optional(),
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  GOOGLE_GENAI_API_KEY: z.string().min(1).optional(),
  // Security: Rate limiting secret (optional for now, good practice)
  RATE_LIMIT_SECRET: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  // Add other public keys here
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
  RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

// Validate Env at runtime
const parsedServer = serverSchema.safeParse(processEnv);
const parsedClient = clientSchema.safeParse(processEnv);

if (!parsedServer.success) {
  console.error("❌ Invalid server environment variables:", parsedServer.error.flatten().fieldErrors);
  // In serious production, we might throw here. For "vibe" coding, we log.
}

if (!parsedClient.success) {
  console.error("❌ Invalid client environment variables:", parsedClient.error.flatten().fieldErrors);
}

export const env = {
  ...processEnv,
  // Helper to check for production
  isProduction: process.env.NODE_ENV === "production",
} as const;
