import { useState, useCallback } from 'react';
import type { User, HistoryEntry, RouteState } from './types';
import { SCHOOLS } from './data/mock';
import BottomTab from './components/BottomTab';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ExamSchedulePage from './pages/ExamSchedulePage';
import FormulasPage from './pages/FormulasPage';
import FormulaCategoryPage from './pages/FormulaCategoryPage';
import FormulaDetailPage from './pages/FormulaDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamSchoolPage from './pages/ExamSchoolPage';
import ExamYearPage from './pages/ExamYearPage';
import ExamDetailPage from './pages/ExamDetailPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import PaywallPage from './pages/PaywallPage';
import AnalyzePage from './pages/AnalyzePage';
import VariationsPage from './pages/VariationsPage';

export default function App() {
  const [stack, setStack] = useState<RouteState[]>([{ route: 'home', params: {} }]);
  const cur = stack[stack.length - 1];

  const tabRoutes = ['home', 'formulas', 'exams', 'mypage'];
  const go = useCallback((route: string | number, params: Record<string, unknown> = {}) => {
    if (route === -1) {
      if (stack.length > 1) setStack(s => s.slice(0, -1));
      return;
    }
    if (typeof route === 'string') {
      if (tabRoutes.includes(route)) {
        setStack([{ route, params }]);
        return;
      }
      setStack(s => [...s, { route, params }]);
    }
  }, [stack.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [primarySchool, setPrimarySchoolState] = useState<string | null>('hanyang');

  const hideAI = true;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const setPrimarySchool = useCallback((id: string) => {
    setPrimarySchoolState(id);
    const s = SCHOOLS.find(x => x.id === id);
    showToast(`${s?.name}를 목표 학교로 설정했어요`);
  }, [showToast]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) { showToast('즐겨찾기에서 제거됐어요'); return prev.filter(x => x !== id); }
      showToast('저장됐어요'); return [...prev, id];
    });
  }, [showToast]);

  const markStudied = useCallback((type: string, id: string | number) => {
    setHistory(prev => [{ type: type as HistoryEntry['type'], id, ts: Date.now() }, ...prev].slice(0, 50));
  }, []);

  const signIn = useCallback(() => {
    setUser({ name: '편입생', initial: '편', joinedAt: Date.now() - 86400000 * 22 });
    setFavorites(['integration-by-parts', 'det-2x2']);
    go('home');
    setTimeout(() => showToast('환영합니다!'), 200);
  }, [go, showToast]);

  const signOut = useCallback(() => {
    setUser(null); setFavorites([]); setHistory([]); go('home'); showToast('로그아웃 됐어요');
  }, [go, showToast]);

  const unlockPro = useCallback(() => {
    setIsPro(true);
    showToast('Pro 구독 시작!');
  }, [showToast]);

  const activeTab = tabRoutes.includes(cur.route)
    ? cur.route
    : (cur.route === 'formula-category' || cur.route === 'formula-detail') ? 'formulas'
    : (cur.route === 'exam-school' || cur.route === 'exam-year' || cur.route === 'exam-detail') ? 'exams'
    : null;

  const fullScreenRoutes = ['login', 'paywall'];
  const isFullScreen = fullScreenRoutes.includes(cur.route);

  const renderPage = () => {
    switch (cur.route) {
      case 'home':
        return <HomePage go={go} user={user} signIn={signIn} primarySchool={primarySchool} setPrimarySchool={setPrimarySchool} hideAI={hideAI} />;
      case 'formulas':
        return <FormulasPage go={go} />;
      case 'formula-category':
        return <FormulaCategoryPage go={go} params={cur.params} favorites={favorites} toggleFavorite={toggleFavorite} />;
      case 'formula-detail':
        return <FormulaDetailPage go={go} params={cur.params} favorites={favorites} toggleFavorite={toggleFavorite} markStudied={user ? markStudied : null} hideAI={hideAI} />;
      case 'exams':
        return <ExamsPage go={go} />;
      case 'exam-schedule':
        return <ExamSchedulePage go={go} primarySchool={primarySchool} setPrimarySchool={setPrimarySchool} />;
      case 'exam-school':
        return <ExamSchoolPage go={go} params={cur.params} />;
      case 'exam-year':
        return <ExamYearPage go={go} params={cur.params} />;
      case 'exam-detail':
        return <ExamDetailPage go={go} params={cur.params} markStudied={user ? markStudied : null} hideAI={hideAI} />;
      case 'login':
        return <LoginPage go={go} signIn={signIn} />;
      case 'mypage':
        return <MyPage go={go} user={user} isPro={isPro} favorites={favorites} history={history} signOut={signOut} hideAI={hideAI} />;
      case 'paywall':
        return <PaywallPage go={go} unlockPro={unlockPro} />;
      case 'analyze':
        return <AnalyzePage go={go} isPro={isPro} unlockPro={unlockPro} params={cur.params} markStudied={user ? markStudied : null} />;
      case 'variations':
        return <VariationsPage go={go} isPro={isPro} unlockPro={unlockPro} markStudied={user ? markStudied : null} />;
      default:
        return <HomePage go={go} user={user} signIn={signIn} primarySchool={primarySchool} setPrimarySchool={setPrimarySchool} hideAI={hideAI} />;
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <div
        key={stack.map(s => s.route + JSON.stringify(s.params)).join('>')}
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
          background: 'var(--bg)', animation: 'fadeIn 240ms ease',
        }}
      >
        {renderPage()}
      </div>

      {!isFullScreen && <BottomTab active={activeTab} onChange={(t) => go(t)} />}
      <Toast message={toast || ''} show={!!toast} />
    </div>
  );
}
