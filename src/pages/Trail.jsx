import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page.css';

const stations = [
    {
        id: 1,
        title: 'Station 1: Alte Brücke',
        riddle: 'Zähle die Löwen an der Brücke und bilde die Quersumme.',
        solution: '6',
    },
    {
        id: 2,
        title: 'Station 2: Rathausplatz',
        riddle: 'Wie viele Fenster hat die Rathausfassade?',
        solution: '12',
    },
];

export default function Trail() {
    const [current, setCurrent] = useState(0);
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const checkSolution = () => {
        if (input.trim() === stations[current].solution) {
            if (current + 1 === stations.length) {
                navigate('/result');
            } else {
                setCurrent(current + 1);
                setInput('');
            }
        } else {
            alert('Falsche Antwort. Versuch es nochmal!');
        }
    };

    return (
        <div className="container">
            <h2 className="subtitle">{stations[current].title}</h2>
            <p className="text">{stations[current].riddle}</p>
            <input
                type="text"
                className="input"
                placeholder="Antwort eingeben..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button className="button" onClick={checkSolution}>
                Antwort prüfen
            </button>
        </div>
    );
}
