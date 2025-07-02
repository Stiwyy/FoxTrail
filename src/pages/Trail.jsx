import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoxTrail } from '../FoxTrailContext';

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
    // Part 2: Story – Ein Geistesblitz
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
        solution: 'Sapientia',
    },
    // Part 4: Story – Die nächste Spur
    {
        id: 'story-4',
        type: 'story',
        content: 'Der Direktor nickt langsam. "Sehr gut", sagt er. "Nur wer Details erkennt, findet die Wahrheit." Er führt dich in ein Hinterzimmer, wo sich ein altes Verzeichnis der Sonderausstellung befindet. Einige Seiten fehlen. Einer der vermissten Gegenstände: Ein Ritualdolch aus dem 16. Jahrhundert. Der Titel der Sammlung: "Die Schatten der Menschheit".',
    },
];

export default function Trail() {
    const { started, setStarted, setSolved } = useFoxTrail();
    const [index, setIndex] = useState(0);
    const [input, setInput] = useState('');
    const [notes, setNotes] = useState('');
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
                    />
                </>
            )}

            <textarea
                className="notes"
                placeholder="Deine Notizen..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
            />

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
