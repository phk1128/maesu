// 편입 수학 - 데이터 (v2) — TypeScript 변환
import type {
  FormulaCategory,
  Formula,
  School,
  Problem,
  AnalysisResult,
  ContribWeek,
} from '../types';

// ─────────────────────────────────────
// 공식 카테고리 + 서브파트 + 공식
// ─────────────────────────────────────
export const FORMULA_TREE: FormulaCategory[] = [
  {
    id: 'calculus',
    name: '미적분',
    color: '#D97757',
    desc: '극한·미분·적분의 핵심',
    subparts: [
      { id: 'limit', name: '극한과 연속', count: 14 },
      { id: 'diff', name: '미분법', count: 22 },
      { id: 'integral', name: '적분법', count: 28 },
      { id: 'series', name: '급수와 수렴', count: 12 },
    ],
  },
  {
    id: 'linalg',
    name: '선형대수',
    color: '#A8543A',
    desc: '행렬·벡터공간·고유값',
    subparts: [
      { id: 'matrix', name: '행렬과 행렬식', count: 18 },
      { id: 'vectorspace', name: '벡터공간', count: 14 },
      { id: 'eigen', name: '고유값과 고유벡터', count: 11 },
      { id: 'lineartf', name: '선형변환', count: 9 },
    ],
  },
  {
    id: 'multivar',
    name: '다변수미적분',
    color: '#8A6F1B',
    desc: '편미분·중적분·벡터해석',
    subparts: [
      { id: 'partial', name: '편미분과 그래디언트', count: 13 },
      { id: 'multiint', name: '중적분', count: 16 },
      { id: 'vectorcal', name: '벡터장과 선적분', count: 12 },
      { id: 'theorems', name: '그린·발산·스토크스 정리', count: 8 },
    ],
  },
  {
    id: 'engmath',
    name: '공업수학',
    color: '#3F6F95',
    desc: '미분방정식·변환·복소해석',
    subparts: [
      { id: 'ode', name: '상미분방정식', count: 19 },
      { id: 'laplace', name: '라플라스 변환', count: 14 },
      { id: 'fourier', name: '푸리에 급수', count: 11 },
      { id: 'complex', name: '복소해석', count: 13 },
    ],
  },
];

// 카테고리·서브파트별 공식 (전체 데이터)
export const FORMULAS: Formula[] = [
  // ── 미적분 / 극한과 연속
  {
    id: 'lim-def', cat: 'calculus', sub: 'limit',
    title: '극한의 ε-δ 정의', importance: 2,
    latex: '\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0, \\exists \\delta > 0',
    short: '극한의 엄밀한 정의. 모든 ε에 대해 δ가 존재.',
  },
  {
    id: 'lim-trig', cat: 'calculus', sub: 'limit',
    title: '삼각함수 극한', importance: 3,
    latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    short: '편입 단골 출제. sinx/x → 1.',
  },
  {
    id: 'lhopital', cat: 'calculus', sub: 'limit',
    title: '로피탈 정리', importance: 3,
    latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
    short: '0/0 또는 ∞/∞ 꼴에서 사용.',
  },

  // ── 미적분 / 미분법
  {
    id: 'product-rule', cat: 'calculus', sub: 'diff',
    title: '곱의 미분법', importance: 3,
    latex: "(fg)' = f'g + fg'",
    short: '두 함수의 곱을 미분.',
  },
  {
    id: 'quotient-rule', cat: 'calculus', sub: 'diff',
    title: '몫의 미분법', importance: 3,
    latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
    short: '분수 형태 함수의 미분.',
  },
  {
    id: 'chain-rule', cat: 'calculus', sub: 'diff',
    title: '연쇄법칙', importance: 3,
    latex: "(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)",
    short: '합성함수의 미분. 겉×속.',
  },
  {
    id: 'implicit-diff', cat: 'calculus', sub: 'diff',
    title: '음함수 미분', importance: 2,
    latex: "\\frac{d}{dx}F(x,y)=F_x + F_y \\frac{dy}{dx}",
    short: 'y를 x의 함수로 보고 양변 미분.',
  },

  // ── 미적분 / 적분법
  {
    id: 'integration-by-parts', cat: 'calculus', sub: 'integral',
    title: '부분적분', importance: 3,
    latex: '\\int u \\, dv = uv - \\int v \\, du',
    short: '두 함수의 곱을 적분. LIATE 순서.',
  },
  {
    id: 'integration-substitution', cat: 'calculus', sub: 'integral',
    title: '치환적분', importance: 3,
    latex: '\\int f(g(x)) g\'(x) dx = \\int f(u) du',
    short: '합성함수 형태의 적분 단순화.',
  },
  {
    id: 'partial-frac', cat: 'calculus', sub: 'integral',
    title: '부분분수 분해', importance: 2,
    latex: '\\frac{1}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}',
    short: '유리함수의 적분에 필수.',
  },
  {
    id: 'fundamental-theorem', cat: 'calculus', sub: 'integral',
    title: '미적분의 기본정리', importance: 3,
    latex: '\\int_a^b f(x) dx = F(b) - F(a)',
    short: '정적분의 핵심 정리.',
  },

  // ── 미적분 / 급수
  {
    id: 'taylor-series', cat: 'calculus', sub: 'series',
    title: '테일러 급수', importance: 2,
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    short: '함수를 다항식 무한급수로.',
  },
  {
    id: 'ratio-test', cat: 'calculus', sub: 'series',
    title: '비판정법', importance: 3,
    latex: 'L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|',
    short: '급수의 수렴 판정.',
  },

  // ── 선형대수 / 행렬과 행렬식
  {
    id: 'det-2x2', cat: 'linalg', sub: 'matrix',
    title: '2×2 행렬식', importance: 3,
    latex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
    short: '대각선 곱의 차.',
  },
  {
    id: 'det-3x3', cat: 'linalg', sub: 'matrix',
    title: '3×3 행렬식 (사루스)', importance: 3,
    latex: '\\det A = a_{11}M_{11} - a_{12}M_{12} + a_{13}M_{13}',
    short: '여인수 전개.',
  },
  {
    id: 'inv-2x2', cat: 'linalg', sub: 'matrix',
    title: '2×2 역행렬', importance: 3,
    latex: 'A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    short: 'a와 d 교환, b·c 부호 반전.',
  },
  {
    id: 'gauss-elim', cat: 'linalg', sub: 'matrix',
    title: '가우스 소거법', importance: 3,
    latex: '[A|b] \\to [R|c]',
    short: '연립방정식 풀이의 기본.',
  },

  // ── 선형대수 / 벡터공간
  {
    id: 'rank-nullity', cat: 'linalg', sub: 'vectorspace',
    title: '계수-퇴화 정리', importance: 3,
    latex: '\\text{rank}(A) + \\text{nullity}(A) = n',
    short: '계수와 영공간 차원의 합.',
  },
  {
    id: 'gram-schmidt', cat: 'linalg', sub: 'vectorspace',
    title: '그람-슈미트 직교화', importance: 2,
    latex: 'u_k = v_k - \\sum_{j<k} \\frac{\\langle v_k, u_j\\rangle}{\\langle u_j, u_j\\rangle} u_j',
    short: '기저를 직교기저로 변환.',
  },

  // ── 선형대수 / 고유값
  {
    id: 'eigen-eq', cat: 'linalg', sub: 'eigen',
    title: '고유방정식', importance: 3,
    latex: '\\det(A - \\lambda I) = 0',
    short: '고유값을 구하는 특성방정식.',
  },
  {
    id: 'diagonalization', cat: 'linalg', sub: 'eigen',
    title: '대각화', importance: 3,
    latex: 'A = PDP^{-1}',
    short: '고유벡터를 열로 하는 P, 고유값 대각.',
  },

  // ── 선형대수 / 선형변환
  {
    id: 'lt-matrix', cat: 'linalg', sub: 'lineartf',
    title: '선형변환의 행렬 표현', importance: 2,
    latex: '[T]_B = [T(b_1) | T(b_2) | \\cdots]',
    short: '기저의 상을 열로 모음.',
  },

  // ── 다변수 / 편미분
  {
    id: 'gradient', cat: 'multivar', sub: 'partial',
    title: '그래디언트', importance: 2,
    latex: '\\nabla f = \\left(f_x, f_y, f_z\\right)',
    short: '편미분의 벡터. 최대 증가 방향.',
  },
  {
    id: 'directional-deriv', cat: 'multivar', sub: 'partial',
    title: '방향미분', importance: 2,
    latex: 'D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}',
    short: '특정 방향으로의 변화율.',
  },
  {
    id: 'jacobian', cat: 'multivar', sub: 'partial',
    title: '야코비안', importance: 2,
    latex: 'J = \\det \\frac{\\partial(u,v)}{\\partial(x,y)}',
    short: '변수 변환 시 부피 비율.',
  },

  // ── 다변수 / 중적분
  {
    id: 'polar-int', cat: 'multivar', sub: 'multiint',
    title: '극좌표 중적분', importance: 3,
    latex: '\\iint f \\, dA = \\iint f(r,\\theta) \\, r \\, dr \\, d\\theta',
    short: 'r dr dθ 형태.',
  },
  {
    id: 'spherical-int', cat: 'multivar', sub: 'multiint',
    title: '구면좌표 중적분', importance: 2,
    latex: 'dV = \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta',
    short: 'ρ² sinφ 자코비안.',
  },

  // ── 다변수 / 벡터장
  {
    id: 'line-int', cat: 'multivar', sub: 'vectorcal',
    title: '선적분', importance: 2,
    latex: '\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}\'(t) dt',
    short: '벡터장의 곡선 따라 적분.',
  },

  // ── 다변수 / 정리
  {
    id: 'greens', cat: 'multivar', sub: 'theorems',
    title: '그린 정리', importance: 2,
    latex: '\\oint_C P dx + Q dy = \\iint_D (Q_x - P_y) dA',
    short: '평면 선적분 = 영역 중적분.',
  },
  {
    id: 'divergence', cat: 'multivar', sub: 'theorems',
    title: '발산 정리', importance: 2,
    latex: '\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_V \\nabla \\cdot \\mathbf{F} \\, dV',
    short: '폐곡면 플럭스 = 부피 적분.',
  },

  // ── 공업수학 / ODE
  {
    id: 'ode-1st-linear', cat: 'engmath', sub: 'ode',
    title: '1계 선형 ODE', importance: 3,
    latex: "y' + P(x)y = Q(x)",
    short: '적분인자 e^∫P dx 사용.',
  },
  {
    id: 'ode-2nd-const', cat: 'engmath', sub: 'ode',
    title: '2계 상수계수 ODE', importance: 3,
    latex: "y'' + py' + qy = 0",
    short: '특성방정식의 근으로 일반해.',
  },
  {
    id: 'undetermined-coef', cat: 'engmath', sub: 'ode',
    title: '미정계수법', importance: 3,
    latex: 'y_p = A e^{\\alpha t}, \\, A\\cos\\beta t + B\\sin\\beta t',
    short: '비동차 ODE의 특수해.',
  },

  // ── 공업수학 / 라플라스
  {
    id: 'laplace-def', cat: 'engmath', sub: 'laplace',
    title: '라플라스 변환 정의', importance: 3,
    latex: '\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty f(t) e^{-st} dt',
    short: '시간 → s-영역.',
  },
  {
    id: 'laplace-deriv', cat: 'engmath', sub: 'laplace',
    title: '도함수의 라플라스 변환', importance: 3,
    latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
    short: 'ODE를 대수방정식으로.',
  },
  {
    id: 'laplace-shift', cat: 'engmath', sub: 'laplace',
    title: '이동 정리 (s-shifting)', importance: 2,
    latex: '\\mathcal{L}\\{e^{at}f(t)\\} = F(s-a)',
    short: 's를 a만큼 이동.',
  },

  // ── 공업수학 / 푸리에
  {
    id: 'fourier-series', cat: 'engmath', sub: 'fourier',
    title: '푸리에 급수', importance: 2,
    latex: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty (a_n \\cos nx + b_n \\sin nx)',
    short: '주기함수의 삼각함수 분해.',
  },

  // ── 공업수학 / 복소
  {
    id: 'euler-formula', cat: 'engmath', sub: 'complex',
    title: '오일러 공식', importance: 3,
    latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
    short: '복소지수와 삼각함수의 연결.',
  },
  {
    id: 'residue', cat: 'engmath', sub: 'complex',
    title: '유수 정리', importance: 2,
    latex: '\\oint_C f(z) dz = 2\\pi i \\sum \\text{Res}(f, z_k)',
    short: '복소적분의 핵심.',
  },
];

// 카테고리/서브파트별 공식 조회
export function getFormulasBy(catId: string, subId?: string): Formula[] {
  return FORMULAS.filter(f => f.cat === catId && (!subId || f.sub === subId));
}

// 공식 ID로 조회
export function getFormula(id: string): Formula | undefined {
  return FORMULAS.find(f => f.id === id);
}

// ─────────────────────────────────────
// 기출 (학교 → 연도 → 문제)
// ─────────────────────────────────────
export const SCHOOLS: School[] = [
  {
    id: 'hanyang', name: '한양대', tag: '난이도 ★★★',
    years: [2024, 2023, 2022, 2021, 2020],
    color: '#2A4365', examDate: '2027-01-09T09:00:00+09:00',
  },
  {
    id: 'chungang', name: '중앙대', tag: '난이도 ★★★',
    years: [2024, 2023, 2022, 2021],
    color: '#742A2A', examDate: '2026-12-20T10:00:00+09:00',
  },
  {
    id: 'kyunghee', name: '경희대', tag: '난이도 ★★',
    years: [2024, 2023, 2022, 2021],
    color: '#22543D', examDate: '2027-01-11T09:30:00+09:00',
  },
  {
    id: 'konkuk', name: '건국대', tag: '난이도 ★★',
    years: [2024, 2023, 2022],
    color: '#553C9A', examDate: '2026-12-27T10:00:00+09:00',
  },
  {
    id: 'hongik', name: '홍익대', tag: '난이도 ★★',
    years: [2024, 2023, 2022],
    color: '#7B341E', examDate: '2027-01-04T09:00:00+09:00',
  },
  {
    id: 'ewha', name: '이화여대', tag: '난이도 ★★',
    years: [2024, 2023],
    color: '#6B2C2C', examDate: '2027-01-17T10:00:00+09:00',
  },
];

// 문제 데이터 (학교+연도 기준)
export const PROBLEMS: Problem[] = [
  // 한양대 2024
  { id: 'h24-1', school: 'hanyang', year: 2024, num: 1, topic: '미적분', latex: '\\int_0^\\pi x \\sin(x) \\, dx', difficulty: 3, type: '주관식' },
  { id: 'h24-2', school: 'hanyang', year: 2024, num: 2, topic: '미적분', latex: "y'' + 4y' + 3y = e^{-t}", difficulty: 3, type: '주관식' },
  { id: 'h24-3', school: 'hanyang', year: 2024, num: 3, topic: '선형대수', latex: '\\det \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}', difficulty: 2, type: '주관식' },
  { id: 'h24-4', school: 'hanyang', year: 2024, num: 4, topic: '다변수', latex: '\\iint_D xy \\, dA, \\ D: x^2 + y^2 \\le 4', difficulty: 3, type: '주관식' },
  { id: 'h24-5', school: 'hanyang', year: 2024, num: 5, topic: '급수', latex: '\\sum_{n=1}^\\infty \\frac{n^2}{2^n}', difficulty: 3, type: '주관식' },

  // 한양대 2023
  { id: 'h23-1', school: 'hanyang', year: 2023, num: 1, topic: '미적분', latex: "\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}", difficulty: 2, type: '주관식' },
  { id: 'h23-2', school: 'hanyang', year: 2023, num: 2, topic: '미적분', latex: "\\int_0^1 \\frac{1}{1+x^2} dx", difficulty: 2, type: '주관식' },
  { id: 'h23-3', school: 'hanyang', year: 2023, num: 3, topic: '공업수학', latex: '\\mathcal{L}^{-1}\\left\\{\\frac{s+2}{s^2+4s+5}\\right\\}', difficulty: 3, type: '주관식' },

  // 한양대 2022
  { id: 'h22-1', school: 'hanyang', year: 2022, num: 1, topic: '선형대수', latex: '\\text{eigenvalue of } \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}', difficulty: 2, type: '주관식' },
  { id: 'h22-2', school: 'hanyang', year: 2022, num: 2, topic: '다변수', latex: '\\nabla f, \\ f(x,y) = x^2 + xy + y^2', difficulty: 1, type: '주관식' },

  // 중앙대 2024
  { id: 'c24-1', school: 'chungang', year: 2024, num: 1, topic: '미적분', latex: "\\int x^2 e^x dx", difficulty: 2, type: '주관식' },
  { id: 'c24-2', school: 'chungang', year: 2024, num: 2, topic: '선형대수', latex: 'A^{-1}, \\ A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 0 & 1 & 2 \\end{pmatrix}', difficulty: 3, type: '주관식' },
  { id: 'c24-3', school: 'chungang', year: 2024, num: 3, topic: '공업수학', latex: "y' + 2y = \\sin t", difficulty: 2, type: '주관식' },

  // 중앙대 2023
  { id: 'c23-1', school: 'chungang', year: 2023, num: 1, topic: '미적분', latex: '\\sum_{n=0}^\\infty \\frac{x^n}{n!}', difficulty: 2, type: '주관식' },
  { id: 'c23-2', school: 'chungang', year: 2023, num: 2, topic: '다변수', latex: '\\oint_C y dx - x dy, \\ C: x^2 + y^2 = 1', difficulty: 3, type: '주관식' },

  // 경희대 2024
  { id: 'k24-1', school: 'kyunghee', year: 2024, num: 1, topic: '미적분', latex: "\\int_0^\\infty e^{-x^2} dx", difficulty: 3, type: '주관식' },
  { id: 'k24-2', school: 'kyunghee', year: 2024, num: 2, topic: '선형대수', latex: 'AB - BA, \\ A,B \\in M_2(\\mathbb{R})', difficulty: 2, type: '주관식' },

  // 경희대 2023
  { id: 'k23-1', school: 'kyunghee', year: 2023, num: 1, topic: '미적분', latex: "\\frac{d}{dx}\\int_0^{x^2} \\sin(t^2) dt", difficulty: 2, type: '주관식' },

  // 건국대 2024
  { id: 'g24-1', school: 'konkuk', year: 2024, num: 1, topic: '미적분', latex: '\\int \\frac{1}{x^2 - 1} dx', difficulty: 1, type: '주관식' },
  { id: 'g24-2', school: 'konkuk', year: 2024, num: 2, topic: '선형대수', latex: '\\text{rank of } \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\\\ 3 & 6 \\end{pmatrix}', difficulty: 1, type: '주관식' },

  // 홍익대 2024
  { id: 'o24-1', school: 'hongik', year: 2024, num: 1, topic: '다변수', latex: 'f_{xy} - f_{yx}, \\ f = e^{xy}', difficulty: 2, type: '주관식' },

  // 이화여대 2024
  { id: 'e24-1', school: 'ewha', year: 2024, num: 1, topic: '미적분', latex: "\\int_0^{\\pi/2} \\sin^4 x \\, dx", difficulty: 2, type: '주관식' },
];

export function getProblems(school: string, year: number): Problem[] {
  return PROBLEMS.filter(p => p.school === school && p.year === year);
}

// ─────────────────────────────────────
// 분석 결과 더미
// ─────────────────────────────────────
export const ANALYSIS_RESULT: AnalysisResult = {
  problem: '\\int_0^\\pi x \\sin(x) \\, dx',
  problemMeta: '한양대 2024',
  topic: '미적분 · 부분적분',
  formulas: [
    {
      id: 'integration-by-parts', rank: 1, level: 'essential',
      reason: '(다항식) × (삼각함수) 형태로, 부분적분이 정확히 이런 패턴을 위한 공식이에요.',
      step: 'u = x, dv = sin(x) dx 로 두면 한 번에 풀려요.',
    },
    {
      id: 'product-rule', rank: 2, level: 'useful',
      reason: '부분적분 공식이 곱의 미분에서 유도되어요. 원리 이해에 도움.',
      step: '직접 사용은 안 하지만 공식의 기반.',
    },
    {
      id: 'fundamental-theorem', rank: 3, level: 'useful',
      reason: '정적분이므로 부정적분 구한 뒤 양 끝값 대입이 필요해요.',
      step: 'F(π) - F(0) 으로 마무리.',
    },
  ],
  solution: [
    { label: 'u, dv 설정', math: 'u = x, \\quad dv = \\sin(x) \\, dx' },
    { label: '미분/적분', math: 'du = dx, \\quad v = -\\cos(x)' },
    { label: '부분적분 적용', math: '= \\Big[-x\\cos(x)\\Big]_0^\\pi + \\int_0^\\pi \\cos(x) dx' },
    { label: '계산', math: '= \\pi + \\Big[\\sin(x)\\Big]_0^\\pi = \\pi' },
  ],
};

// ─────────────────────────────────────
// 잔디 컨트리뷰션 데이터 (지난 ~18주)
// ─────────────────────────────────────
function generateContribGrid(): ContribWeek[] {
  const weeks = 18;
  const days = 7;
  const grid: ContribWeek[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dow = today.getDay();
  const sundayEnd = new Date(today);
  sundayEnd.setDate(today.getDate() + (6 - dow));

  for (let w = 0; w < weeks; w++) {
    const week: ContribWeek = [];
    for (let d = 0; d < days; d++) {
      const date = new Date(sundayEnd);
      date.setDate(sundayEnd.getDate() - ((weeks - 1 - w) * 7 + (6 - d)));
      const future = date > today;

      let level = 0;
      if (!future) {
        const distance = Math.floor((today.getTime() - date.getTime()) / 86400000);
        const recencyFactor = Math.max(0.15, 1 - distance / 110);
        const r = Math.random();
        if (r < recencyFactor * 0.85) {
          if (r < recencyFactor * 0.2) level = 4;
          else if (r < recencyFactor * 0.4) level = 3;
          else if (r < recencyFactor * 0.6) level = 2;
          else level = 1;
        }
        if (distance === 0) level = Math.max(level, 3);
      }
      week.push({ date, level, future });
    }
    grid.push(week);
  }
  return grid;
}

export const CONTRIB_GRID = generateContribGrid();
export const TOTAL_STUDIED = CONTRIB_GRID.flat().reduce((s, c) => s + c.level * 1.2, 0) | 0;
export const CURRENT_STREAK = (() => {
  const flat = CONTRIB_GRID.flat().filter(c => !c.future);
  let streak = 0;
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].level > 0) streak++;
    else break;
  }
  return streak;
})();
