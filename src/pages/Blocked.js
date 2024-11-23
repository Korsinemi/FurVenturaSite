import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../assets/fun.mp3';

const BlockedPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const cheater = localStorage.getItem('Cheater');

        if (!cheater || cheater !== 'true') {
            navigate('/');
            return;
        }

        const audio = new Audio(soundFile);
        audio.play();

        // Establecer Cheater en true
        localStorage.setItem('Cheater', 'true');
    }, [navigate]);

    return (
        <main>
            <h1>No eres admin, eres un mentiroso</h1>
        </main>
    );
};

export default BlockedPage;
