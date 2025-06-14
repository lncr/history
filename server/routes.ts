import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateComicScript, generateComicImage } from "./openai";
import { z } from "zod";

const generateComicSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Comic generation endpoint with streaming
  app.post("/api/generate-comic", async (req, res) => {
    console.log("=== COMIC GENERATION REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));
    
    try {
      const { topic } = generateComicSchema.parse(req.body);
      console.log("Validated topic:", topic);
      
      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });
      
      // Generate comic script
      console.log("Starting script generation...");
      res.write(`data: ${JSON.stringify({ type: 'status', message: 'Generating comic script...' })}\n\n`);
      
      const scriptPages = await generateComicScript(topic);
      console.log("Script generation completed. Pages:", scriptPages.length);
      
      res.write(`data: ${JSON.stringify({ type: 'script_complete', pages: scriptPages.length })}\n\n`);
      
      // Generate visual descriptions for each page sequentially
      console.log("Starting visual description generation...");
      for (let i = 0; i < scriptPages.length; i++) {
        const script = scriptPages[i];
        console.log(`\n--- Generating visual description for page ${i + 1} ---`);
        
        res.write(`data: ${JSON.stringify({ type: 'generating_page', pageNumber: i + 1 })}\n\n`);
        
        try {
          const visualDescription = await generateComicImage(script);
          console.log(`Page ${i + 1} visual description generated successfully`);
          
          const comicPage = {
            pageNumber: i + 1,
            script,
            imageUrl: visualDescription,
          };
          
          res.write(`data: ${JSON.stringify({ type: 'page_complete', page: comicPage })}\n\n`);
        } catch (pageError) {
          console.error(`Error generating page ${i + 1}:`, pageError);
          res.write(`data: ${JSON.stringify({ 
            type: 'page_error', 
            pageNumber: i + 1, 
            error: pageError instanceof Error ? pageError.message : 'Failed to generate page'
          })}\n\n`);
        }
      }
      
      res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
      res.end();
      
    } catch (error) {
      console.error("=== COMIC GENERATION ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
      console.error("Full error object:", error);
      
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        error: error instanceof Error ? error.message : "Failed to generate comic" 
      })}\n\n`);
      res.end();
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
