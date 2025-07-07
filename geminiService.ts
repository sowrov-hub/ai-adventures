
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const kidFriendlySystemInstruction = "You are a friendly, encouraging, and fun AI assistant for kids aged 8-12. Explain things simply, use positive language, and make learning exciting. Keep your answers concise and easy to understand.";

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction || kidFriendlySystemInstruction,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        return "Oops! Something went wrong. I couldn't think of anything right now. Maybe try asking again?";
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A vibrant, kid-friendly, cartoon-style image of: ${prompt}`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return "";
    } catch (error) {
        console.error("Error generating image:", error);
        return "";
    }
}

export function initiateChat(systemInstruction?: string): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: systemInstruction || kidFriendlySystemInstruction,
        },
    });
}
