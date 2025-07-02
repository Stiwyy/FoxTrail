import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoxTrail } from '../FoxTrailContext';

const steps = [
    // Part 1: Story
    {
        id: 'story-1',
        type: 'story',
        content: 'Du stehst am Rande der alten Brücke. Nebelschwaden ziehen über das Wasser...',
    },
    // Frage 1
    {
        id: 'q-1',
        type: 'question',
        riddle: 'Zähle die Löwen an der Brücke und bilde die Quersumme.',
        solution: '6',
    },
    // Part 2: Story
    {
        id: 'story-2',
        type: 'story',
        content: 'Die Löwen brüllen in deinem Kopf, als du den nächsten Pfad betrittst...',
    },
    // Frage 2
    {
        id: 'q-2',
        type: 'question',
        riddle: 'Wie viele Fenster hat die Rathausfassade?',
        solution: '12',
    },
    // Part 3: Story Abschluss
    {
        id: 'story-3',
        type: 'story',
        content: 'Ein letzter Lichtstrahl fällt auf das Ziel – Du hast es fast geschafft!',
    },
];

export default function Trail() {
    const { started, setStarted, setSolved } = useFoxTrail();
    const [index, setIndex] = useState(0);
    const [input, setInput] = useState('');
    const [historyMax, setHistoryMax] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!started) setStarted(true);
    }, [started, setStarted]);

    const step = steps[index];

    const goNext = () => {
        if (step.type === 'question') {
            if (input.trim() !== step.solution) {
                alert('Falsche Antwort. Versuch es nochmal!');
                return;
            }
            setInput('');
        }
        const next = index + 1;
        if (next < steps.length) {
            setIndex(next);
            setHistoryMax(prev => Math.max(prev, next));
        } else {
            // Ende erreicht
            setSolved(true);
            navigate('/result');
        }
    };

    const goBack = () => {
        if (index === 0) return;
        setIndex(index - 1);
    };

    return (
        <div className="container">
            {step.type === 'story' ? (
                <>
                    <p className="text">{step.content}</p>
                </>
            ) : (
                <>
                    <p className="text">{step.riddle}</p>
                    <input
                        className="input"
                        type="text"
                        placeholder="Antwort eingeben"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </>
            )}

            <div style={{ marginTop: '20px' }}>
                <button
                    className="map-toggle-button"
                    onClick={goBack}
                    disabled={index === 0}
                >
                    ← Zurück
                </button>

                <button
                    className="button"
                    onClick={goNext}
                    style={{ marginLeft: '8px' }}
                >
                    {index + 1 < steps.length ? 'Weiter →' : 'Fertig'}
                </button>
            </div>
        </div>
    );
}
