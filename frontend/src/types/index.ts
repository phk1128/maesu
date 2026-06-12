// 편입수학 - 전체 타입 정의

export interface Subpart {
  id: string;
  name: string;
  count: number;
}

export interface FormulaCategory {
  id: string;
  name: string;
  color: string;
  desc: string;
  subparts: Subpart[];
}

export interface Formula {
  id: string;
  cat: string;
  sub: string;
  title: string;
  importance: 1 | 2 | 3;
  latex: string;
  short: string;
  category?: string; // alias used by FormulaCard
}

export interface School {
  id: string;
  name: string;
  tag: string;
  years: number[];
  color: string;
  examDate: string;
}

export interface Problem {
  id: string;
  school: string;
  year: number;
  num: number;
  topic: string;
  latex: string;
  difficulty: 1 | 2 | 3;
  type: string;
}

export interface AnalysisFormula {
  id: string;
  rank: number;
  level: 'essential' | 'useful' | 'reference';
  reason: string;
  step: string;
}

export interface SolutionStep {
  label: string;
  math: string;
}

export interface AnalysisResult {
  problem: string;
  problemMeta: string;
  topic: string;
  formulas: AnalysisFormula[];
  solution: SolutionStep[];
}

export interface ContribDay {
  date: Date;
  level: number;
  future: boolean;
}

export type ContribWeek = ContribDay[];

export interface ExamDdayInfo {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  passed: boolean;
  dateStr: string;
  weekday: string;
  target: number;
}

export interface User {
  id: string;
  name: string;
  initial: string;
  joinedAt: number;
}

export interface HistoryEntry {
  type: 'formula' | 'problem' | 'analyze' | 'variation';
  id: string | number;
  ts: number;
}

export interface RouteState {
  route: string;
  params: Record<string, unknown>;
}

export type GoFn = (route: string | number, params?: Record<string, unknown>) => void;
