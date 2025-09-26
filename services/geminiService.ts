
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { type MoodEntry, Mood, type AIPattern } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const moodList = Object.values(Mood).join(', ');

export const analyzeMoodFromText = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the mood of the following text and classify it into one of these categories: ${moodList}. Return only the category name. Text: "${text}"`,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        const mood = response.text.trim();
        // Basic validation
        if (Object.values(Mood).map(m=>m.toLowerCase()).includes(mood.toLowerCase())) {
            const capitalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
            return capitalizedMood;
        }
        return 'Neutral';
    } catch (error) {
        console.error("Error analyzing mood:", error);
        return 'Neutral'; // Default fallback
    }
};


export const identifyPatterns = async (entries: MoodEntry[]): Promise<AIPattern[]> => {
    if (entries.length < 5) {
        return [{ pattern: "Not enough data yet.", suggestion: "Keep logging your moods daily to unlock powerful insights!" }];
    }

    const formattedEntries = entries.map(e => 
        `- ${e.timestamp.toLocaleDateString()}: Mood - ${e.mood}, Notes - "${e.notes}"`
    ).join('\n');
    
    const prompt = `Based on the following mood log entries, identify 2-3 key patterns or triggers and provide an actionable suggestion for each. The user is looking for insights into their mental wellness. Return the output as a JSON array of objects, where each object has a "pattern" and a "suggestion".

    Mood Log:
    ${formattedEntries}

    Identify patterns related to days of the week, recurring feelings, or connections between notes and moods. Provide concise, supportive, and actionable advice.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pattern: {
                                type: Type.STRING,
                                description: "A concise description of the identified pattern or trigger."
                            },
                            suggestion: {
                                type: Type.STRING,
                                description: "A supportive and actionable suggestion based on the pattern."
                            }
                        }
                    }
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as AIPattern[];
    } catch (error) {
        console.error("Error identifying patterns:", error);
        return [{ pattern: "Could not analyze patterns.", suggestion: "There was an issue connecting to the AI. Please try again later." }];
    }
};

export const generateWeeklySummary = async (entries: MoodEntry[]): Promise<string> => {
    if (entries.length === 0) {
        return "No mood entries this week to summarize. Let's start by logging how you feel today!";
    }

    const formattedEntries = entries.map(e => 
        `- ${e.timestamp.toLocaleDateString()}: ${e.mood}`
    ).join('\n');
    
    const prompt = `Here are my mood entries for the past week:
    ${formattedEntries}

    Write a brief, encouraging, and conversational summary of my week. Highlight any positive trends and offer gentle encouragement. Speak like a supportive friend. For example: "This week, I noticed you felt..."`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating weekly summary:", error);
        return "I had some trouble generating your summary. Please try again in a moment.";
    }
};

export const startChatSession = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are MANAM AI, a friendly and supportive mental wellness assistant. Your name, MANAM, means 'mind' or 'heart' in Tamil. Your goal is to help users navigate their feelings with empathy and care.
- If a user expresses sadness, stress, or anxiety, respond with gentle, encouraging words and offer simple, actionable coping strategies (like deep breathing, a short walk, or listening to calm music).
- If a user expresses happiness, calmness, or excitement, celebrate with them! Encourage them to savor the moment and reflect on what's bringing them joy.
- Keep your responses concise, positive, and conversational. Use emojis to add warmth.
- Always be a safe, non-judgmental space for the user.`,
        },
    });
    return chat;
};
