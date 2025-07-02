import { createContext, useContext, useState } from 'react';

const FoxTrailContext = createContext();

export function FoxTrailProvider({ children }) {
    const [started, setStarted] = useState(false);
    const [solved, setSolved] = useState(false);

    return (
        <FoxTrailContext.Provider value={{ started, setStarted, solved, setSolved }}>
            {children}
        </FoxTrailContext.Provider>
    );
}

export function useFoxTrail() {
    return useContext(FoxTrailContext);
}
