import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trail from './pages/Trail';
import Result from './pages/Result';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trail" element={<Trail />} />
                <Route path="/result" element={<Result />} />
            </Routes>
        </Router>
    );
}

export default App;
