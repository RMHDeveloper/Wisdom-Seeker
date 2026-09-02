
export enum Philosopher {
  RAJINIKANTH = 'Rajinikanth',
  ABDUL_KALAM = 'Abdul Kalam',
  THIRUVALLUVAR = 'Thiruvalluvar'
}

export interface PhilosophyResponse {
  advice: string;
  principles: string[];
  virtueFocus: string;
  historicalContext: string;
  kural?: string; // Specific for Thiruvalluvar
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  situation: string;
  response: string;
  philosopher: Philosopher;
}
