import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BaziReading, UserInput, CompatibilityResult, DailyLuckResult, LiuyaoResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baziSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chart: {
      type: Type.OBJECT,
      properties: {
        year: {
          type: Type.OBJECT,
          properties: {
            stem: {
              type: Type.OBJECT,
              properties: {
                char: { type: Type.STRING },
                pinyin: { type: Type.STRING },
                element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
              },
            },
            branch: {
              type: Type.OBJECT,
              properties: {
                char: { type: Type.STRING },
                pinyin: { type: Type.STRING },
                element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                animal: { type: Type.STRING },
              },
            },
          },
        },
        month: {
            type: Type.OBJECT,
            properties: {
              stem: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                },
              },
              branch: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                  animal: { type: Type.STRING },
                },
              },
            },
          },
          day: {
            type: Type.OBJECT,
            properties: {
              stem: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                },
              },
              branch: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                  animal: { type: Type.STRING },
                },
              },
            },
          },
          hour: {
            type: Type.OBJECT,
            properties: {
              stem: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                },
              },
              branch: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  element: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
                  animal: { type: Type.STRING },
                },
              },
            },
          },
      },
    },
    elements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, enum: ["Wood", "Fire", "Earth", "Metal", "Water"] },
          value: { type: Type.NUMBER, description: "Percentage value out of 100" },
          color: { type: Type.STRING, description: "Hex code for the element color" },
        },
      },
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        mainElement: { type: Type.STRING, description: "The Day Master element" },
        personality: { type: Type.STRING },
        career: { type: Type.STRING },
        relationships: { type: Type.STRING },
        wealth: { type: Type.STRING },
        health: { type: Type.STRING },
        health_disclaimer: { type: Type.STRING, description: "Standard medical disclaimer"},
        luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
        luckyNumbers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
      },
    },
  },
};

export const generateBaziReading = async (input: UserInput): Promise<BaziReading> => {
  const prompt = `
    Act as a Grand Master of Chinese Metaphysics and Bazi (Four Pillars of Destiny).
    
    User Details:
    Name: ${input.name}
    Gender: ${input.gender}
    Date of Birth: ${input.birthDate}
    Time of Birth: ${input.birthTime || "Unknown"}

    Task:
    1. Accurately calculate the Four Pillars (Year, Month, Day, Hour) based on the provided Gregorian date and time. Convert this to the Lunar/Gan-Zhi system.
    2. Calculate the strength distribution of the Five Elements (Wood, Fire, Earth, Metal, Water) as a percentage.
    3. Provide a profound, yet accessible reading analyzing their Day Master (Self Element), personality, career potential, love life, wealth, and health.
    4. Provide lucky colors and numbers.
    5. The 'health_disclaimer' must state that this is for entertainment only and not medical advice.

    Format: JSON strictly matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: baziSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as BaziReading;
  } catch (error) {
    console.error("Gemini Bazi Error:", error);
    throw error;
  }
};

const expertSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    answers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Detailed answers for the 3 questions."
    }
  }
};

export const askBaziExpert = async (reading: BaziReading, questions: string[]): Promise<string[]> => {
  const prompt = `
    Context: You are a world-renowned Bazi Consultant (Chinese Metaphysics Master) providing a premium consultation.
    
    I have already analyzed this user's chart. Here is their data:
    
    Chart:
    ${JSON.stringify(reading.chart, null, 2)}
    
    Element Balance:
    ${JSON.stringify(reading.elements, null, 2)}
    
    Day Master: ${reading.analysis.mainElement}

    The user has paid for a VIP consultation to ask 3 specific, deep questions about their life using this chart.
    
    User Questions:
    1. ${questions[0]}
    2. ${questions[1]}
    3. ${questions[2]}

    Task:
    Provide detailed, empathetic, and metaphysically grounded answers for each question based on their chart interactions (Clashes, Combinations, Day Master strength, Ten Gods). 
    Your tone should be wise, encouraging, but honest.
    
    Format: JSON with a single property 'answers' which is an array of 3 strings corresponding to the 3 questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: expertSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return result.answers || ["I could not interpret that.", "I could not interpret that.", "I could not interpret that."];
  } catch (error) {
    console.error("Gemini Expert Error:", error);
    throw error;
  }
};

const dailyLuckSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    daily: { type: Type.STRING, description: "Forecast for today" },
    monthly: { type: Type.STRING, description: "Forecast for this month" },
    luckyTime: { type: Type.STRING, description: "Best time of day" },
    direction: { type: Type.STRING, description: "Lucky direction" }
  }
};

export const generateDailyLuck = async (reading: BaziReading): Promise<DailyLuckResult> => {
  const prompt = `
    You are a Bazi master. Based on the following user chart:
    Day Master: ${reading.analysis.mainElement}
    Chart: ${JSON.stringify(reading.chart)}

    Analyze the luck for TODAY (${new Date().toLocaleDateString()}).
    Provide a daily forecast, a monthly overview, a lucky time of day, and a lucky direction.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: dailyLuckSchema
    }
  });

  if (!response.text) throw new Error("No response");
  return JSON.parse(response.text) as DailyLuckResult;
};

const compatibilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Score from 0 to 100" },
    verdict: { type: Type.STRING, description: "Short summary like 'Perfect Match' or 'Challenging'" },
    analysis: { type: Type.STRING, description: "Detailed analysis of the relationship" },
    remedy: { type: Type.STRING, description: "Feng Shui or Bazi cure if score is low, otherwise insightful advice" }
  }
};

export const generateCompatibility = async (userReading: BaziReading, partnerInput: UserInput, relationType: string): Promise<CompatibilityResult> => {
  const prompt = `
    Analyze the compatibility between two people for a "${relationType}" relationship.
    
    Person A (User):
    Chart: ${JSON.stringify(userReading.chart)}
    Day Master: ${userReading.analysis.mainElement}
    
    Person B (Partner):
    Name: ${partnerInput.name}
    DOB: ${partnerInput.birthDate}
    Gender: ${partnerInput.gender}

    Calculate Person B's Day Master and pillars internally. 
    Compare interactions (Heavenly Stem combinations, Earthly Branch clashes/harm/punishments).
    
    If the compatibility is challenging (Score < 70), provide a specific metaphysical "Cure" or remedy.
    If good, provide advice to maintain it.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: compatibilitySchema
    }
  });

  if (!response.text) throw new Error("No response");
  return JSON.parse(response.text) as CompatibilityResult;
};

const liuyaoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hexagramName: { type: Type.STRING },
    interpretation: { type: Type.STRING },
    outcome: { type: Type.STRING }
  }
};

export const interpretLiuyao = async (question: string, tosses: number[]): Promise<LiuyaoResult> => {
  // Tosses are array of numbers 6, 7, 8, 9.
  // 6 = Old Yin (X), 7 = Young Yang (—), 8 = Young Yin (--), 9 = Old Yang (O)
  const prompt = `
    Perform a King Wen Oracle (Liuyao) divination.
    Question: "${question}"
    
    The 6 lines obtained (from bottom to top) are: ${tosses.join(', ')}.
    Key: 6=Old Yin (changing), 7=Young Yang (stable), 8=Young Yin (stable), 9=Old Yang (changing).
    
    Identify the Hexagram. Interpret the Moving Lines if any. Predict the outcome.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: liuyaoSchema
    }
  });

  if (!response.text) throw new Error("No response");
  return JSON.parse(response.text) as LiuyaoResult;
};