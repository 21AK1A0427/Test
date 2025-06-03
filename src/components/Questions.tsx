import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Questions.css";
import axios from "axios";

interface Question {
  id: number;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  imageUrl?: string;
  type: "mcq" | "fill";
}

interface UserResult {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState<string | null>(null);

  const [tabSwitchCount, setTabSwitchCount] = useState(() => {
    const savedCount = sessionStorage.getItem("tabSwitchCount");
    return savedCount ? parseInt(savedCount) : 0;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem("examTimeLeft");
    return savedTime ? parseInt(savedTime) : 50 * 60;
  });
  
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>(() => {
    const savedAnswers = sessionStorage.getItem("examAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  

  const [enableEndExam, setEnableEndExam] = useState(false);

  const questions: Question[] = [
    { id: 1, questionText: "1. Which of the following correctly shows the hierarchy of arithmetic operations in C?", options: ["\u00A0\u00A0\u00A0\u00A0/+*-", "\u00A0\u00A0\u00A0\u00A0*-/+", "\u00A0\u00A0\u00A0\u00A0+-/*", "\u00A0\u00A0\u00A0\u00A0/*+-" ], correctAnswer: "/*+-", type: "mcq" },
    { id: 2, questionText: "Q.No - 2", options: ["Infinite_Times","32767_Times","65535_Times","Till_stack_overflows"], correctAnswer: "Till_stack_overflows", imageUrl: "https://i.imgur.com/PAHKUk3.png", type: "mcq" },
    { id: 3, questionText: "3. In which header file is the NULL macro defined?", options: ["stdio.h", "stddef.h", "stdio.h_and_stddef.h", "math.h"], correctAnswer: "stdio.h_and_stddef.h", type: "mcq" },
    { id: 4, questionText: "Q.No - 4", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/f6CZhQw.png", type: "mcq" },
    { id: 5, questionText: "Q.No - 5", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/gj6Znw5.png", type: "mcq" },
    { id: 6, questionText: "Q.No - 6", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/YpfuZDM.png", type: "mcq" },
    { id: 7, questionText: "7. Out of fgets() and gets() which function is safe to use?", options: ["gets()", "fgets()" ], correctAnswer: "fgets()", type: "mcq" },
    { id: 8, questionText: "8. Which bitwise operator is suitable for turning off a particular bit in a number?", options: ["&&\u00A0operator", "&\u00A0operator", "||operator", "!\u00A0operator"], correctAnswer: "&\u00A0operator", type: "mcq" },
    { id: 9, questionText: "Q.No - 9", options: ["5", "10", "Error", "Garbage\u00A0alue"], correctAnswer: "Error", imageUrl: "https://i.imgur.com/NebnW6Y.png", type: "mcq" },
    { id: 10, questionText: "Q.No - 10", options: ["Garbage\u00A0value", "Error", "0", "20"], correctAnswer: "20", imageUrl: "https://i.imgur.com/fjbOiri.png", type: "mcq" },
    { id: 11, questionText: "Q.No - 11", options: ["Error\u00A0:++\u00A0needs_a_value", "10", "11", "No\u00A0Output"], correctAnswer: "No Output", imageUrl: "https://i.imgur.com/mZndTFr.png", type: "mcq" },
    { id: 12, questionText: "12. Which standard library function will you use to find the last occurance of a character in a string in C?", options: ["strnchar()", "strchar()","strrchar()", "strrchr()" ], correctAnswer: "strrchr()", type: "mcq" },
    { id: 13, questionText: "13. What is stderr ?", correctAnswer: "standard error streams", type: "fill" },
    { id: 14, questionText: "14. Does there any function exist to convert the int or float to a string?", options: ["Yes", "No" ], correctAnswer: "Yes", type: "mcq" },
    { id: 15, questionText: "Q.No - 15", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/KNXBoyE.png", type: "mcq" },
    { id: 16, questionText: "Q.No - 16", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/gWXPw0x.png", type: "mcq" },
    { id: 17, questionText: "17. Which of the following is not logical operator?", options: ["&", "&&","!","||" ], correctAnswer:"&", type: "mcq" },
    { id: 18, questionText: "Q.No - 18", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/EKGvyAw.png", type: "mcq" },
    { id: 19, questionText: "19. Which of the following cannot be checked in a switch-case statement?", options: ["Character", "Integer","Float","Enum" ], correctAnswer:"Float", type: "mcq" },
    { id: 20, questionText: "20. What are the different types of real data type in C ?", correctAnswer: "float double longdouble", type: "fill" },
    { id: 21, questionText: "21. The binary equivalent of 5.375 is", correctAnswer: "101.011", type: "fill" },
    { id: 22, questionText: "22. Which Header is main in C program to work correctly?", correctAnswer: "#include<math.h>", type: "fill" },
    { id: 23, questionText: "23. Who invented C ?", correctAnswer: "dennis ritchie", type: "fill" },
    { id: 24, questionText: "24. Size of float in C Float=__________?", correctAnswer: "4", type: "fill" },
    { id: 25, questionText: "25. in which stage the following code #include<stdio.h> gets replaced by the contents of the file stdio.h ?", correctAnswer: "preprocessing", type: "fill" },
    { id: 26, questionText: "26. What does the following declaration mean? int (*ptr)[10]", correctAnswer: "ptr is pointer and array of 10 integers", type: "fill" },
    { id: 27, questionText: "27. In C, if you pass an array as an argument to a function, what actually gets passed?", correctAnswer: "base address of array", type: "fill" },
    { id: 28, questionText: "28. How will you free the allocated memory ?", correctAnswer: "free(val_name)", type: "fill" },
    { id: 29, questionText: "29. What do the 'c' and 'v' in argv stands for?", correctAnswer: "count and vector", type: "fill" },
    { id: 30, questionText: "30. Even if integer/float arguments are supplied at command prompt they are treated as strings ?(True or False)", correctAnswer: "true", type: "fill" },
    { id: 31, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/CD1tiL7.png", type: "mcq" },
    { id: 32, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/r1gACxb.png", type: "mcq" },
    { id: 33, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/DXGN3cV.png", type: "mcq" },
    { id: 34, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/kEFnZtd.png", type: "mcq" },
    { id: 35, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/8DhU2Xz.png", type: "mcq" },
    { id: 36, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/5QI8auo.png", type: "mcq" },
    { id: 37, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/c06Izrz.png", type: "mcq" },
    { id: 38, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/SMCwLYq.png", type: "mcq" },
    { id: 39, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/VZ2237o.png", type: "mcq" },
    { id: 40, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/aYHgGku.png", type: "mcq" },
    { id: 41, questionText: "41. Size of double in C Double=__________?", correctAnswer: "8", type: "fill" },
    { id: 42, questionText: "42. What will be the output of the following code?", options: ["3\u00A06", " 3\u00A04", "3\u00A09", "Undefined_behavior"], correctAnswer: " 3 6", imageUrl: "https://i.imgur.com/Q5cHF5I.png", type: "mcq" },
    { id: 43, questionText: "43. What will be the output of this pointer-based array access?", options: ["\u00A02", "\u00A04", "\u00A06", "\u00A08"], correctAnswer: "6", imageUrl: "https://i.imgur.com/Wh8b6W7.png", type: "mcq" },
    { id: 44, questionText: "44. What will be the output of the following code?", options: ["\u00A01", "\u00A03", "\u00A05", "\u00A07"], correctAnswer: "3", imageUrl: "https://i.imgur.com/KY3XLYG.png", type: "mcq" },
    { id: 45, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/YYP272z.png", type: "mcq" },
    { id: 46, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/gOV3exk.png", type: "mcq" },
    { id: 47, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/0J9XH2y.png", type: "mcq" },
    { id: 48, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/GJnWXC0.png", type: "mcq" },
    { id: 49, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/rtbL7Dk.png", type: "mcq" },
    { id: 50, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/tTY7r6v.png", type: "mcq" },
  ];
  useEffect(() => {
    sessionStorage.setItem("tabSwitchCount", tabSwitchCount.toString());
  }, [tabSwitchCount]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isAutoSubmitted) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your progress may be lost.";
        return "Are you sure you want to leave? Your progress may be lost.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isAutoSubmitted]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedRollNumber = sessionStorage.getItem("rollNumber");
    if (!storedEmail || !storedRollNumber) navigate("/");
    else {
      setEmail(storedEmail);
      setRollNumber(storedRollNumber);
    }
     const savedTime = sessionStorage.getItem("examTimeLeft");
    if (savedTime && parseInt(savedTime) <= (50 * 60 - 15 * 60)) {
      setEnableEndExam(true);
    }

    const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Enable End Exam button after 30 minutes (1800 seconds)
          if (timeLeft <= (50 * 60 - 15 * 60) && !enableEndExam) {
            setEnableEndExam(true);
          }
  
          if (newTime <= 1 && !isAutoSubmitted) {
            handleAutoSubmit();
            return 0;
          }
          return newTime;
        });
      }, 1000);
  
      
      return () => clearInterval(timer);
    }, [navigate, isAutoSubmitted]);

    useEffect(() => {
        sessionStorage.setItem("examTimeLeft", timeLeft.toString());
      }, [timeLeft]);
    
      useEffect(() => {
        sessionStorage.setItem("examAnswers", JSON.stringify(userAnswers));
      }, [userAnswers]);
    

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          sessionStorage.setItem("tabSwitchCount", newCount.toString());
          alert(`You switched the tab! Tab switch count: ${newCount}/3`);
          if (newCount >= 3 && !isAutoSubmitted) {
            alert("You switched tabs 3 times. Auto-submitting exam.");
            handleAutoSubmit();
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAutoSubmitted]);

  const handleOptionChange = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: number, text: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  

  const handleSubmit = async () => {
   
    await calculateAndSubmitResults(userAnswers);
   
    calculateAndSubmitResults(userAnswers);
  };

  const handleAutoSubmit = async () => {
    if (isAutoSubmitted) return;
    setIsAutoSubmitted(true);
  
    setTimeout(() => {
      console.log("Auto-submitting exam...");
      console.log("User Answers (Before Auto-Submit):", userAnswers);
  
      setUserAnswers((prevAnswers) => {
        
        
        console.log("Final Answers Captured for Auto-Submit:", prevAnswers);
        calculateAndSubmitResults(prevAnswers);
        return prevAnswers;
      });
    }, 500);
  };
  

  const calculateAndSubmitResults = async (answers: { [key: number]: string }) => {
    let totalScore = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const userResults: UserResult[] = [];

    questions.forEach((q) => {
      const userAnswer = (answers[q.id] || "").toString().trim().toLowerCase();
      const correctAnswer = q.correctAnswer.toString().trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        totalScore += 2; // Each correct answer gives 1 point
        correctAnswers++;
      } else if (answers[q.id] !== undefined) {
        wrongAnswers++;
      }

      userResults.push({
        questionId: q.id,
        questionText: q.questionText,
        userAnswer: answers[q.id] || "Not Answered",
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    });

    // Calculate percentage based on total questions (each question worth 1 point)
    const percentage = (totalScore / questions.length) * 100;

    const storedEmail = sessionStorage.getItem("email") || email;
    const storedRollNumber = sessionStorage.getItem("rollNumber") || rollNumber;

    if (!storedEmail || !storedRollNumber) {
      alert("User details missing. Submission failed.");
      return;
    }

    try {
      await axios.post("https://result-backend-tu2o.onrender.com/submit", {
        email: storedEmail,
        rollNumber: storedRollNumber,
        totalScore,
        correctAnswers,
        wrongAnswers,
        unanswered: questions.length - (correctAnswers + wrongAnswers),
        percentage: percentage.toFixed(2),
        userResults,
        submissionTime: new Date().toISOString()
      });
      alert(`Submission successful!`);
      navigate("/Home");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div className="exam-container">
      <nav className="exam-navbar">
        <div className="logo-container">
          <img src="https://i.imgur.com/oGtwSmY.png" alt="Logo" />
          <h1 className="logo">CODEATHON 2K25</h1>
        </div>
        <div className="exam-timer">
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}
        </div>
        <div className="user-info">
          {email} ({rollNumber})
          <button className="submit-btn" onClick={handleSubmit}  disabled={!enableEndExam && timeLeft > 0}>End Exam</button>
        </div>
      </nav>
      <footer className="exam-footer">
        <div className="left">
       <img src="https://i.imgur.com/oGtwSmY.png" alt="Logo" />
        <span>AITT TIRUPATI</span>  
        </div>
        <div className="center">
          © All Rights Reserved 2025 
        </div>
        <div className="right">
          Crafted by - <strong>GURU GANGADHAR REDDY</strong>
          <div className="small-text">21AK1A0427</div>
          <div className="small-text">IV - ECE</div>
        </div>
      </footer>


      <div className="modal">
        <div className="modal-content">
          <h2 className="question-text">{questions[currentIndex].questionText}</h2>
          {questions[currentIndex].imageUrl && (
            <img src={questions[currentIndex].imageUrl} alt="Question" className="question-image" />
          )}
          {questions[currentIndex].type === "mcq" && questions[currentIndex].options ? (
            <div className="options">
              {questions[currentIndex].options.map((option, index) => (
                <label key={index} className="radio-option">
                  <input 
                    type="radio" 
                    name={`q${currentIndex}`} 
                    value={option} 
                    checked={userAnswers[questions[currentIndex].id] === option} 
                    onChange={() => handleOptionChange(questions[currentIndex].id, option)} 
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="Type your answer here" 
              value={userAnswers[questions[currentIndex].id] || ""} 
              onChange={(e) => handleTextChange(questions[currentIndex].id, e.target.value)} 
              className="fill-input" 
            />
          )}
          <div className="modal-buttons">
            <button onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))} disabled={currentIndex === 0}>Previous</button>
            <button onClick={() => setCurrentIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev))} disabled={currentIndex === questions.length - 1}>Next</button>
            {currentIndex === questions.length - 1 && (
              <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            )}
          </div>

          
        </div>
      </div>
      
    </div>
    
    
  );
};

export default Questions;