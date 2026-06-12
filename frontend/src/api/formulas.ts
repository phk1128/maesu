import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// 백엔드 API 클라이언트 — 하드코딩 데이터 없음

export interface CategoryDto {
  id: number;
  area: string;       // "미적분" 등
  name: string;
  sortOrder: number;
}

export interface FormulaDto {
  id: number;
  categoryId: number;
  title: string;
  contentMd: string;
  svg: string | null;
  sortOrder: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error');
  return json.data;
}

// 공식·카테고리 데이터는 정적이므로 세션 동안 캐시한다.
// Promise를 캐싱해 결과 캐시 + 동시 요청 dedup을 함께 처리한다.
let categoriesCache: Promise<CategoryDto[]> | null = null;
const categoryFormulasCache = new Map<number, Promise<FormulaDto[]>>();
const formulaCache = new Map<number, Promise<FormulaDto>>();

export function fetchCategories(): Promise<CategoryDto[]> {
  if (categoriesCache) return categoriesCache;
  categoriesCache = apiFetch<CategoryDto[]>('/categories').catch(err => {
    categoriesCache = null; // 실패는 캐시하지 않음
    throw err;
  });
  return categoriesCache;
}

export function fetchFormulasByCategory(categoryId: number): Promise<FormulaDto[]> {
  const cached = categoryFormulasCache.get(categoryId);
  if (cached) return cached;
  const p = apiFetch<FormulaDto[]>(`/categories/${categoryId}/formulas`)
    .then(formulas => {
      // 목록으로 받은 개별 공식도 미리 캐시 → 상세 진입 시 재요청 0번
      for (const f of formulas) {
        if (!formulaCache.has(f.id)) formulaCache.set(f.id, Promise.resolve(f));
      }
      return formulas;
    })
    .catch(err => {
      categoryFormulasCache.delete(categoryId);
      throw err;
    });
  categoryFormulasCache.set(categoryId, p);
  return p;
}

export function fetchFormula(formulaId: number): Promise<FormulaDto> {
  const cached = formulaCache.get(formulaId);
  if (cached) return cached;
  const p = apiFetch<FormulaDto>(`/formulas/${formulaId}`).catch(err => {
    formulaCache.delete(formulaId);
    throw err;
  });
  formulaCache.set(formulaId, p);
  return p;
}

// --- 인증 필요 API ---

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error');
  return json.data;
}

export interface MeDto {
  userId: string;
  nickname: string;
  avatarUrl: string | null;
  kakaoName: string | null;
  email: string | null;
}

export function fetchMe(): Promise<MeDto> {
  return authFetch<MeDto>('/me');
}

export function fetchFavorites(): Promise<number[]> {
  return authFetch<number[]>('/favorites');
}

export function toggleFavoriteApi(formulaId: number): Promise<{ added: boolean; formulaId: number }> {
  return authFetch('/favorites/' + formulaId, { method: 'POST' });
}

// --- 학습 기록 API ---

export function recordStudy(activityType: string, targetId: string): Promise<void> {
  return authFetch('/study-logs', {
    method: 'POST',
    body: JSON.stringify({ activityType, targetId }),
  });
}

export interface DailyCountDto {
  date: string;   // "2026-06-12"
  count: number;
}

export interface StudyGridResponse {
  dailyCounts: DailyCountDto[];
  totalStudied: number;
  streak: number;
}

export function fetchStudyGrid(weeks: number = 18): Promise<StudyGridResponse> {
  return authFetch<StudyGridResponse>(`/study-logs/grid?weeks=${weeks}`);
}

// --- 대학교/시험일정 API (공개) ---

export interface ExamScheduleDto {
  academicYear: number;
  examDate: string | null;
  mathType: string;
  note: string | null;
}

export interface UniversityExamDto {
  id: number;
  name: string;
  shortName: string;
  color: string;
  currentYear: ExamScheduleDto | null;
  previousYear: ExamScheduleDto | null;
}

let popularCache: Promise<FormulaDto[]> | null = null;

export function fetchPopularFormulas(): Promise<FormulaDto[]> {
  if (popularCache) return popularCache;
  popularCache = apiFetch<FormulaDto[]>('/formulas/popular?limit=3').catch(err => {
    popularCache = null;
    throw err;
  });
  return popularCache;
}

let universitiesCache: Promise<UniversityExamDto[]> | null = null;

export function fetchUniversities(): Promise<UniversityExamDto[]> {
  if (universitiesCache) return universitiesCache;
  universitiesCache = apiFetch<UniversityExamDto[]>('/universities?mathType=수학단독').catch(err => {
    universitiesCache = null;
    throw err;
  });
  return universitiesCache;
}
