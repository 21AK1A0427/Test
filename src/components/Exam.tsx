import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Exam.css";

const API_URL = "https://id-backend-1.onrender.com/exam";

type StudentData = {
  firstIds?: string[];
  secondIds?: string[];
  thirdIds?: string[];
  fourthIds?: string[];
};

type RoundStatus = {
  round1: boolean;
  round2: boolean;
  round3: boolean;
  round4: boolean;
};

const generateFallingElements = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const leftPosition = `${Math.random() * 100}vw`;
    const delay = `${Math.random() * 5}s`;
    const animationDuration = `${Math.random() * 3 + 2}s`;
    return (
      <div
        className="falling-element"
        style={{ left: leftPosition, animationDelay: delay, animationDuration }}
        key={i}
      />
    );
  });
};

const Exam = () => {
  const navigate = useNavigate();
  const [isRoundActive, setIsRoundActive] = useState<RoundStatus>({
    round1: false,
    round2: false,
    round3: false,
    round4: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentRound, setCurrentRound] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData>({});

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data } = await axios.get(API_URL);
        if (data.success) {
          console.log("✅ Student Data Fetched:", data.studentData);
          setStudentData(data.studentData);
        } else {
          console.error("❌ Error fetching student data:", data.message);
        }
      } catch (error) {
        console.error("❌ API Error fetching student data:", error);
      }
    };

    fetchStudentData();

    const interval = setInterval(() => {
      const now = new Date();
      setIsRoundActive({
        round1: now >= new Date("2025-04-09T09:30:00") && now <= new Date("2030-04-10T12:40:00"),
        round2: now >= new Date("2025-04-09T09:30:00") && now <= new Date("2030-04-10T13:00:00"),
        round3: now >= new Date("2025-03-09T09:30:00") && now <= new Date("2030-04-10T12:40:00"),
        round4: now >= new Date("2025-03-09T09:30:00") && now <= new Date("2030-04-10T13:00:00"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRoundStart = (round: string) => {
    setCurrentRound(round);
    setShowPopup(true);
    setErrorMessage("");
  };

  const verifyId = async () => {
    if (!idInput.trim()) {
      setErrorMessage("⚠️ ID cannot be empty. Please enter a valid Student ID.");
      return;
    }

    const inputId = idInput.trim().toUpperCase();
    
    const roundToKeyMap: Record<string, keyof StudentData> = {
      round1: "firstIds",
      round2: "secondIds",
      round3: "thirdIds",
      round4: "fourthIds",
    };

    const validIds = studentData[roundToKeyMap[currentRound || ""]] || [];

    console.log("🔍 Checking ID:", inputId);
    console.log("Valid IDs for", currentRound, ":", validIds);

    if (validIds.map(id => id.toLowerCase()).includes(inputId.toLowerCase())) {
      try {
        sessionStorage.setItem("examToken", `valid-${currentRound}-${inputId}`);
        await axios.post(`${API_URL}/submit`, { id: inputId, year: currentRound });
        navigate(`/${currentRound}`);
      } catch (error) {
        console.error("❌ Error submitting data:", error);
        setErrorMessage("⚠️ An error occurred. Please try again.");
      }
    } else {
      setErrorMessage("❌ Invalid Student ID! Please try again.");
    }
  };

  return (
    <HelmetProvider>
      <div className="exam-container">
        <Helmet>
          <title>Codeathon - Tests</title>
        </Helmet>
        <nav className="navbar">
          <div className="logo-container">
            <img src="https://i.imgur.com/oGtwSmY.png" alt="Codeathon Logo" />
            <h1 className="logo">CODEATHON 2K25</h1>
          </div>
        </nav>

        <div className="exam-content">
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year, index) => (
            <div key={year} className={`round round${index + 1}`}>
              <h2>{year} - B.TECH Test</h2>
              <p>Date: April {8 + index}, 2025</p>
              <p>Time: 10:30 AM - {index % 2 === 0 ? "12:40 PM" : "1:00 PM"}</p>
              <button
                className="start-btn"
                disabled={!isRoundActive[`round${index + 1}` as keyof RoundStatus]}
                onClick={() => handleRoundStart(`round${index + 1}`)}
              >
                {isRoundActive[`round${index + 1}` as keyof RoundStatus] ? `Start ${year.toUpperCase()} TEST` : "Not Yet Available"}
              </button>
            </div>
          ))}
        </div>

        <div className="exam-container">
          <div className="animated-bg">{generateFallingElements()}</div>
        </div>

        {showPopup && (
          <div className="popup">
            <h3>Enter Codeathon ID</h3>
            <input type="text" placeholder="Enter ID" value={idInput} onChange={(e) => setIdInput(e.target.value)} />
            <button onClick={verifyId}>Submit</button>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button onClick={() => setShowPopup(false)} className="cancel-btn">Cancel</button>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Exam;