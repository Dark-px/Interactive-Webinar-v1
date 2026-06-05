export type SlideType =
  | "cover"
  | "intro"
  | "process-diagram"
  | "development-concept"
  | "npd-need"
  | "idea-spotting"
  | "idea-sources"
  | "brainstorm"
  | "brainstorm-prohibitions"
  | "five-whys-concept"
  | "five-whys-example"
  | "screening"
  | "feasibility"
  | "market-feasibility"
  | "technical-feasibility"
  | "financial-feasibility"
  | "pilot"
  | "patent"
  | "commercialization-paths"
  | "conclusion"
  | "end";

export interface Slide {
  id: number;
  type: SlideType;
  category: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  notes?: string;
  interactiveData?: any;
}
