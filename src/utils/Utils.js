import React from 'react';
import '../styles/Lists.css';

const MessageContainer = ({ successMessages, errorMessages }) => {
    return (
        <div className="message-container">
            {successMessages.forEach((message, index) => (
                <div key={index} className="success message">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p><i className="fa-solid fa-octagon-check" style={{ marginRight: '8px' }} /> {message}</p>
                    </div>
                </div>
            ))}
            {errorMessages.forEach((message, index) => (
                <div key={index} className="error message">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p><i className="fa-solid fa-octagon-xmark" style={{ marginRight: '8px' }} /> {message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageContainer;