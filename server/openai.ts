import OpenAI from "openai";
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateComicScript(topic: string): Promise<string[]> {
  const prompt = `Write me a script for comic book for topic name ${topic}. The script should be generated for 4 page comic book. Separate each page script by the word HUZZAA. Don't use any emojis and give me only script without any introduction or your own words`;

  console.log("=== SCRIPT GENERATION ===");
  console.log("Topic:", topic);
  console.log("Prompt:", prompt);

  try {
    const requestData: ChatCompletionCreateParams = {
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    };
    console.log("Request to OpenAI:", JSON.stringify(requestData, null, 2));

    const response = await openai.chat.completions.create(requestData);
    
    console.log("Raw OpenAI Response:", JSON.stringify(response, null, 2));

    const script = response.choices[0].message.content;
    if (!script) {
      throw new Error("No script generated");
    }

    console.log("Generated Script:", script);

    // Split by HUZZAA and filter out empty strings
    const pages = script.split("HUZZAA").map(page => page.trim()).filter(page => page.length > 0);
    
    console.log("Script Pages Count:", pages.length);
    pages.forEach((page, index) => {
      console.log(`Page ${index + 1} Script:`, page);
    });
    
    return pages;
  } catch (error) {
    console.error("Script generation error:", error);
    throw new Error("Failed to generate comic script: " + (error as Error).message);
  }
}

export async function generateComicImage(scriptPage: string): Promise<string> {
  const prompt = `Generate me a historically accurate and engaging comic book page from given script: ${scriptPage}`;

  console.log("=== IMAGE GENERATION ===");
  console.log("Script Page:", scriptPage);
  console.log("Image Prompt:", prompt);
  console.log("Prompt Length:", prompt.length);

  try {
    const requestData = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024" as const,
      quality: "standard" as const,
    };
    console.log("Image Request to OpenAI:", JSON.stringify(requestData, null, 2));

    const response = await openai.images.generate(requestData);
    
    console.log("Raw Image Response:", JSON.stringify(response, null, 2));

    if (!response.data || !response.data[0]?.url) {
      console.error("No image data in response:", response);
      throw new Error("No image URL received from OpenAI");
    }
    
    const imageUrl = response.data[0].url;
    console.log("Generated Image URL:", imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("Image generation error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to generate comic image: " + (error as Error).message);
  }
}