import  { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import videoBg from "../assets/codeing.mp4";

const Home = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            setUserEmail(email);
        } else {
            navigate("/login");
        }

        // Function to enter fullscreen mode
        const enterFullScreen = () => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if ((elem as any).mozRequestFullScreen) { // Firefox
                (elem as any).mozRequestFullScreen();
            } else if ((elem as any).webkitRequestFullscreen) { // Chrome, Safari & Opera
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) { // IE/Edge
                (elem as any).msRequestFullscreen();
            }
        };

        // Function to detect if fullscreen mode is exited
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                enterFullScreen(); // Re-enter fullscreen mode if exited
            }
        };

        // Disable ESC key and prevent user from exiting fullscreen
        const disableKeys = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "F11") {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        // Enter fullscreen mode on page load
        enterFullScreen();

        // Listen for fullscreen exit and re-enter fullscreen
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        // Listen for keypress events to disable ESC and F11
        document.addEventListener("keydown", disableKeys, true);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
            document.removeEventListener("keydown", disableKeys, true);
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div className="home-container">
            <Helmet>
                <title>Codeathon Portal - Home</title>
                <meta name="description" content="Join the biggest coding competition, Codeathon 2K25." />
            </Helmet>

            {/* Background Video */}
            <video className="bg-video" autoPlay loop muted>
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src="https://i.imgur.com/oGtwSmY.png" alt="Codeathon Logo" />
                    <h1 className="logo">CODEATHON 2K25</h1>
                </div>
                <div className="user-info">
                    {userEmail ? (
                        <>
                            <span>{userEmail.split("@")[0]} ({userEmail})</span>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <button className="logout-btn" onClick={() => navigate("/login")}>Login</button>
                    )}
                </div>
            </nav>

            {/* Cards Section */}
            <div className="card-container">
                <div className="card">
                    <h2>About Codeathon 2K25</h2>
                    <p>Learn about the biggest coding competition of the year!</p>
                    <button className="btn" onClick={() => navigate("/about")}>Read About</button>
                </div>

                <div className="card">
                    <h2>Practice Tests</h2>
                    <p>Sharpen your coding skills before the competition.</p>
                    <button className="btn" onClick={() => navigate("/practice-tests")}>Start Practice</button>
                </div>

                <div className="card">
                    <h2>Start Exam</h2>
                    <p>Ready to compete? Start your Codeathon exam now!</p>
                    <button className="btn" onClick={() => navigate("/exam")}>Begin Exam</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
