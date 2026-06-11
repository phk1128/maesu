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
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error');
  return json.data;
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  return apiFetch<CategoryDto[]>('/categories');
}

export async function fetchFormulasByCategory(categoryId: number): Promise<FormulaDto[]> {
  return apiFetch<FormulaDto[]>(`/categories/${categoryId}/formulas`);
}

export async function fetchFormula(formulaId: number): Promise<FormulaDto> {
  return apiFetch<FormulaDto>(`/formulas/${formulaId}`);
}
