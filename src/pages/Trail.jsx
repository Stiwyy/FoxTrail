import {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {useFoxTrail} from '../FoxTrailContext'
import Fuse from 'fuse.js'

const steps = [
    // Part 1: Story – Der Tatort
    {
        id: 'story-1',
        type: 'story',
        content: 'Es ist ein nebliger Morgen im BBW. Die oberste Etage ist abgesperrt, die Polizei abgezogen. Ein Mann wurde ermordet – erstochen mit einem auffällig geschmückten Dolch. Du betrittst den Tatort als Ermittler auf eigene Faust. Der Raum wirkt aufgeräumt – zu aufgeräumt. Keine Fingerabdrücke. Keine Kampfspuren. Nur der Dolch liegt noch da – ein Stück, das fast wie aus einem Museum wirkt.',
    },

    // Frage 1 – Hinweis im Klassenzimmer
    {
        id: 'q-1',
        type: 'question',
        riddle: 'An der Wand hängt ein Plakat: "Die Geschichte der digitalen Evolution". Ein Eintrag wirkt seltsam deplatziert und enthält eine auffällige Grafik. Welches berühmte Kunstwerk wird dort angedeutet?',
        solution: 'Die Erschaffung Adams',
    },

    // Part 2: Story – Ein geistesblitz
    {
        id: 'story-2',
        type: 'story',
        content: 'Die Grafik lässt dich stutzen – sie erinnert dich an ein weltbekanntes Kunstwerk. Und plötzlich macht es Klick: Es gab doch kürzlich einen Einbruch im Kunstmuseum Winterthur. Ein antiker Dolch wurde gestohlen. Ist das etwa... derselbe? Du verlässt das BBW und machst dich auf den Weg ins Museum.',
    },

    // Part 3: Story – Ankunft im Museum
    {
        id: 'story-3',
        type: 'story',
        content: 'Das Museum wirkt ruhig, doch die Sicherheitsvorkehrungen wurden offensichtlich verschärft. Du wirst zum Direktor geführt, der dich prüfend mustert. Als du vom Dolch sprichst, wird sein Blick schärfer. "Informationen sind kostbar", sagt er. "Bevor ich Ihnen etwas verrate, müssen Sie zeigen, dass Sie Augen für Details haben..."',
    },

    // Frage 2 – Die Statue im Museum
    {
        id: 'q-2',
        type: 'question',
        riddle: 'Der Direktor fordert dich auf, die Inschrift auf dem Buch der unteren linken Statue aussem beim Eingang zu lesen. Was steht dort?',
        solution: 'Die Ursachen der Dinge erkennen',
    },

    // Part 4: Story – Die nächste Spur
    {
        id: 'story-4',
        type: 'story',
        content: 'Der Direktor nickt langsam. "Sehr gut", sagt er. "Nur wer Details erkennt, findet die Wahrheit." Er führt dich in ein Hinterzimmer, wo sich ein altes Verzeichnis der Sonderausstellung befindet. Einige Seiten fehlen. Einer der vermissten Gegenstände: Ein Ritualdolch aus dem 16. Jahrhundert. Der Titel der Sammlung: "Die Schatten der Menschheit". Ausserdem ein roter Plexiglas Würfel, der dich an einen neuen Ort Lenkt.',
    },
    {
        id: "story-5",
        type: "story",
        content: "Du stehst vor dem auffälligen roten Plexiglaswürfel, der in der Morgensonne matt schimmert. Eine seltsame Ruhe liegt über dem Ort. Du gehst näher heran, deine Augen suchen nach Hinweisen. Am Sockel des Würfels fällt dir ein kleines Metallschild auf – festgenietet, leicht angelaufen. Du wischst mit dem Ärmel darüber. Neben dem Namen des Künstlers steht da noch etwas, eingerahmt in typischen Schweizer Anführungszeichen: «bei Rebekka». Du runzelst die Stirn. 'Rebekka…?' murmelst du leise. Irgendetwas daran kommt dir bekannt vor. Du trittst einen Schritt zurück, betrachtest die Szene noch einmal. Und dann macht es Klick."
    },
    {
        id: "q-3",
        type: "question",
        riddle: "Was steht auf dem Schild unter dem Namen des Autors bei der Statue?",
        solution: "«bei Rebekka»"
    },
    {
        id: "story-6",
        type: "story",
        content: "Rebekka... Oder war es Rebecca? Dann fällt dir wieder ein: Rebecca Schneebeli. Der Name ist dir bei einer früheren Recherche schon einmal begegnet – eine Künstlerin? Richterin?! Du bist dir nicht mehr ganz sicher, aber das Gefühl ist klar: Sie ist der nächste Anhaltspunkt. Du wendest dich gerade ab, als ein leiser Hauch Wind dir etwas an die Füße weht. Ein einzelnes Blütenblatt, hellrosa, makellos, fast zu perfekt. Du beugst dich hinunter. Kein Strauch, keine Blume in der Nähe scheint es verloren zu haben. Vielleicht bedeutungslos. Vielleicht auch nicht. Du steckst es ein – Gewohnheit, Vorsicht oder Instinkt – du wirst es später herausfinden.",
        hints: [
            {
                "type": "image",
                "content": "/images/bluetenblatt.jpg"
            }
        ]
    },
    {
        id: "story-7",
        type: "story",
        content: "Das Bundesgericht erhebt sich mit strenger Würde vor dir. Doch heute wirkt der Garten davor seltsam friedlich. Du gehst langsam den Weg entlang, als dich ein Farbtupfer aufhorchen lässt – ein leuchtendes Blau zwischen dem Grün. Hortensien. Du gehst näher und erkennst die Blütenform – identisch mit dem Blatt, das du eingesteckt hast. Deine Gedanken überschlagen sich, als eine Stimme dich unterbricht: 'Wunderschöne Blumen, nicht wahr?' Ein älterer Mann mit wettergegerbtem Gesicht und Arbeitskleidung tritt aus dem Schatten. Ein Gärtner. Er schüttelt den Kopf. 'Schande, was die Vandalen hier angerichtet haben. Haben alles zertrampelt. Und dann auch noch ihren Müll liegen lassen…'"
    },
    {
        id: "q-4",
        type: "question",
        riddle: "Wie lautet der wissenschaftliche Name der Pflanze, die du vor dem Bundesgericht siehst?",
        solution: "Hydrangea macrophylla"
    },
    {
        id: "story-8",
        type: "story",
        content: "Der Gärtner bückt sich und hebt ein Stück Papier auf – fast beiläufig. Du siehst sofort, dass es keine gewöhnliche Skizze ist: Es ist eine Karte. Mehrere rote Kreise sind darauf eingezeichnet, dazu kleine Symbole, die du nicht einordnen kannst. Du fragst vorsichtig, ob du sie dir ansehen darfst. 'Pah, behalt sie. Ist doch eh nur Müll', brummt der Mann und schlurft weiter. Du drehst das Blatt, versuchst, die Markierungen zu deuten – aber ohne Legende oder Hinweise wirkt sie wie ein Code ohne Schlüssel. Noch.",
        hints: [
            {
                "type": "image",
                "content": "/images/karte-gaertner.jpg"
            }
        ]
    },
    {
        id: "story-9",
        type: "story",
        content: "Frustriert, aber nicht entmutigt, folgst du einem neuen Hinweis: Das Kino. Dort soll es laut Gärtner auch Randale gegeben haben. Du trittst ein. Der Geruch von Popcorn hängt in der Luft – künstlich, süsslich, klebrig. Deine Schritte knarzen auf dem dichten Teppich. 'Hall of Kiwi' steht gross darauf, in einer Art, die an Hollywood erinnern will – aber eher ein müder Abklatsch davon ist. Du verziehst leicht das Gesicht. In dem Moment tritt ein Mann in Anzug an dich heran – der Kinomanager. Du erklärst kurz dein Anliegen, doch er winkt ab. 'Tut mir leid. Ich kann die Besucherlisten nicht abrufen. Passwort vergessen.'"
    },
    {
        id: "q-5",
        type: "question",
        riddle: "Was könnte das Passwort des Kino-Managers sein? (Hinweis: Kombiniere den Teppichtext mit den Zahlen in den heutigen Filmtiteln)",
        solution: "HALLOFKIWI36"
    },
    {
        id: "story-10",
        type: "story",
        content: "'Seppli…', liest du vom Bildschirm. Der Name steht ganz oben auf der Liste. Du versuchst, mehr zu finden, doch die Spur endet dort. Du brauchst eine Pause. Kurz später sitzt du bei Bonne Maman, vor dir ein Cupcake, daneben eine heisse Schokolade. Du denkst laut vor dich hin, spielst die Hinweise durch – nicht ahnend, dass jemand zuhört. Die Verkäuferin tritt an deinen Tisch. 'Entschuldigen Sie... Seppli sagen Sie? Der war gestern hier. Grosse Bestellung. Und etwas hat er immer wieder erwähnt... Dass eine Statue draussen etwas in der Hand hält. Und dass das auch sein Nachname sei…' Du bist sofort hellwach."
    },
    {
        id: "q-6",
        type: "question",
        riddle: "Was hält die Statue draussen in der Hand?",
        solution: "Fisch"
    },
    {
        id: "story-11",
        type: "story",
        content: "Du rennst los. Die Karte des Gärtners hattest du fast vergessen – aber auf einer der Markierungen war ein Fisch abgebildet. Der Weg führt dich zu einem Spielplatz. Kinderlachen hallt über den Platz, doch dein Fokus liegt woanders. Und tatsächlich: Neben der grossen Rutsche klebt ein überdimensionaler Sticker auf einer Wand. Darauf abgebildet ist – ein Getränk."
    },
    {
        id: "q-7",
        type: "question",
        riddle: "Welches Getränk ist auf dem Sticker beim Spielplatz abgebildet?",
        solution: "Bier"
    },
    {
        id: "story-12",
        type: "story",
        content: "Bier... und danach? Klar: Zähneputzen. Und was eignet sich besser zur Erinnerung daran als eine riesige Zahnbürste aus Holz? Du findest sie neben dem Spielplatz. Die Borsten sind auffällig – und zählen lohnt sich. Vielleicht steckt darin das Alter des Täters?"
    },
    {
        id: "q-8",
        type: "question",
        riddle: "Wie viele Borsten hat die grosse Holzzahnbürste beim Spielplatz?",
        solution: "19"
    },
    {
        id: "story-13",
        type: "story",
        content: "Mit allen Hinweisen im Gepäck machst du dich auf den Weg zurück zum BBW. Die Puzzleteile fügen sich zusammen: Seppli Fisch, 19 Jahre alt. Er muss der Täter sein! Nun kannst du deinen Bericht abschließen und den Fall lösen."
    },
    {
        id: "form-1",
        type: "form",
        title: "Letzter Schritt – Wer ist der Täter?",
        description: "Trage hier den vollständigen Namen und das Alter des Täters ein, um den Fall abzuschliessen. Nur wer richtig liegt, kann den Foxtrail erfolgreich beenden.",
        fields: [
            {
                "label": "Vorname des Täters",
                "type": "text",
                "id": "firstname",
                "placeholder": ""
            },
            {
                "label": "Nachname des Täters",
                "type": "text",
                "id": "lastname",
                "placeholder": ""
            },
            {
                "label": "Alter des Täters",
                "type": "number",
                "id": "age",
                "placeholder": ""
            }
        ],
        solution: {
            "firstname": "Seppli",
            "lastname": "Fisch",
            "age": 19
        }
    }
]
const STORAGE_KEY = 'foxTrail_progress';
const TIMER_KEY = 'foxTrail_timer';

export default function Trail() {
    const {started, setStarted, setSolved} = useFoxTrail()
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
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        age: ''
    });

    const timerIntervalRef = useRef(null);

    useEffect(() => {

        const initTimer = () => {

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

            timerIntervalRef.current = setInterval(() => {
                setTotalSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        };

        try {
            const savedTimerData = localStorage.getItem(TIMER_KEY);

            if (savedTimerData) {
                const timerData = JSON.parse(savedTimerData);
                setTotalSeconds(timerData.totalSeconds || 0);
                setStepTimes(timerData.stepTimes || Array(steps.length).fill(0));
                setShowTimer(timerData.showTimer !== undefined ? timerData.showTimer : true);
            } else {
                setTotalSeconds(0);
                setStepTimes(Array(steps.length).fill(0));
            }

            setStepStartTime(Date.now());
            setIsActive(true);
            initTimer();
        } catch (error) {
            console.error('Fehler beim Laden der Timer-Daten:', error);
            setTotalSeconds(0);
            setStepTimes(Array(steps.length).fill(0));
            setStepStartTime(Date.now());
            setIsActive(true);
            initTimer();
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (started && totalSeconds > 0) {
            try {
                const timerData = {
                    totalSeconds,
                    stepTimes,
                    showTimer,
                    lastSaved: Date.now()
                };
                localStorage.setItem(TIMER_KEY, JSON.stringify(timerData));
            } catch (error) {
                console.error('Fehler beim Speichern der Timer-Daten:', error);
            }
        }
    }, [totalSeconds, stepTimes, showTimer, started]);

    useEffect(() => {
        if (isActive) {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

            timerIntervalRef.current = setInterval(() => {
                setTotalSeconds(prevSeconds => prevSeconds + 1);
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
                    setIsActive(false);
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
    }, [started, setStarted]);

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
    }, [index]);

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

        const fuse = new Fuse([{text: solution.toLowerCase()}], options);
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
        } else if (steps[index].type === 'form') {
            const formStep = steps[index];
            if (
                formData.firstname.trim().toLowerCase() !== formStep.solution.firstname.toLowerCase() ||
                formData.lastname.trim().toLowerCase() !== formStep.solution.lastname.toLowerCase() ||
                parseInt(formData.age) !== formStep.solution.age
            ) {
                alert('Die Angaben sind nicht korrekt. Überprüfe deine Antworten.');
                return;
            }
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
                        {index > 0 && stepTimes[index - 1] > 0 && (
                            <div className="last-step-time">
                                <span>Letzter Schritt:</span> {formatTime(stepTimes[index - 1])}
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
                        style={{width: `${((index + 1) / steps.length) * 100}%`}}
                    />
                </div>

                {step.type === 'story' ? (
                    <p className="text">{step.content}</p>
                ) : step.type === 'question' ? (
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
                ) : step.type === 'form' ? (
                    <div className="form-container">
                        <h2 className="form-title">{step.title}</h2>
                        <p className="form-description">{step.description}</p>
                        <div className="form-fields">
                            {step.fields.map((field, i) => (
                                <div key={i} className="form-field">
                                    <label htmlFor={field.id}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        value={formData[field.id]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            [field.id]: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

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
                            style={{border: 0, borderRadius: 8}}
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