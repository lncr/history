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
    console.log("=== COMIC GENERATION REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));
    
    try {
      const { topic } = generateComicSchema.parse(req.body);
      console.log("Validated topic:", topic);
      
      // Generate comic script
      console.log("Starting script generation...");
      const scriptPages = await generateComicScript(topic);
      console.log("Script generation completed. Pages:", scriptPages.length);
      
      // Generate visual descriptions for each page
      console.log("Starting visual description generation for all pages...");
      const comicPages = await Promise.all(
        scriptPages.map(async (script, index) => {
          console.log(`\n--- Generating visual description for page ${index + 1} ---`);
          const visualDescription = await generateComicImage(script);
          console.log(`Page ${index + 1} visual description generated successfully`);
          return {
            pageNumber: index + 1,
            script,
            imageUrl: visualDescription, // Using imageUrl field to store visual description
          };
        })
      );
      
      console.log("All comic pages generated successfully:");
      console.log("Final response:", JSON.stringify({ success: true, pages: comicPages }, null, 2));
      
      res.json({ success: true, pages: comicPages });
    } catch (error) {
      console.error("=== COMIC GENERATION ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
      console.error("Full error object:", error);
      
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate comic" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
