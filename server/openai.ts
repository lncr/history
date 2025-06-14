import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateComicScript(topic: string): Promise<string[]> {
  const prompt = `Write me a script for comic book for topic name ${topic}. The script should be generated for 4 page comic book. Separate each page script by the word HUZZAA. Don't use any emojis and give me only script without any introduction or your own words`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const script = response.choices[0].message.content;
    if (!script) {
      throw new Error("No script generated");
    }

    // Split by HUZZAA and filter out empty strings
    const pages = script.split("HUZZAA").map(page => page.trim()).filter(page => page.length > 0);
    
    return pages;
  } catch (error) {
    throw new Error("Failed to generate comic script: " + (error as Error).message);
  }
}

export async function generateComicImage(scriptPage: string): Promise<string> {
  const prompt = `Generate me a historically accurate and engaging comic book page from given script: ${scriptPage}`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data || !response.data[0]?.url) {
      throw new Error("No image URL received from OpenAI");
    }
    return response.data[0].url;
  } catch (error) {
    throw new Error("Failed to generate comic image: " + (error as Error).message);
  }
}