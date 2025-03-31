import React from 'react';

const Instructions = () => {
    return (
        <div>
            <h2>Exam Instructions</h2>
            <p>1. No tab switching</p>
            <p>2. Exam will auto-submit after time ends</p>
            <button onClick={() => setTimeout(() => window.location.href = '/exam', 60000)}>Start Exam in 1 min</button>
        </div>
    );
};

export default Instructions;