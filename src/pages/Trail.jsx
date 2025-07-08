import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFoxTrail } from '../FoxTrailContext'
import Fuse from 'fuse.js'

const steps = [
    {
        id: 'story-1',
        type: 'story',
        content:
            'Es ist ein nebliger Morgen im BBW. Die oberste Etage ist abgesperrt. Ein Mann wurde ermordet – erstochen mit einem auffällig geschmückten Dolch.',
        hints: [
            { type: 'text', content: 'Der Dolch sieht antik aus.' },
            { type: 'image', content: '/images/dolch.jpg' }
        ]
    },
    {
        id: 'q-1',
        type: 'question',
        riddle:
            'An der Wand hängt ein Plakat zur digitalen Evolution. Welches Kunstwerk wird angedeutet?',
        solution: 'Die Erschaffung Adams',
        hints: [{ type: 'text', content: 'Denke an Michelangelo.' }]
    },
    {
        id: 'story-2',
        type: 'story',
        content:
            'Du verlässt das BBW und gehst zum Museum. Die Eingangstür steht weit offen.',
        hints: []
    },
    {
        id: 'q-2',
        type: 'question',
        riddle: 'Was steht auf der Inschrift der Statue?',
        solution: 'Sapientia',
        hints: [{ type: 'text', content: 'Latein für Weisheit.' }]
    },
    {
        id: 'story-3',
        type: 'story',
        content:
            'Du findest ein altes Verzeichnis der Sonderausstellung mit fehlenden Seiten.',
        hints: []
    }
]
const STORAGE_KEY = 'foxTrail_progress';
const TIMER_KEY = 'foxTrail_timer';

export default function Trail() {
    const { started, setStarted, setSolved } = useFoxTrail()
    const [index, setIndex] = useState(0)
    const [input, setInput] = useState('')
    const [notes, setNotes] = useState('')
    const [showNotes, setShowNotes] = useState(false)
    const [collectedHints, setCollectedHints] = useState([])
    const [showHints, setShowHints] = useState(false)
    const navigate = useNavigate()
    const [showMap, setShowMap] = useState(false)
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toISOString())

    const [showTimer, setShowTimer] = useState(true)
    const [totalSeconds, setTotalSeconds] = useState(0)
    const [isActive, setIsActive] = useState(true)
    const [stepStartTime, setStepStartTime] = useState(Date.now())
    const [stepTimes, setStepTimes] = useState(Array(steps.length).fill(0))

    const timerIntervalRef = useRef(null);

    useEffect(() => {
        try {
            const savedTimerData = localStorage.getItem(TIMER_KEY);
            if (savedTimerData) {
                const timerData = JSON.parse(savedTimerData);
                setTotalSeconds(timerData.totalSeconds || 0);
                setStepTimes(timerData.stepTimes || Array(steps.length).fill(0));
                setShowTimer(timerData.showTimer !== undefined ? timerData.showTimer : true);
                setStepStartTime(Date.now());
            } else {
                setTotalSeconds(0);
                setStepTimes(Array(steps.length).fill(0));
                setStepStartTime(Date.now());
            }

            setIsActive(true);

        } catch (error) {
            console.error('Fehler beim Laden der Timer-Daten:', error);
            setTotalSeconds(0);
            setStepTimes(Array(steps.length).fill(0));
            setStepStartTime(Date.now());
            setIsActive(true);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            timerIntervalRef.current = setInterval(() => {
                setTotalSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [isActive]);

    useEffect(() => {
        if (isActive && started) {
            try {
                const timerData = {
                    totalSeconds,
                    stepTimes,
                    showTimer
                };
                localStorage.setItem(TIMER_KEY, JSON.stringify(timerData));
            } catch (error) {
                console.error('Fehler beim Speichern der Timer-Daten:', error);
            }
        }
    }, [totalSeconds, stepTimes, showTimer, isActive, started]);

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem(STORAGE_KEY);
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);

                setIndex(progress.index || 0);
                setNotes(progress.notes || '');
                setCollectedHints(progress.collectedHints || []);
                setLastUpdateTime(progress.lastUpdateTime || new Date().toISOString());

                if (progress.solved) {
                    setSolved(true);
                }

                console.log(`Fortschritt geladen: Schritt ${progress.index + 1} von ${steps.length}`);
            }
        } catch (error) {
            console.error('Fehler beim Laden des Fortschritts:', error);
        }
    }, [setSolved]);

    useEffect(() => {
        if (!started) return;

        try {
            const currentTime = new Date().toISOString();
            setLastUpdateTime(currentTime);

            const progressData = {
                index,
                notes,
                collectedHints,
                showNotes,
                solved: index >= steps.length - 1,
                lastUpdateTime: currentTime,
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
        } catch (error) {
            console.error('Fehler beim Speichern des Fortschritts:', error);
        }
    }, [index, notes, collectedHints, started]);

    useEffect(() => {
        if (!started) setStarted(true)
    }, [started, setStarted])

    useEffect(() => {
        const hints = steps[index].hints || []
        if (hints.length) {
            setCollectedHints(prev => {
                const newOnes = hints.filter(
                    h => !prev.some(p => p.content === h.content)
                )
                return [...prev, ...newOnes]
            })
        }
    }, [index])

    useEffect(() => {
        if (stepStartTime && index > 0) {
            const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000);

            setStepTimes(prev => {
                const newTimes = [...prev];
                newTimes[index - 1] = timeSpent;
                return newTimes;
            });
        }

        setStepStartTime(Date.now());
    }, [index]);

    const progress = ((index + 1) / steps.length) * 100;
    const step = steps[index];

    const checkAnswer = (userInput) => {
        const solution = steps[index].solution;

        if (userInput.trim().toLowerCase() === solution.toLowerCase()) {
            return true;
        }

        const options = {
            includeScore: true,
            threshold: 0.4,
            keys: ['text']
        };

        const fuse = new Fuse([{ text: solution.toLowerCase() }], options);
        const result = fuse.search(userInput.trim().toLowerCase());

        return result.length > 0 && result[0].score < 0.4;
    };

    const goNext = () => {
        if (steps[index].type === 'question') {
            if (!checkAnswer(input)) {
                alert('Falsche Antwort');
                return;
            }
            setInput('');
        }
        if (stepStartTime) {
            const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000);
            setStepTimes(prev => {
                const newTimes = [...prev];
                newTimes[index] = timeSpent;
                return newTimes;
            });
        }

        const next = index + 1;
        if (next < steps.length) {
            setIndex(next);
            setStepStartTime(Date.now());
        } else {
            setSolved(true);
            setIsActive(false);
            try {
                const finalTimerData = {
                    totalSeconds,
                    stepTimes,
                    completed: true,
                    completionTime: Date.now()
                };
                localStorage.setItem(TIMER_KEY, JSON.stringify(finalTimerData));
            } catch (error) {
                console.error('Fehler beim Speichern der finalen Timer-Daten:', error);
            }

            navigate('/result');
        }
    };

    const goBack = () => {
        if (index > 0) setIndex(index - 1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && steps[index].type === 'question') {
            goNext();
        }
    };

    const resetProgress = () => {
        if (window.confirm('Möchtest du deinen Fortschritt wirklich zurücksetzen?')) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TIMER_KEY);
            setIndex(0);
            setNotes('');
            setCollectedHints([]);
            setSolved(false);

            setTotalSeconds(0);
            setStepTimes(Array(steps.length).fill(0));
            setStepStartTime(Date.now());
            setIsActive(true);

            alert('Fortschritt zurückgesetzt');
        }
    };

    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === undefined || timeInSeconds === null) return "00:00";

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getCurrentStepTime = () => {
        if (!stepStartTime) return 0;
        return Math.floor((Date.now() - stepStartTime) / 1000);
    };

    return (
        <>
            <div className="container">
                {/* Header mit Utility Buttons */}
                <div className="header-toolbar">
                    <button
                        className="notes-toggle-button"
                        onClick={() => setShowNotes(v => !v)}
                        aria-label={showNotes ? 'Notizen schließen' : 'Notizen öffnen'}
                    >
                        {showNotes ? '🗒️' : '✏️'}
                    </button>
                    {collectedHints.length > 0 && (
                        <button
                            className="hint-toggle-button"
                            onClick={() => setShowHints(true)}
                        >
                            💡 {collectedHints.length}
                        </button>
                    )}
                    <button
                        className="timer-toggle-button"
                        onClick={() => setShowTimer(v => !v)}
                        aria-label={showTimer ? 'Timer ausblenden' : 'Timer anzeigen'}
                    >
                        {showTimer ? '⏱️' : '🕒'}
                    </button>
                    <button
                        className="reset-button"
                        onClick={resetProgress}
                        aria-label="Fortschritt zurücksetzen"
                        title="Fortschritt zurücksetzen"
                    >
                        🔄
                    </button>
                </div>

                {/* Timer-Anzeige */}
                {showTimer && (
                    <div className="timer-display">
                        <div className="total-time">
                            <span>Gesamtzeit:</span> {formatTime(totalSeconds)}
                        </div>
                        <div className="step-time">
                            <span>Aktueller Schritt:</span> {formatTime(getCurrentStepTime())}
                        </div>
                        {index > 0 && stepTimes[index-1] > 0 && (
                            <div className="last-step-time">
                                <span>Letzter Schritt:</span> {formatTime(stepTimes[index-1])}
                            </div>
                        )}
                    </div>
                )}

                {/* Fortschrittsinfo */}
                <div className="progress-info">
                    <small>
                        Schritt {index + 1} von {steps.length}
                    </small>
                </div>

                <div className="progress-wrapper">
                    <div
                        className="progress-bar"
                        style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {step.type === 'story' ? (
                    <p className="text">{step.content}</p>
                ) : (
                    <>
                        <p className="text">{step.riddle}</p>
                        <input
                            className="input"
                            type="text"
                            placeholder="Antwort eingeben"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </>
                )}

                {/* Karte anzeigen Button */}
                <div className="map-section">
                    <button
                        className="map-toggle-button"
                        onClick={() => setShowMap(v => !v)}
                    >
                        {showMap ? '📍 Karte verbergen' : '🗺️ Karte anzeigen'}
                    </button>
                </div>

                {showMap && (
                    <div className="map-container">
                        <iframe
                            title="Winterthur Karte"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.5672781572953!2d8.7166667!3d47.4980095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479aa06856be3959%3A0xdea5e8816cf3f969!2sWinterthur!5e0!3m2!1sde!2sch!4v1627398910996!5m2!1sde!2sch"
                            width="100%"
                            height="240"
                            style={{ border: 0, borderRadius: 8 }}
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Notizen */}
                {showNotes && (
                    <textarea
                        className="notes"
                        placeholder="Deine Notizen..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                )}

                {/* Navigation Buttons - am Ende */}
                <div className="navigation-toolbar">
                    <button
                        className="back-button"
                        onClick={goBack}
                        disabled={index === 0}
                    >
                        ← Zurück
                    </button>
                    <button className="next-button" onClick={goNext}>
                        {index + 1 < steps.length ? 'Weiter →' : 'Fertig'}
                    </button>
                </div>
            </div>

            {showHints && (
                <div className="modal-overlay" onClick={() => setShowHints(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setShowHints(false)}
                        >
                            ✕
                        </button>
                        <h3>Hinweise</h3>
                        <div className="hints-list">
                            {collectedHints.map((h, i) =>
                                h.type === 'text' ? (
                                    <p key={i} className="hint-text">
                                        • {h.content}
                                    </p>
                                ) : (
                                    <img
                                        key={i}
                                        src={h.content}
                                        alt={`Hinweis ${i + 1}`}
                                        className="hint-image"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}