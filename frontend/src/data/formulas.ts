// 영역(Area) 정적 메타데이터 — 색상, 설명 등 UI 전용
// 실제 카테고리/공식 데이터는 API에서 가져옴

export interface AreaMeta {
  id: string;
  name: string;
  color: string;
  desc: string;
}

export const AREAS: AreaMeta[] = [
  { id: 'calculus', name: '미적분', color: '#D97757', desc: '극한·미분·적분의 핵심' },
  { id: 'linalg', name: '선형대수', color: '#A8543A', desc: '행렬·벡터공간·고유값 (준비 중)' },
  { id: 'multivar', name: '다변수미적분', color: '#8A6F1B', desc: '편미분·중적분·벡터해석 (준비 중)' },
  { id: 'engmath', name: '공업수학', color: '#3F6F95', desc: '미분방정식·변환·복소해석 (준비 중)' },
];

// 영역 한글명 → AreaMeta 매핑 (API area 필드가 "미적분" 등으로 옴)
export function getAreaByName(areaName: string): AreaMeta | undefined {
  return AREAS.find(a => a.name === areaName);
}

export function getAreaById(areaId: string): AreaMeta | undefined {
  return AREAS.find(a => a.id === areaId);
}
