let currIdx = 0,
    inputHistory = [];

const terminalSection = document.querySelector("section.terminal");
const cmdWritter = document.querySelector("section.terminal .cmd-writter");
const outputWin = document.querySelector(".output-window");

const cmdHandler = (val) => {
    let highBound = (val.indexOf(" ") === -1) ? val.length : val.indexOf(" ");

    const [prefix, value] = [val.slice(0, highBound), val.slice(highBound + 1, val.value)];

    let prefixIdx = -1;

    // Get prefix index from commands array
    for (let i = 0; i < commands.length; i++) {
        if (commands[i].getName() === prefix) {
            prefixIdx = i;
            break;
        }
    }

    if (prefixIdx !== -1) {
        const command = commands[prefixIdx];

        switch (prefix) {
            case "help":
                command.handler();
                outputWin.innerHTML += "</br>";
                break;

            case "sc":
            case "dir":
            case "mkdir":
            case "rmdir":
            case "cd":
            case "mkl":
            case "rml":
                command.handler(value);
                break;

            case "clear":
            case "newtab":
            case "exit":
                command.handler();
                break;

            case "config":
                command.handler(value);
                outputWin.innerHTML += "</br>";
                break;
        }
    }
    else {
        outputWin.innerHTML += `
            <p>Command '${prefix}' not found, see available commands at 'help'</p>\n
            </br>
        `;
    }
}

const cmdWritterListener = (e) => {
    switch (e.key) {
        // To previous command
        case "ArrowUp":
            if (currIdx > 0) {
                currIdx--;

                cmdWritter.value = inputHistory[currIdx];
            }

            break;
        
        // To next command
        case "ArrowDown":
            if (currIdx < inputHistory.length - 1) {
                currIdx++;

                cmdWritter.value = inputHistory[currIdx];
            }

            break;
        
        // Enter command
        case "Enter":
            let cmdValue = cmdWritter.value;

            if (cmdValue.trim().length !== 0) {
                inputHistory.push(cmdValue);

                currIdx = inputHistory.length;

                cmdHandler(cmdValue);

                // Clear input
                cmdWritter.value = "";
            }

            outputWin.scrollTop = outputWin.scrollHeight;

            break;
    }
}

const initTerminal = () => {
    if (terminalSection.style.display !== "none") {
        cmdWritter.addEventListener("keydown", (e) => cmdWritterListener(e));
    }
    else {
        removeEventListener("keydown", [window, cmdWritterListener], true);
    }
}