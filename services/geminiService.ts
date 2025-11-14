
import { GoogleGenAI, Type } from "@google/genai";
import type { Puzzle } from '../types';

const fallbackPuzzles: Puzzle[] = [
    { numbers: [7, 1, 6], operators: ['-', '+'], result: 2 },
    { numbers: [8, 4, 2], operators: ['÷', '×'], result: 4 },
    { numbers: [3, 3, 3], operators: ['×', '+'], result: 12 },
    { numbers: [9, 3, 2], operators: ['-', '×'], result: 12 },
    { numbers: [5, 2, 8], operators: ['+', '-'], result: -1 },
    { numbers: [2, 2, 2], operators: ['+', '×'], result: 6 },
    { numbers: [1, 5, 4], operators: ['+', '÷'], result: 2.25 }, // It is not integer, will be filtered
    { numbers: [6, 2, 3], operators: ['÷', '+'], result: 6 }
];

// Helper to map API operators to display operators
const mapOperator = (op: string): string => {
  if (op === '*') return '×';
  if (op === '/') return '÷';
  return op;
};


export const generatePuzzles = async (): Promise<Puzzle[]> => {
    console.log("Attempting to generate puzzles with Gemini API...");
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not found. Using fallback puzzles.");
        return fallbackPuzzles.filter(p => Number.isInteger(p.result));
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate an array of 50 unique math puzzles for kids. Each puzzle must be in the format: number operator number operator number = result. Numbers must be single digits (1-9). Operators can be +, -, *, /. The final result must be an integer between -10 and 50. Order of operations is left-to-right. Provide the output as a JSON object matching the provided schema.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            numbers: { type: Type.ARRAY, description: "An array of 3 single-digit numbers.", items: { type: Type.INTEGER } },
                            operators: { type: Type.ARRAY, description: "An array of 2 operators (+, -, *, /).", items: { type: Type.STRING } },
                            result: { type: Type.INTEGER, description: "The integer result of the equation." }
                        },
                        required: ['numbers', 'operators', 'result']
                    }
                },
            },
        });
        
        const jsonText = response.text.trim();
        const puzzlesFromApi = JSON.parse(jsonText);

        if (!Array.isArray(puzzlesFromApi)) {
            throw new Error("API did not return a valid array.");
        }

        const formattedPuzzles: Puzzle[] = puzzlesFromApi
            .map((p: any) => ({
                numbers: p.numbers,
                operators: p.operators.map(mapOperator),
                result: p.result
            }))
            .filter((p: Puzzle) => 
                p.numbers?.length === 3 && 
                p.operators?.length === 2 && 
                typeof p.result === 'number' &&
                Number.isInteger(p.result) // Ensure result is an integer
            );
        
        console.log(`Successfully generated ${formattedPuzzles.length} puzzles.`);
        return formattedPuzzles.length > 0 ? formattedPuzzles : fallbackPuzzles.filter(p => Number.isInteger(p.result));
    } catch (error) {
        console.error("Error generating puzzles with Gemini API:", error);
        console.log("Using fallback puzzles due to API error.");
        return fallbackPuzzles.filter(p => Number.isInteger(p.result));
    }
};
