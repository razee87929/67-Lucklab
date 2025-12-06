export enum ElementType {
  Wood = 'Wood',
  Fire = 'Fire',
  Earth = 'Earth',
  Metal = 'Metal',
  Water = 'Water',
}

export interface PillarData {
  stem: {
    char: string;
    pinyin: string;
    element: ElementType;
  };
  branch: {
    char: string;
    pinyin: string;
    element: ElementType;
    animal: string;
  };
}

export interface BaziChartData {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  hour: PillarData;
}

export interface ElementPercentage {
  name: string;
  value: number;
  color: string;
}

export interface BaziReading {
  chart: BaziChartData;
  elements: ElementPercentage[];
  analysis: {
    mainElement: string;
    personality: string;
    career: string;
    relationships: string;
    wealth: string;
    health_disclaimer: string;
    health: string;
    luckyColors: string[];
    luckyNumbers: number[];
  };
}

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
}

export type SubscriptionTier = 'free' | 'basic' | 'pro';

export interface CompatibilityResult {
  score: number;
  verdict: string;
  analysis: string;
  remedy?: string; // The "cure" if score is low
}

export interface DailyLuckResult {
  daily: string;
  monthly: string;
  luckyTime: string;
  direction: string;
}

export interface LiuyaoResult {
  hexagramName: string;
  interpretation: string;
  outcome: string;
}