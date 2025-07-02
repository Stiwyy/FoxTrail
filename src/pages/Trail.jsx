import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoxTrail } from '../FoxTrailContext';

function Trail() {
    const [input, setInput] = useState('');
    const [success, setSuccess] = useState(false);
    const { setSolved } = useFoxTrail();
    const navigate = useNavigate();

    const checkSolution = () => {
        if (input.trim().toLowerCase() === 'richtige antwort') {
            setSuccess(true);
            setSolved(true);
            navigate('/result');
        } else {
            setSuccess(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Aufgabe 1</h1>
            <p className="text">Was ist die Lösung?</p>
            <input
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Antwort eingeben"
            />
            <button className="button" onClick={checkSolution}>
                Antwort prüfen
            </button>
            {success && <p className="success">Richtig! 🎉</p>}
        </div>
    );
}

export default Trail;
