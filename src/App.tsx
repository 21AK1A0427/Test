import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import FullscreenWrapper from "./components/FullscreenWrapper";
import Exam from './components/Exam';
import Questions2 from './components/Questions2';
import Questions3 from './components/Questions3';
import Questions4 from './components/Questions4';
import Round1 from './components/Round1';
import Round3 from './components/Round3';
import Round4 from './components/Round4';
import Validation from './components/Validation';
import Questions from './components/Questions';
import Round2 from './components/Round2';
import Validation2 from './components/Validation2';
import Validation3 from './components/Validation3';
import Validation4 from './components/Validation4';

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
            <Route path="/round1" element={<Round1 />} />
            <Route path="/Validation" element={<Validation />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/Questions2" element={<Questions2 />} />
            <Route path="/Questions3" element={<Questions3 />} />
            <Route path="/Questions4" element={<Questions4 />} />
            <Route path="/Round2" element={<Round2 />} />
            <Route path="/Round3" element={<Round3 />} />
            <Route path="/Round4" element={<Round4 />} />
            <Route path="/Validation2" element={<Validation2 />} />
            <Route path="/Validation3" element={<Validation3 />} />
            <Route path="/Validation4" element={<Validation4 />} />
          </Routes>
        </div>
      </Router>
    </FullscreenWrapper>
  );
}

export default App;
