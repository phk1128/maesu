// 편입 수학 - 메인 앱 (v2): 라우팅 + 상태

function App() {
  // ── 라우팅
  const [stack, setStack] = React.useState([{ route: 'home', params: {} }]);
  const cur = stack[stack.length - 1];

  const tabRoutes = ['home', 'formulas', 'exams', 'mypage'];
  const go = (route, params = {}) => {
    if (route === -1) {
      if (stack.length > 1) setStack(s => s.slice(0, -1));
      return;
    }
    if (tabRoutes.includes(route)) {
      setStack([{ route, params }]);
      return;
    }
    setStack(s => [...s, { route, params }]);
  };

  // ── 상태
  const [user, setUser] = React.useState(null);
  const [isPro, setIsPro] = React.useState(false);
  const [favorites, setFavorites] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  const [primarySchool, setPrimarySchoolState] = React.useState('hanyang');

  const setPrimarySchool = (id) => {
    setPrimarySchoolState(id);
    const s = SCHOOLS.find(x => x.id === id);
    showToast(`${s?.name}를 목표 학교로 설정했어요`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) { showToast('즐겨찾기에서 제거됐어요'); return prev.filter(x => x !== id); }
      showToast('저장됐어요'); return [...prev, id];
    });
  };

  const markStudied = (type, id) => {
    setHistory(prev => [{ type, id, ts: Date.now() }, ...prev].slice(0, 50));
  };

  const signIn = () => {
    setUser({ name: '편입생', initial: '편', joinedAt: Date.now() - 86400000 * 22 });
    setFavorites(['integration-by-parts', 'det-2x2']);
    go('home');
    setTimeout(() => showToast('환영합니다!'), 200);
  };

  const signOut = () => { setUser(null); setIsPro(false); setFavorites([]); setHistory([]); go('home'); showToast('로그아웃 됐어요'); };

  const unlockPro = () => { setIsPro(true); showToast('Pro 구독이 시작됐어요!'); };

  // 활성 탭
  const activeTab = tabRoutes.includes(cur.route)
    ? cur.route
    : (cur.route === 'formula-category' || cur.route === 'formula-detail') ? 'formulas'
    : (cur.route === 'exam-school' || cur.route === 'exam-year' || cur.route === 'exam-detail') ? 'exams'
    : null;

  // 풀스크린 페이지 (탭 가림)
  const fullScreenRoutes = ['login', 'paywall', 'analyze', 'variations'];
  const isFullScreen = fullScreenRoutes.includes(cur.route);

  const renderPage = () => {
    switch (cur.route) {
      case 'home':              return <HomePage go={go} user={user} signIn={signIn} primarySchool={primarySchool} setPrimarySchool={setPrimarySchool} />;
      case 'formulas':          return <FormulasPage go={go} />;
      case 'formula-category':  return <FormulaCategoryPage go={go} params={cur.params} favorites={favorites} toggleFavorite={toggleFavorite} />;
      case 'formula-detail':    return <FormulaDetailPage go={go} params={cur.params} favorites={favorites} toggleFavorite={toggleFavorite} markStudied={user ? markStudied : null} />;
      case 'exams':             return <ExamsPage go={go} />;
      case 'exam-schedule':     return <ExamSchedulePage go={go} primarySchool={primarySchool} setPrimarySchool={setPrimarySchool} />;
      case 'exam-school':       return <ExamSchoolPage go={go} params={cur.params} />;
      case 'exam-year':         return <ExamYearPage go={go} params={cur.params} />;
      case 'exam-detail':       return <ExamDetailPage go={go} params={cur.params} markStudied={user ? markStudied : null} />;
      case 'analyze':           return <AnalyzePage go={go} user={user} isPro={isPro} unlockPro={unlockPro} params={cur.params} markStudied={user ? markStudied : null} />;
      case 'variations':        return <VariationsPage go={go} user={user} isPro={isPro} unlockPro={unlockPro} markStudied={user ? markStudied : null} />;
      case 'login':             return <LoginPage go={go} signIn={signIn} />;
      case 'paywall':           return <PaywallPage go={go} unlockPro={unlockPro} />;
      case 'mypage':            return <MyPage go={go} user={user} isPro={isPro} favorites={favorites} history={history} signOut={signOut} />;
      default:                  return <HomePage go={go} user={user} signIn={signIn} />;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <div
        key={stack.map(s => s.route + JSON.stringify(s.params)).join('>')}
        style={{
          position: 'absolute', inset: 0,
          paddingTop: isFullScreen ? 0 : 54,
          overflowY: 'auto', overflowX: 'hidden',
          background: 'var(--bg)',
          animation: 'fadeIn 240ms ease',
        }}
        data-screen-label={cur.route}
      >
        {renderPage()}
      </div>

      {!isFullScreen && <BottomTab active={activeTab} onChange={(t) => go(t)} />}

      <Toast message={toast || ''} show={!!toast} />
    </div>
  );
}

// ── 마운트 (스케일링)
function MountApp() {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const compute = () => {
      const W = 402, H = 874;
      const vw = window.innerWidth, vh = window.innerHeight;
      const padding = 32;
      const s = Math.min(1, (vw - padding) / W, (vh - padding) / H);
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#EFEDE8',
      padding: 16, boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice width={402} height={874}>
          <App />
        </IOSDevice>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MountApp />);
