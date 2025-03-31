let tabSwitchCount = 0;
const maxTabSwitches = 3; // Number of allowed tab switches before termination

export const monitorTabSwitching = (onTerminate: () => void) => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            tabSwitchCount++;
            alert(`Warning: Tab switch detected! (${tabSwitchCount}/${maxTabSwitches})`);
            
            if (tabSwitchCount >= maxTabSwitches) {
                alert("You have switched tabs too many times. Exam terminated.");
                onTerminate();
            }
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
};

export const enforceFullScreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
        alert("Please enable fullscreen mode to continue the exam.");
    });

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            alert("Fullscreen mode is required. Please re-enter fullscreen.");
            document.documentElement.requestFullscreen();
        }
    });
};
