import { GoogleGenAI, Type } from "@google/genai";
import type { Product, AIRecommendation } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_quantity: {
            type: Type.INTEGER,
            description: 'The recommended order quantity for the product. This should be a whole number.'
        },
        reasoning: {
            type: Type.STRING,
            description: 'A brief, friendly explanation for the recommendation, suitable for a store manager. Mention one or two key factors considered.'
        }
    },
    required: ['recommended_quantity', 'reasoning'],
};


export const getAIOrderRecommendation = async (product: Product, startDate: string, endDate: string): Promise<AIRecommendation> => {
  try {
    const prompt = `
      You are an expert grocery inventory management AI. Your goal is to minimize waste and prevent stockouts.
      Analyze the following product data and provide an optimal order recommendation for the period from ${startDate} to ${endDate}.

      Product Details:
      - Name: ${product.name}
      - Current Stock: ${product.current_stock} ${product.unit}
      - Average Spoilage Rate: ${product.spoilage_rate}%
      - Current System Forecast: ${product.forecast_rec} ${product.unit}

      Consider these factors:
      1.  The forecast period from ${startDate} to ${endDate}. A shorter period might mean smaller, more frequent orders.
      2.  High spoilage rate suggests more frequent, smaller orders might be better, especially for perishable items like ${product.name}.
      3.  Current stock level compared to a typical safety stock for this item.
      4.  The existing system forecast should be used as a baseline, but you must adjust it based on your expert analysis of the other factors, especially the time period.

      Return your recommendation in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.5,
        },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    if (
        typeof parsedResponse.recommended_quantity === 'number' &&
        typeof parsedResponse.reasoning === 'string'
    ) {
        return parsedResponse as AIRecommendation;
    } else {
        throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error("Error fetching AI recommendation:", error);
    throw new Error("Failed to get a recommendation from the AI. Please try again.");
  }
};