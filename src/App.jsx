import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Trail from './pages/Trail';
import Result from './pages/Result';
import { useEffect, useState } from 'react';
import { FoxTrailProvider, useFoxTrail } from './FoxTrailContext';

function App() {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        document.body.className = dark ? 'dark' : '';
    }, [dark]);

    const toggleDark = () => setDark((prev) => !prev);

    return (
        <FoxTrailProvider>
            <Router>
                <div>
                    <button className="darkmode-toggle" onClick={toggleDark}>
                        {dark ? '☀️ Hellmodus' : '🌙 Dunkelmodus'}
                    </button>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trail" element={<ProtectedTrail />} />
                        <Route path="/result" element={<ProtectedResult />} />
                    </Routes>
                </div>
            </Router>
        </FoxTrailProvider>
    );
}

function ProtectedTrail() {
    const { started } = useFoxTrail();
    return started ? <Trail /> : <Navigate to="/" replace />;
}

function ProtectedResult() {
    const { solved } = useFoxTrail();
    return solved ? <Result /> : <Navigate to="/" replace />;
}

export default App;
