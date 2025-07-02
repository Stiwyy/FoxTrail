import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trail from './pages/Trail';
import Result from './pages/Result';
import { useEffect, useState } from 'react';

function App() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        document.body.className = dark ? 'dark' : '';
    }, [dark]);

    const toggleDark = () => setDark((prev) => !prev);

    return (
        <Router>
            <div>
                <button className="darkmode-toggle" onClick={toggleDark}>
                    {dark ? '☀️ Hellmodus' : '🌙 Dunkelmodus'}
                </button>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trail" element={<Trail />} />
                    <Route path="/result" element={<Result />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
