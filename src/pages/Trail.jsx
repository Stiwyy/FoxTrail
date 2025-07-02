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
    const [showMap, setShowMap] = useState(false);
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

            <button className="map-toggle-button" onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Karte ausblenden' : 'Karte anzeigen'}
            </button>

            {showMap && (
                <iframe
                    title="Winterthur Karte"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.5672781572953!2d8.7166667!3d47.4980095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479aa06856be3959%3A0xdea5e8816cf3f969!2sWinterthur!5e0!3m2!1sde!2sch!4v1627398910996!5m2!1sde!2sch"
                    width="100%"
                    height="300"
                    style={{
                        border: 0,
                        borderRadius: '8px',
                        marginTop: '16px',
                    }}
                    allowFullScreen=""
                    loading="lazy"
                />
            )}
        </div>
    );
}
