import React from 'react';
import '../styles/About.css';

function About() {
    return (
        <div className="about-page">
            <h1>Sobre FurVentura</h1>
            <div className="story-section">
                <h2>La Historia de FurVentura</h2>
                <p>
                    En un mundo donde la magia y la naturaleza se entrelazan, existe una tierra llamada <strong>FurVentura</strong>. Esta tierra es hogar de criaturas mágicas conocidas como <strong>Animalitos</strong>, cada una con habilidades únicas y personalidades vibrantes.
                </p>
                <p>
                    Los jugadores asumen el papel de <strong>Guardianes</strong>, protectores de FurVentura, encargados de cuidar y entrenar a estos Animalitos para mantener el equilibrio y la paz en el reino.
                </p>
                <button onClick={() => alert('¡Bienvenido a FurVentura! Prepárate para una aventura mágica.')}>¡Únete a la Aventura!</button>
            </div>
            <div className="interactive-section">
                <h2>Explora FurVentura</h2>
                <p>Haz clic en los lugares para descubrir más sobre ellos:</p>
                <div className="map">
                    <div className="location" onClick={() => alert('Bosque Encantado: Un lugar lleno de misterios y criaturas mágicas.')}>Bosque Encantado</div>
                    <div className="location" onClick={() => alert('Montañas Místicas: Hogar de los Animalitos más poderosos.')}>Montañas Místicas</div>
                    <div className="location" onClick={() => alert('Lago de los Sueños: Un lugar de paz y serenidad.')}>Lago de los Sueños</div>
                </div>
            </div>
        </div>
    );
}

export default About;