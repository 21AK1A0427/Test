import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import FullscreenWrapper from "./components/FullscreenWrapper";
import Exam from './components/Exam';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import Round1 from './components/Round1';
import Validation from './components/Validation';
import Questions from './components/Questions';
import Round2 from './components/Round2';
import Validation2 from './components/Validation2';

import './App.css';

function App() {
  return (
    <FullscreenWrapper>
      <Router basename="/Test"> {/* Add basename for GitHub Pages */}
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/results" element={<Results />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/round1" element={<Round1 />} />
            <Route path="/Validation" element={<Validation />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/Round2" element={<Round2 />} />
            <Route path="/Validation2" element={<Validation2 />} />
          </Routes>
        </div>
      </Router>
    </FullscreenWrapper>
  );
}

export default App;
