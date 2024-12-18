import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/fvUtils.js';
import packageJson from '../../package.json';
import '../styles/Footer.css';

function Footer() {
    const [apiVersion, setApiVersion] = useState('');

    useEffect(() => {
        const fetchApiVersion = async () => {
            try {
                const apiUrl = await getApiUrl('version');
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setApiVersion(data.version);
            } catch (error) {
                console.error('Error fetching API version:', error);
            }
        };
        fetchApiVersion();
    }, []);

    const isPeludSession = localStorage.getItem('PeludToken') !== null;

    return (
        <footer>
            <p>© 2024 FurVentura & © 2024 Korsinemi</p>
            <p>Versión Actual del Cliente: {packageJson.version} / Versión Actual de la API: {apiVersion}</p>
        </footer>
    );
}

export default Footer;