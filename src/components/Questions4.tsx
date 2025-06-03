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

const Questions3: React.FC = () => {
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
    { id: 1, questionText: "1. Which one of these lists contains only Java programming language keywords?", options: ["class,if,void,long,Int,continue", "goto,instanceof,native,finally,default,throws", "try,virtual,throw,final,volatile,transient", "strictfp,constant,super,implements,do" ], correctAnswer: "goto,instanceof,native,finally,default,throws", type: "mcq" },
    { id: 2, questionText: "Q.No - 2", options: ["1,2,4","2,4,5","2,3,4","All_Correct"], correctAnswer: "1,2,4", imageUrl: "https://i.imgur.com/CUsvAHN.png", type: "mcq" },
    { id: 3, questionText: "3. You want subclasses in any package to have access to members of a superclass. Which is the most restrictive access that accomplishes this objective?", options: ["public", "private", "Protected", "Transient"], correctAnswer: "Protected", type: "mcq" },
    { id: 4, questionText: "4. public class Test { } - What is the prototype of the default constructor?", options: ["Test(\u00A0)", "Test(Void)", "public\u00A0Test(\u00A0)", "public\u00A0Test(Void)"], correctAnswer: "public Test( )", type: "mcq" },
    { id: 5, questionText: "5. Which class does not override the equals() and hashCode() methods, inheriting them directly from class Object?", options: ["java.lang.String", "java.lang.Double", "java.lang.StringBuffer", "Java.lang.Character"], correctAnswer: "java.lang.StringBuffer", type: "mcq" },
    { id: 6, questionText: "6. What is the purpose of the @property decorator in python?", options: ["To\u00A0define\u00A0a\u00A0class\u00A0property", "To\u00A0create\u00A0a\u00A0class\u00A0instance", "To\u00A0access\u00A0a\u00A0class\u00A0attribute", "To\u00A0define\u00A0a\u00A0getter\u00A0method\u00A0for\u00A0a\u00A0class\u00A0attribute"], correctAnswer: "To define a getter method for a class attribute", type: "mcq" },
    { id: 7, questionText: "7. What is the purpose of the Python pdb module?", options: ["To\u00A0perform\u00A0database\u00A0operations", "To\u00A0debug\u00A0and\u00A0interactively\u00A0explore\u00A0code","To\u00A0parse\u00A0and\u00A0manipulate\u00A0XML\u00A0data","To\u00A0handle\u00A0exceptions" ], correctAnswer: "To debug and interactively explore code", type: "mcq" },
    { id: 8, questionText: "8. Which of the following statements about method overloading in Python is correct?", options: ["A", "B", "C", "D"], correctAnswer: "C",imageUrl: "https://i.imgur.com/KqrLwd6.png", type: "mcq" },//
    { id: 9, questionText: "9. Which of the following function is used to find the first occurrence of a given string in another string?", options: ["strchr()", "strrchr()", "strstr()", "strnset()"], correctAnswer: "strstr()", type: "mcq" },
    { id: 10, questionText: "10. The maximum combined length of the command-line arguments including the spaces between adjacent arguments is", options: ["128\u00A0characters", "256\u00A0characters", "67\u00A0characters", "It\u00A0may\u00A0vary\u00A0from\u00A0one\u00A0operating\u00A0system\u00A0to\u00A0another"], correctAnswer: "It may vary from one operating system to another",  type: "mcq" },
    
    
    { id: 11, questionText: "11. Java is considered _____typed language, meaning data types are strictly defined.", correctAnswer: "statically", type: "fill" },
    { id: 12, questionText: "12. Polymorphism allows for objects of different classes to be treated in a ____ way. ", correctAnswer: "uniform", type: "fill" },
    { id: 13, questionText: "13. Java code needs to be compiled into ____ code before it can be executed.", correctAnswer: "bytecode", type: "fill" },
    { id: 14, questionText: "14.Inheritance allows a class to inherit properties and methods from another class called the ____ class.?", correctAnswer: "parent", type: "fill" },
    { id: 15, questionText: "15.The ____ method is used to read data from a file in Java.", correctAnswer: "scanner", type: "fill" },
    { id: 16, questionText: "16. Who is the founder and lead designer of the Java programming language ________" ,correctAnswer: "james gosling", type: "fill" },
    { id: 17, questionText: "17. The Python library used for scientific and numerical computations is called ____", correctAnswer:"numpy", type: "fill" },
    { id: 18, questionText: "18. The preprocessor directive in C used to define a constant value, which cannot be modified during program execution, is _______.", correctAnswer: " #define", type: "fill" },
    { id: 19, questionText: "19.Size of double in c ___________",  correctAnswer:"8", type: "fill" },
    { id: 20, questionText: "20. Who invented C ?", correctAnswer: "dennis ritchie", type: "fill" },

    { id: 21, questionText: "", options: ["No\u00A0statement\u00A0required", "import\u00A0java.io.*;", "include\u00A0java.io.*;", "import\u00A0ava.io.PrintWriter;"], correctAnswer: "No statement required", imageUrl: "https://i.imgur.com/9cQR2sH.png", type: "mcq" },
    { id: 22, questionText: "", options: ["Foo.Bar\u00A0b\u00A0=\u00A0new\u00A0Foo.Bar();", "Foo.Bar\u00A0b\u00A0=\u00A0f.new\u00A0Bar();", "Bar\u00A0b\u00A0=\u00A0new\u00A0f.Bar();", "Bar\u00A0b\u00A0=\u00A0f.new\u00A0Bar();"], correctAnswer: "Foo.Bar b = f.new Bar();", imageUrl: "https://i.imgur.com/nORrC5L.png", type: "mcq" },
    { id: 23, questionText: "", options: ["finished", "Compiliation\u00A0fails", "AssertionError\u00A0is\u00A0hrown\u00A0and\u00A0finished\u00A0is\u00A0output.", "An\u00A0AssertionError\u00A0is\u00A0thrown"], correctAnswer: "Compiliation fails", imageUrl: "https://i.imgur.com/VAUuJe3.png", type: "mcq" },
    { id: 24, questionText: "", options: ["true", "false", "Compilation\u00A0fails", "An\u00A0exception\u00A0is\u00A0thrown\u00A0at\u00A0runtime"], correctAnswer: "Compilation fails", imageUrl: "https://i.imgur.com/sppzFHI.png", type: "mcq" },
    { id: 25, questionText: "", options: ["-2147483648\u00A0and\u00A01", "0x80000000\u00A0and\u00A00x00000001", "-2147483648\u00A0and\u00A0-1", "1\u00A0and\u00A0–2147483648"], correctAnswer: "-2147483648 and 1", imageUrl: "https://i.imgur.com/beIOZ6s.png", type: "mcq" },
    { id: 26, questionText: "", options: ["Python\u00A0is\u00A0great\u00A0is\u00A0great","PythonPython\u00A0is\u00A0great","Python\u00A0is\u00A0greatPython\u00A0is\u00A0great","This\u00A0code\u00A0will\u00A0result\u00A0in\u00A0an\u00A0error"], correctAnswer: "PythonPython is great", imageUrl: "https://i.imgur.com/7n66iKr.png", type: "mcq" },
    { id: 27, questionText: "", options: ["4","2","8","Garbage_value"], correctAnswer: "2", imageUrl: "https://i.imgur.com/K4JP0nk.png", type: "mcq" },
    { id: 28, questionText: "", options: ["after\u00A0line\u00A05","after\u00A0line\u00A05","after\u00A0line\u00A05","There\u00A0is\u00A0no\u00A0way\u00A0to\u00A0be\u00A0absolutely\u00A0certain"], correctAnswer: "There is no way to be absolutely certain", imageUrl: "https://i.imgur.com/4gvjtbz.png", type: "mcq" },
    { id: 29, questionText: "", options: ["1\u00A0and\u00A04","2\u00A0and\u00A03","1\u00A0and\u00A03","2\u00A0and\u00A04"], correctAnswer: "2 and 4", imageUrl: "https://i.imgur.com/So4YsX8.png", type: "mcq" },
    { id: 30, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/8FwuQDj.png", type: "mcq" },

   
    { id: 31, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/Y1iCxrL.png", type: "mcq" },
    { id: 32, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/iDPcyp5.png", type: "mcq" },
    { id: 33, questionText: "", options: ["1,2\u00A0and\u00A03", "2,4\u00A0and\u00A05", "3,4\u00A0and\u00A05", "1,4\u00A0and\u00A05"], correctAnswer: "2, 4 and 5", imageUrl: "https://i.imgur.com/BLQ9HJ5.png", type: "mcq" },
    { id: 34, questionText: "", options: ["13→1→2→3→4→5→6→7→8→9→10→11→12", "13→1→2→3→4→5→6→7→9→8→10→11→12", "1→2→13→3→4→5→6→7→8→9→10→11→12", "13→1→2→3→4→5→6→8→7→9→10→11→12"], correctAnswer: "13→1→2→3→4→5→6→7→8→9→10→11→12", imageUrl: "https://i.imgur.com/MXpvPng.png", type: "mcq" },
    { id: 35, questionText: "", options: ["2→6→7→1→3→8→9→4→5→10→11 ", "2→6→7→1→3→8→4→5→9→10→11", "2→6→7→1→3→8→9→4→5→11→10", "2→6→7→1→3→8→4→5→9→11→10"], correctAnswer: "2→6→7→1→3→8→9→4→5→10→11 ", imageUrl: "https://i.imgur.com/C5HrXRF.png", type: "mcq" },
    { id: 36, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/JczDWOV.png", type: "mcq" },
    { id: 37, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/o9BO6xp.png", type: "mcq" },
    { id: 38, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/clKvsH6.png", type: "mcq" },
    { id: 39, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/zbxtm8w.png", type: "mcq" },
    { id: 40, questionText: "", options: ["1→3→2→4", "1→2→3→4", "2→1→3→4", "3→1→2→4"], correctAnswer: "1→3→2→4", imageUrl: "https://i.imgur.com/FWi4sCB.png", type: "mcq" },
   

    { id: 41, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/iJ3MPDe.png", type: "mcq" },
    { id: 42, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/KdqYlGI.png", type: "mcq" },
    { id: 43, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/2sx6nMO.png", type: "mcq" },
    { id: 44, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/lUMfiMa.png", type: "mcq" },
    { id: 45, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/a4ZSlT0.png", type: "mcq" },
    { id: 46, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/2k8WcGe.png", type: "mcq" },
    { id: 47, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/rt28Par.png", type: "mcq" },
    { id: 48, questionText: "48. In C ,is it true that too much recursive calls may result into stack overflow? ", options: ["Yes","No"], correctAnswer: "Yes",  type: "mcq" },
    { id: 49, questionText: "49. The Java Virtual Machine (JVM) is used to compile as opposed to execute Java programs.", options: ["Incorrect","Correct"], correctAnswer: "Incorrect",  type: "mcq" },
    { id: 50, questionText: "50. Functions cannot return  more than one value at a time  in C?", options: ["True","False"], correctAnswer: "True",  type: "mcq" },
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
          
          // Enable End Exam button after 15 minutes (1800 seconds)
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
      await axios.post("https://result3-backend.onrender.com/submit3", {
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
        <span>AITS TIRUPATI</span>  
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

export default Questions3;