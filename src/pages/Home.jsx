import { useNavigate } from 'react-router-dom';
import { useFoxTrail } from '../FoxTrailContext';

function Home() {
    const { setStarted } = useFoxTrail();
    const navigate = useNavigate();

    const handleStart = () => {
        setStarted(true);
        navigate('/trail');
    };

    return (
        <div className="container">
            <h1 className="title">Willkommen beim FoxTrail!</h1>
            <p className="text">Drücke den Knopf unten, um den Trail zu starten.</p>
            <button className="button" onClick={handleStart}>
                FoxTrail starten
            </button>
        </div>
    );
}

export default Home;
