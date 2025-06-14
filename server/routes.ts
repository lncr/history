import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateComicScript, generateComicImage } from "./openai";
import { z } from "zod";

const generateComicSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Comic generation endpoint
  app.post("/api/generate-comic", async (req, res) => {
    try {
      const { topic } = generateComicSchema.parse(req.body);
      
      // Generate comic script
      const scriptPages = await generateComicScript(topic);
      
      // Generate images for each page
      const comicPages = await Promise.all(
        scriptPages.map(async (script, index) => {
          const imageUrl = await generateComicImage(script);
          return {
            pageNumber: index + 1,
            script,
            imageUrl,
          };
        })
      );
      
      res.json({ success: true, pages: comicPages });
    } catch (error) {
      console.error("Comic generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate comic" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
