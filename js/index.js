const initHome = () => {
    const config = {
        backgroundColor: localStorage.getItem("config-bg-color") || "#2b2a33",
        userName: localStorage.getItem("config-user-name") || "user",
        maxCategory: localStorage.getItem("config-max-category") || 8
    };
    
    // Init background color
    const docBody = document.querySelector("body");
    
    docBody.style.backgroundColor = config.backgroundColor;

    const outputWin = document.querySelector(".output-window");

    outputWin.style.backgroundColor = config.backgroundColor;
    
    // Init terminal promt
    const promtSpan = document.querySelectorAll(".promt");
    
    [...promtSpan].forEach(e => {
        e.setAttribute("data-promt", config.userName + "@home:");
    });

    // Init category card grid
    const categoryGrid = document.querySelector(".bookmarks");

    categoryGrid.style.gridTemplateColumns = `repeat(${Math.ceil(config.maxCategory / 2)}, 1fr)`;

    const terminalSection = document.querySelector("section.terminal");
    const cmdWritter = document.querySelector("section.terminal .cmd-writter");

    addEventListener("keyup", (e) => {
        switch(e.key) {
            // Open terminal
            case "t":
                terminalSection.style.zIndex = 2;
                terminalSection.style.opacity = 1;
                cmdWritter.focus();

                // Listener for a special case like
                // when user select a text, but then typing
                // input will auto focus on it's own
                addEventListener("keydown", () => {
                    cmdWritter.focus();
                });

                break;
            // Close terminal
            case "Escape":
                cmdWritter.blur();
                terminalSection.style.opacity = 0;
                terminalSection.style.zIndex = -1;

                break;
        }
    });
}