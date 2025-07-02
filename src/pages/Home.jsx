import { useNavigate } from 'react-router-dom';
import './Page.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="title">🦊 Willkommen zum Foxtrail!</h1>
            <p className="text">Mach dich bereit für ein spannendes Abenteuer.</p>
            <button className="button" onClick={() => navigate('/trail')}>
                Starte den Trail
            </button>
        </div>
    );
}
