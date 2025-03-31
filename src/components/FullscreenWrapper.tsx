import React, { useEffect } from "react";

const FullscreenEnforcer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        const enterFullScreen = () => {
            const elem = document.documentElement;
            if (!document.fullscreenElement) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if ((elem as any).mozRequestFullScreen) {
                    (elem as any).mozRequestFullScreen();
                } else if ((elem as any).webkitRequestFullscreen) {
                    (elem as any).webkitRequestFullscreen();
                } else if ((elem as any).msRequestFullscreen) {
                    (elem as any).msRequestFullscreen();
                }
            }
        };

        const preventExit = () => {
            setTimeout(() => {
                if (!document.fullscreenElement) {
                    enterFullScreen(); // Force re-entry into fullscreen
                }
            }, 100);
        };

        const blockKeys = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "F11") {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        // Force fullscreen on load
        enterFullScreen();

        // Constantly check if the user exits fullscreen and force re-entry
        setInterval(() => {
            if (!document.fullscreenElement) {
                enterFullScreen();
            }
        }, 500);

        // Prevent exiting fullscreen
        document.addEventListener("fullscreenchange", preventExit);
        document.addEventListener("webkitfullscreenchange", preventExit);
        document.addEventListener("mozfullscreenchange", preventExit);
        document.addEventListener("MSFullscreenChange", preventExit);

        // Block ESC & F11
        document.addEventListener("keydown", blockKeys, true);

        return () => {
            document.removeEventListener("fullscreenchange", preventExit);
            document.removeEventListener("webkitfullscreenchange", preventExit);
            document.removeEventListener("mozfullscreenchange", preventExit);
            document.removeEventListener("MSFullscreenChange", preventExit);
            document.removeEventListener("keydown", blockKeys, true);
        };
    }, []);

    return <>{children}</>;
};

export default FullscreenEnforcer;
