import React, { useState } from 'react';

const AdminPanel = () => {
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        if (password === 'admin123') {
            window.location.href = '/results';
        } else {
            alert('Invalid Credentials');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default AdminPanel;