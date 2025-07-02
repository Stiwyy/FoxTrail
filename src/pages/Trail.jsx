import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFoxTrail } from '../FoxTrailContext'

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

export default function Trail() {
    const { started, setStarted, setSolved } = useFoxTrail()
    const [index, setIndex] = useState(0)
    const [input, setInput] = useState('')
    const [notes, setNotes] = useState('')
    const [showNotes, setShowNotes] = useState(true)
    const [collectedHints, setCollectedHints] = useState([])
    const [showHints, setShowHints] = useState(false)
    const navigate = useNavigate()

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

    const goNext = () => {
        if (steps[index].type === 'question') {
            if (input.trim() !== steps[index].solution) {
                alert('Falsche Antwort')
                return
            }
            setInput('')
        }
        const next = index + 1
        if (next < steps.length) {
            setIndex(next)
        } else {
            setSolved(true)
            navigate('/result')
        }
    }

    const goBack = () => {
        if (index > 0) setIndex(index - 1)
    }

    return (
        <>
            <div className="container" style={{ position: 'relative' }}>
                <h2 className="step-title">
                    Schritt {index + 1} von {steps.length}
                </h2>

                {steps[index].type === 'story' ? (
                    <p className="text">{steps[index].content}</p>
                ) : (
                    <>
                        <p className="text">{steps[index].riddle}</p>
                        <input
                            className="input"
                            type="text"
                            placeholder="Antwort eingeben"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                    </>
                )}

                <div
                    style={{
                        marginTop: 20,
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap'
                    }}
                >
                    <button
                        className="map-toggle-button"
                        onClick={goBack}
                        disabled={index === 0}
                    >
                        ← Zurück
                    </button>

                    <button className="button" onClick={goNext}>
                        {index + 1 < steps.length ? 'Weiter →' : 'Fertig'}
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
                        className="notes-toggle-button"
                        onClick={() => setShowNotes(v => !v)}
                        aria-label={showNotes ? 'Notizen schliessen' : 'Notizen oeffnen'}
                    >
                        {showNotes ? '🗒️' : '✏️'}
                    </button>
                </div>

                {showNotes && (
                    <textarea
                        className="notes"
                        placeholder="Deine Notizen..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                )}
            </div>

            {showHints && (
                <div className="modal-overlay" onClick={() => setShowHints(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowHints(false)}>
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
