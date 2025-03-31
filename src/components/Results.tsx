import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = () => {
    const [results, setResults] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/results').then(res => setResults(res.data));
    }, []);

    return (
        <div>
            <h2>Exam Results</h2>
            {results.map((res, i) => (
                <p key={i}>{res.email}: {res.score}</p>
            ))}
        </div>
    );
};

export default Results;
