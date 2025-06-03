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

const Questions2: React.FC = () => {
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
    { id: 1, questionText: "1. What is a variable?", options: ["An\u00A0object\u00A0that\u00A0holds\u00A0True\u00A0by\u00A0default", " A\u00A0value\u00A0that\u00A0is\u00A0stored\u00A0in\u00A0a\u00A0memory\u00A0location", " A\u00A0named\u00A0location\u00A0in\u00A0memory\u00A0that\u00A0stores\u00A0a\u00A0value" ], correctAnswer: " A named location in memory that stores a value", type: "mcq" },
    { id: 2, questionText: "2. Which of the following data types is used to represent a sequence of ordered elements that can be modified? ", options: ["List","Tuple","Set"," Dictionary"], correctAnswer: "List", type: "mcq" },
    { id: 3, questionText: "3.  What does the in keyword check in Python conditional statements? ", options: ["Object\u00A0identity", "Membership\u00A0in\u00A0a\u00A0sequence\u00A0or\u00A0collection", " Inequality", " Division"], correctAnswer: "Membership in a sequence or collection", type: "mcq" },
    { id: 4, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/PnosSzY.png", type: "mcq" },
    { id: 5, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/UZ5FAbw.png", type: "mcq" },
    { id: 6, questionText: "6. How can you reverse the order of elements in a list in Python? ", options: ["reverse()", "list.reverse()", "eversed(list)", "list.reversed()"], correctAnswer: "list.reverse()", type: "mcq" },
    { id: 7, questionText: "7. How do you check if a value is present in the values of a dictionary? ", options: ["value\u00A0in\u00A0dictionary", "dictionary.contains(value)","value.exists_in(dictionary)","dictionary.has_value(value)" ], correctAnswer: "value in dictionary", type: "mcq" },
    { id: 8, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A",imageUrl: "https://i.imgur.com/sEUtBfj.png", type: "mcq" },
    { id: 9, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "B", imageUrl: "https://i.imgur.com/CVcosqV.png", type: "mcq" },
    { id: 10, questionText: "Q.No - 10", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl:"https://i.imgur.com/kwF4c5R.png", type: "mcq" },
    
  
    { id: 11, questionText: "11. Who is the  the creator of the Python programming language____________.", correctAnswer: "Guido van Rossum ", type: "fill" },
    { id: 12, questionText: "12. The data type used to represent decimal numbers in Python is called ______.", correctAnswer: "Float", type: "fill" },
    { id: 13, questionText: "13. The Python library used for scientific and numerical computations is called ___.", correctAnswer: "Num", type: "fill" },
    { id: 14, questionText: "14. The data type used to store a collection of unordered items with no duplicates in Python is called ______.", correctAnswer: "Set", type: "fill" },
    { id: 15, questionText: "15. In Python, the exception that is raised when an operation or function is applied to an object of inappropriate type is called _______.", correctAnswer: "TypeError", type: "fill" },
    { id: 16, questionText: "16. Who is the  the creator of the c programming language____________." ,correctAnswer: "Dennis Ritchie", type: "fill" },
    { id: 17, questionText: "17. In C, the function used to allocate memory dynamically for an array of n elements, each of size size, is _______.", correctAnswer:"malloc()", type: "fill" },
    { id: 18, questionText: "18. In C, a pointer that points to a function rather than a variable is known as a _______.", correctAnswer: "function pointer", type: "fill" },
    { id: 19, questionText: "19. The preprocessor directive in C used to define a constant value, which cannot be modified during program execution, is _______. ",  correctAnswer:"#define", type: "fill" },
    { id: 20, questionText: "20. In C, the keyword used to indicate that a pointer points to a constant value, meaning the value cannot be modified through the pointer, is ______.", correctAnswer: "#define", type: "fill" },
    
    
    
    { id: 21, questionText: "", options: ["8,4,5,6,7,1,2,3", "8,4,5,1,6,7,2,3", "8,4,5,7,6,1,2,3", "8,4,5,6,7,2,1,3"],  correctAnswer: "8,4,5,6,7,1,2,3", imageUrl: "https://i.imgur.com/QL1FWNT.png",type: "mcq" },
    { id: 22, questionText: "", options: ["8,2,9,3,4,5,6,1,7", "8,2,9,3,4,5,6,7,1", "8,9,2,3,4,5,6,1,7", "8,9,2,3,5,4,6,1,7"], correctAnswer: "8,2,9,3,4,5,6,1,7",imageUrl: "https://i.imgur.com/lGD99Hm.png", type: "mcq" },
    { id: 23, questionText: "", options: ["2,4,6,7,1,3,5,9,8", "2,4,6,7,1,3,9,5,8", "2,4,6,1,7,3,5,9,8", "2,6,4,7,1,3,5,9,8"], correctAnswer: "2,4,6,7,1,3,5,9,8", imageUrl: "https://i.imgur.com/TSeRDMC.png",type: "mcq" },
    { id: 24, questionText: "", options: ["1→3→2→4", "1→2→3→4", "2→1→3→4", "3→1→2→4"], correctAnswer: "1→3→2→4", imageUrl: "https://i.imgur.com/HzaRYRI.png",type: "mcq" },
    { id: 25, questionText: "", options: ["1→3→2→5→4", "2→1→3→5→4", "1→5→2→3→4", "1→2→3→5→4"], correctAnswer: "1→2→3→5→4", imageUrl: "https://i.imgur.com/gTtof3o.png",type: "mcq" },
    { id: 26, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "C", imageUrl: "https://i.imgur.com/PZSmysU.png", type: "mcq" },
    { id: 27, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C",], correctAnswer: "A", imageUrl: "https://i.imgur.com/zbASUrE.png", type: "mcq" },
    { id: 28, questionText: "", options: ["if\u00A0Astack:\u00A0Astack.pop()", "if\u00A0not\u00A0stack:\u00A0return\u00A0False", "stack.pop()", "stack.remove('(')"], correctAnswer: "stack.pop()", imageUrl: "https://i.imgur.com/bP8chyv.png",type: "mcq" },
    { id: 29, questionText: "", options: ["pairs.append((num,complement))", "pairs.append((complement,num))", "pairs.append(num,complement)", "pairs.append((num,target-num))"], correctAnswer: "pairs.append((num,complement))", imageUrl: "https://i.imgur.com/fgi3xq2.png",type: "mcq" },
    { id: 30, questionText: "", options: ["if\u00A0num\u00A0<\u00A0pivot:\u00A0left.append(num)", "if\u00A0num==pivot:\u00A0left.append(num) ", "if\u00A0num>pivot:\u00A0left.append(num)", "if\u00A0num>pivot:\u00A0right.append(num)"], correctAnswer: "if num < pivot: left.append(num)", imageUrl: "https://i.imgur.com/7JmNj8A.png",type: "mcq" },

    { id: 31, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "D", imageUrl: "https://i.imgur.com/qIJWPQ8.png", type: "mcq" },
    { id: 32, questionText: "", options: ["(1,2,3)", "(4,2,3)", "An\u00A0error\u00A0is\u00A0raised", "None\u00A0of\u00A0the\u00A0above"],  correctAnswer: "An error is raised ", imageUrl: "https://i.imgur.com/Em9nVHF.png",type: "mcq" },
    { id: 33, questionText: "", options: ["10", "21", "37", "Error"],  correctAnswer: "10", imageUrl: "https://i.imgur.com/kVUn9FL.png",type: "mcq" },
    { id: 34, questionText: "", options: ["5", "10", "Error", "Garbage\u00A0Value"],  correctAnswer: "Error", imageUrl: "https://i.imgur.com/ZLMUUEU.png",type: "mcq" },
    { id: 35, questionText: "", options: ["Garbage\u00A0value", "Error", "0", "20"],  correctAnswer: "20", imageUrl: "https://i.imgur.com/ZDKWUUa.png",type: "mcq" },
    { id: 36, questionText: "", options: ["RecursionError ", "ValueError", "TypeError", "MemoryError"],  correctAnswer: "RecursionError", imageUrl: "https://i.imgur.com/4sN1PWE.png",type: "mcq" },
    { id: 37, questionText: "", options: ["FileNotFoundError", "ValueError", "TypeError", "IOError"],  correctAnswer: "FileNotFoundError", imageUrl: "https://i.imgur.com/qqOe2d6.png",type: "mcq" },
    { id: 38, questionText: "", options: ["Error:\u00A0Ain\u00A0AArray\u00A0Adeclaration", "Error:\u00A0Aprintf\u00A0Astatement ", "Error:\u00A0Aunspecified\u00A0Acharacter\u00A0Ain\u00A0Aprintf", "No\u00A0Aerror"],  correctAnswer: "No error", imageUrl: "https://i.imgur.com/AXxM78k.png",type: "mcq" },
    { id: 39, questionText: "", options: ["\u00A0\u00A0\u00A0\u00A0A", "\u00A0\u00A0\u00A0\u00A0B", "\u00A0\u00A0\u00A0\u00A0C", "\u00A0\u00A0\u00A0\u00A0D"], correctAnswer: "A", imageUrl: "https://i.imgur.com/d2XF0ea.png", type: "mcq" },
    { id: 40, questionText: "", options: ["TypeError", "SyntaxError", "NameError"],  correctAnswer: "SyntaxError", imageUrl: "https://i.imgur.com/NvH7TFn.png",type: "mcq" },
    
    { id: 41, questionText: "", options: ["2,3,1,4", "2,4,1,3", "4,1,2,3", "1,2,3,4"],  correctAnswer: "2,3,1,4", imageUrl: "https://i.imgur.com/Qg8MAQD.png",type: "mcq" },
    { id: 42, questionText: "", options: ["2,3,1,4", "1,4,2,3", "2,1,3,4", "1,2,4,3"],  correctAnswer: "2,1,3,4", imageUrl: "https://i.imgur.com/m6UJIUD.png",type: "mcq" },
    { id: 43, questionText: "", options: ["2,3,4,1", "2,1,4,3", "2,3,1,4", "3,2,4,1"],  correctAnswer: "2,3,4,1", imageUrl: "https://i.imgur.com/5SU0wdT.png",type: "mcq" },
    { id: 44, questionText: "", options: ["2,1,4,3", "2,4,1,3", "3,4,1,2", "1,4,3,2"],  correctAnswer: "2,1,4,3", imageUrl: "https://i.imgur.com/P31upHW.png",type: "mcq" },
    { id: 45, questionText: "", options: ["4,2,1,3", "3,1,2,4", "3,4,1,2", "4,2,1,3"],  correctAnswer: "4,2,1,3", imageUrl: "https://i.imgur.com/izW5578.png",type: "mcq" },
    
    { id: 46, questionText: "46. Python supports the use of both single and double quotes for defining strings? ", options: ["True", "False"], correctAnswer: "True", imageUrl: "https://i.imgur.com/Q5cHF5I.png", type: "mcq" },
    { id: 47, questionText: "47. The del statement in Python is used to remove an element from a list, but cannot be used to delete a variable? ", options: ["True", "False"], correctAnswer:"False", imageUrl: "https://i.imgur.com/Q5cHF5I.png", type: "mcq" },
    { id: 48, questionText: "48. Python is a cross platform language True or False? ", options: ["True", "False"], correctAnswer: "True", type: "mcq" },
    { id: 49, questionText: "49. Variable declaration is implicit in python?", options: ["True", "False"], correctAnswer: "True",  type: "mcq" },
    { id: 50, questionText: "50. Python is a machine language True or False? ", options: ["True", "False"], correctAnswer: "False", type: "mcq" },
    
  
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
    if (savedTime && parseInt(savedTime) <= (50 * 60 - 30 * 60)) {
      setEnableEndExam(true);
    }

    const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Enable End Exam button after 30 minutes (1800 seconds)
          if (timeLeft <= (50 * 60 - 30 * 60) && !enableEndExam) {
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
      await axios.post("https://result2-backend.onrender.com/submit1", {
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

export default Questions2;