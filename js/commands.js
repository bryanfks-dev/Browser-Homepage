const outputWin = document.querySelector(".output-window");

class Command {
    constructor(name, description, handler, ...args) {
        this.name = name;
        this.description = description;
        this.handler = handler;
        this.args = [...args];
    }

    getName() {return this.name;}

    getDescription() {return this.description;}

    getArgs() {return this.args;}

    checkArg(arg) {
        if (this.args.length > 0) {
            for (let i = 0; i < this.args.length; i++) {
                if (this.args[i].getName() === arg) {return true;}
            }
        }

        return false;
    }
}

class Arg {
    constructor(name, desc) {
        this.name = name;
        this.description = desc;
    }

    getName() {return this.name;}

    getDescription() {return this.description;}
}

class Node {
    constructor(dir) {
        this.dir = dir;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
    constructor() {
        this.curr = new Node((localStorage.getItem("config-user-name") || "user") + "@home:");
    }

    insert(dir) {
        const newNode = new Node(dir);

        newNode.prev = this.curr;

        if (this.curr !== null) {
            this.curr.next = newNode;
        }

        this.curr = newNode;
    }

    reset() {
        if (linkedList.curr.prev !== null) {
            let tempNode = linkedList.curr.prev;
            linkedList.curr = null;
            LinkedList.curr = tempNode;
        }
    }
}

const clearConfig = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Check if key contains "config" prefix as the config 
        if (key.includes("config-")) {
            // Remove the key
            localStorage.removeItem(key);
        }
    }
}

const helpHandler = () => {
    // Header setup
    const header = '<p>Help Commands</p>\n</br>';

    let content = '';

    const MAX_GAP = 10;

    // Append available commands with html tags
    commands.forEach(e => {
        const attrs = `${e.getName().padEnd(MAX_GAP, "\xa0")} ${e.getDescription()}`;

        content += `<p>&emsp;${attrs}</p>\n`;
    });

    // Insert content(s) into output window
    outputWin.innerHTML += header + content;
}

const cmdHelpHandler = (index, instruction) => {
    // Get class command
    const cmdClass = commands[index];

    // Header setup
    const header = `<p>${cmdClass.getName()} command</p>\n
        <p>${cmdClass.getDescription()}</p>\n
        </br><p>Common usage: ${instruction}</p>\n`; // Add common usage of the command

    let content = '';

    const MAX_GAP = 10;

    // Append available arguments with html tags
    cmdClass.getArgs().forEach(e => {
        if (e.getName() !== "help") {
            const attrs = `${e.getName().padEnd(MAX_GAP, "\xa0")} ${e.getDescription()}`;

            content += `<p>&emsp;${attrs}</p>\n`;
        }
    });

    // Insert content(s) into output window
    outputWin.innerHTML += header + content;
}

const newtabHandler = () => {
    // Open new tab with current url
    open(location.href, "_blank");
}

const clearHandler = () => {outputWin.innerHTML = "";}

const configHandler = (value) => {
    // Search for space index from string
    const emptyIdx = (value.indexOf(" ") === -1) ? value.length : value.indexOf(" ");

    // Split string into 2 parts, the first one contains command argument
    // while the second one contains the argument value
    const line = {
        arg: value.substring(0, emptyIdx),
        value: value.substring(emptyIdx + 1, value.length)
    }

    const configClass = commands[3];

    // Function to display error message for missing or bad argument
    const showCommandError = () => {
        // Check if user does not provide an argument
        if (line.arg.trim() === "") {
            outputWin.innerHTML += "<p>Argument is missing, please check 'config help'</p>";
        }
        else {
            outputWin.innerHTML += `<p>Argument '${slicedValue[0]}' not found, please check 'config help'</p>`;
        }
    }

    // Help argument
    if (line.arg === "help") {
        cmdHelpHandler(3, "config &lt;arg&gt; &lt;value&gt;");
    }
    // Reset argument
    else if (line.arg === "reset") {
        // Check if user does provide an argument after reset argument
        if (line.value.trim() !== "") {
            // Check if argument after reset argument is a valid argument
            if (configClass.checkArg(line.value)) {
                switch (line.value) {
                    case "user":
                        localStorage.removeItem("config-user-name");
                        initHome();
                        outputWin.innerHTML += '<p>Username has been reset to default value</p>';
                        break;
                    
                    case "bgcolor":
                        localStorage.removeItem("config-bg-color");
                        initHome();
                        outputWin.innerHTML += '<p>Homepage background color has been reset to default value</p>';
                        break;

                    case "maxcat":
                        localStorage.removeItem("config-max-category");
                        initHome();
                        outputWin.innerHTML += '<p>Max category count has been reset to default value</p>';
                        break;
                }
            }
            else {showCommandError();}
        }
        else {
            // Clear config
            clearConfig();
            initHome();

            outputWin.innerHTML += '<p>Config has been reset to default value</p>';
        }
    }
    else {
        // Check if user provide a valid argument
        if (configClass.checkArg(line.arg)) {
            // Check if user provide an argument value
            if (line.value.trim() !== "") {
                switch (line.arg) {
                    case "user":
                        // Save username into local storage
                        localStorage.setItem("config-user-name", line.value);
                        outputWin.innerHTML += `<p>Username has been changed to ${line.value}</p>\n`;
    
                        initHome();
    
                        break;
                    
                    case "bgcolor":
                        const regex = new RegExp("^#[0-9A-F]{6}$", "i");

                        // Check if user provide a valid hex value
                        if (regex.test(line.value)) {
                            // Save background color into local storage
                            localStorage.setItem("config-bg-color", line.value);
                            outputWin.innerHTML += `<p>Homepage background color has been change to '${line.value}'</p>`;
    
                            initHome();
                        }
                        else {
                            outputWin.innerHTML += '<p>Invalid hex value</p>';
                        }
    
                        break;
                    
                    case "maxcat":
                        line.value = parseInt(line.value, 10);

                        // Check if parsing string into integer is success
                        if (line.value !== NaN) {
                            // Check if number is not less than 0
                            if (line.value > 0) {
                                // Save max category into local storage
                                localStorage.setItem("config-max-category", line.value);
                                outputWin.innerHTML += `<p>Max category value has been change to '${line.value}'</p>`;

                                initHome();
                            }
                            else {
                                outputWin.innerHTML += '<p>Number should be bigger than 0</p>';
                            }
                        }
                        else {
                            outputWin.innerHTML += '<p>Invalid number value</p>';
                        }

                        break;
                }
            }
            else { // User does not provide an argument value
                outputWin.innerHTML += `<p>Value is empty, please provide a value</p>`;
            }
        }
        else {showCommandError();}
    }
}

const scHandler = (value) => {
    // Help argument
    if (value === "help") {
        cmdHelpHandler(4, "sc &lt;value&gt; [--se=google]");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Check if argument value not empty
        if (value.trim() !== "") {
            // Available search engines
            const engine = [{
                anchor: "google",
                query: "https://www.google.com/search?q="
            },
            {
                anchor: "ddg",
                query: "https://www.duckduckgo.com/?q="
            },
            {
                anchor: "yandex",
                query: "https://www.yandex.com/search/?text="
            },
            {
                anchor: "bing",
                query: "https://www.bing.com/search?q="
            }];
            
            // Get the space index from index
            const emptyIdx = (value.lastIndexOf(" ") === -1) ? value.length : value.lastIndexOf(" ");
            
            // Set default search engine
            let searchEngine = engine[0];
        
            // Check if user provide search engine
            if (value.substring(emptyIdx, value.length).includes("--se=")) {
                // Get inputted search engine from user
                const inputtedSE = value.substring((emptyIdx + 1) + ("--se=".length), value.length);
        
                // Check if provided search engine is valid
                for (let i = 0; i < engine.length; i++) {
                    if (engine[i].anchor === inputtedSE) {
                        searchEngine = engine[i];
                        break;
                    }
                }
                
                // Check if user provide an invalid search engine
                if (inputtedSE !== "google" && searchEngine.anchor === "google") {
                    outputWin.innerHTML += "<p>Invalid search engine, please check 'sc help'\n</br></p>"
                    return;
                }
                
                // Trim value to ONLY the search value
                value = value.substring(0, emptyIdx);
            }
            
            // Replace space(s) with "+"
            value = value.replaceAll(/\s/g, "+");
            
            // Run search query with searched value
            open(searchEngine.query + value, "_self");
        }
        // Empty argument value
        else {
            outputWin.innerHTML += "<p>Invalid usage, please check 'sc help'</p>\n</br>";
        }
    }
}

const mkdirHandler = (value) => {
    if (value === "help") {
        cmdHelpHandler(5, "mkdir &lt;name&gt;");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Make sure user haven't do "cd"
        if (restrict) {
            // Check if argument value not empty
            if (value.trim() !== "") {
                value = value.replace(/\s/g, "_");

                const categories = [];

                // Get all preveious bookmark categories from localstorage
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);

                    if (key.includes("bookmark-")) {
                        categories.push(key.substring("bookmark-".length, key.length));
                    }
                }

                // Check if previous categories contains new category that user inputted
                if (!categories.includes(value)) {
                    // Check if category reach max count
                    if (categories.length < (localStorage.getItem("config-max-category") || 8)) {
                        const colors = ["red", "blue", "cyan", "pink", "green"];

                        const newCategory = {
                            name: value,
                            color: colors[Math.floor(Math.random() * colors.length)],
                            contents: []
                        }

                        // Save bookmark to localstorage
                        localStorage.setItem(`bookmark-${value}`, JSON.stringify(newCategory));

                        initBookmark();
                    }
                    else {
                        outputWin.innerHTML += `<p>Category is full</p>`;
                    }
                }
                // Inputted category has been exists
                else {
                    outputWin.innerHTML += `<p>Category '${value.replaceAll("_", " ")}' already exists</p>`;
                }
            }
            // Empty argument value
            else {
                outputWin.innerHTML += "<p>Invalid usage, please check 'mkdir help'</p>\n</br>";
            }
        }
        // User have do "cd"
        else {
            outputWin.innerHTML += "<p>`Invalid usage, please check 'mkdir help'`</p>\n</br>";
        }
    }
}

const rmdirHandler = (value) => {
    if (value === "help") {
        cmdHelpHandler(6, "rmdir &lt;category_name&gt;");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Check if argument value not empty
        if (value.trim() !== "") {
            value = value.replace(/\s/g, "_");

            let categories = [];

            // Get all preveious bookmark categories from localstorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (key.includes("bookmark-")) {
                    categories.push(key);
                }
            }

            // Check if previous category contains inputted category
            if (categories.includes(`bookmark-${value}`)) {
                localStorage.removeItem(`bookmark-${value}`);
            }
            // Inputted category not exist in array
            else {
                outputWin.innerHTML += `<p>Category '${value.replaceAll("_", " ")}' not found</p>`;
            }

            initBookmark();
        }
        // Empty argument value
        else {
            outputWin.innerHTML += "<p>Invalid usage, please check 'rmdir help'</p>\n</br>";
        }
    }
}

let restrict = true;
let selectedCategory = '';
const linkedList = new LinkedList();

const cdHandler = (value) => {
    if (value === "help") {
        cmdHelpHandler(7, "cd &lt;category_name&gt;");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Check if value not empty
        if (value.trim() !== "") {
            const categories = [];
    
            value = value.replaceAll(/\s/g, "_");
    
            // Get all preveious bookmark categories from localstorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
    
                if (key.includes("bookmark-")) {
                    categories.push(key.substring("bookmark-".length, key.length));
                }
            }

            const setPromt = () => {
                const promtSpan = document.querySelector("section.terminal .promt");
                
                promtSpan.setAttribute("data-promt", linkedList.curr.dir);
            }
    
            switch (value.trim()) {
                case ".":
                    break;
                
                case "..":
                    if (linkedList.curr.prev !== null) {
                        linkedList.reset();
                        setPromt();

                        restrict = true;
                        selectedCategory = '';
                    }
                    break;
                
                default:
                    // Check if previous categories contains inputted category
                    if (categories.includes(value)) {
                        linkedList.insert((localStorage.getItem("config-user-name") || "user") + 
                            "@home:" + "/@" + value.replaceAll("_", " "));
                        setPromt();
                        
                        restrict = false; 
                        selectedCategory = value;
                    }
                    // Inputted category not exist in array
                    else {
                        outputWin.innerHTML += `<p>Category '${value.replaceAll("_", " ")}' not found</p>`;
                    }
                    break;
            }
        }
        // Empty value
        else {
            outputWin.innerHTML += "<p>Empty value, please check 'cd help'</p>\n</br>";
        }
    }
}

const mklHandler = (value) => {
    // Help argument
    if (value === "help") {
        cmdHelpHandler(8, "cd &lt;category_name&gt; -> mkl &lt;title&gt; &lt;link&gt;");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Make sure user already do "cd" command
        if (!restrict) {
            // Check if category not empty
            if (value.trim() !== "") {
                // Get the space index from index
                const emptyIdx = (value.lastIndexOf(" ") === -1) ? value.length : value.lastIndexOf(" ");

                // Split value into title and link
                const json = {
                    title: value.substring(0, emptyIdx),
                    url: value.substring(emptyIdx + 1, value.length)
                }

                // Check if url contains "https://"
                if (!json.url.includes("http://") && !json.url.includes("https://")) {
                    // Add "https://" to url
                    json.url = "https://" + json.url;
                }

                // Fetch category from localstorage
                let category = localStorage.getItem(`bookmark-${selectedCategory}`);
                category = JSON.parse(category);

                // Check if inputted link exists in category contents
                if (category.contents.includes(json.title)) {
                    outputWin.innerHTML += `<p>'${json.title}' already exists</p>\n</br>`;
                }
                // New content
                else {
                    // Insert new content into category
                    category.contents.push(json);

                    // Save new category into localstorage
                    localStorage.setItem(`bookmark-${selectedCategory}`, JSON.stringify(category));

                    initBookmark();
                }
            }
            // Empty category
            else {
                outputWin.innerHTML += "<p>Missing category, please check 'mkl help'</p>\n</br>";
            }
        }
        else {
            outputWin.innerHTML += "<p>Invalid usage, please check 'mkl help'</p>\n</br>";
        }
    }
}

const rmlHandler = (value) => {
    // Help argument
    if (value === "help") {
        cmdHelpHandler(8, "cd &lt;category_name&gt; -> rml &lt;title&gt;");
        outputWin.innerHTML += "</br>";
    }
    else {
        // Make sure user already do "cd" command
        if (!restrict) {
            // Check if category not empty
            if (value.trim() !== "") {
                // Fetch category from localstorage
                let category = localStorage.getItem(`bookmark-${selectedCategory}`);
                category = JSON.parse(category);

                let found = false;

                // Check if category content contains inputted value
                for (let i = 0; i < category.contents.length; i++) {
                    if (category.contents[i].title === value) {
                        // Remove content from array
                        category.contents.splice(i, 1);

                        // Push new category into localstorage
                        localStorage.setItem(`bookmark-${selectedCategory}`, JSON.stringify(category));

                        initBookmark();

                        found = true;
                    }
                }

                // Content not found in categories array
                if (!found) {
                    outputWin.innerHTML += `<p>'${value}' not found in category 
                        '${selectedCategory.replace("_", " ")}'</p>\n</br>`;
                }
            }
            // Empty category
            else {
                outputWin.innerHTML += "<p>Missing category, please check 'rml help'</p>\n</br>";
            }
        }
        else {
            outputWin.innerHTML += "<p>Invalid usage, please check 'rml help'</p>\n</br>";
        }
    }
}

const exitHandler = () => {
    cmdWritter.value = "";
    inputHistory = [];

    currIdx = 0;

    linkedList.reset();

    clearHandler();

    cmdWritter.blur();

    terminalSection.style.opacity = 0;
    terminalSection.style.zIndex = -1;
}

// Available commands
const commands = [
    new Command("help", "Help command", helpHandler), // 0
    new Command("newtab", "Open new tab", newtabHandler), // 1
    new Command("clear", "Clear terminal", clearHandler), // 2
    new Command("config", "Homepage and terminal configuration", configHandler,  // 3
        new Arg("user", "Set username"), 
        new Arg("bgcolor", "Set homepage background color"), 
        new Arg("maxcat", "Set maximum count of category"), 
        new Arg("help")),
    new Command("sc", "Browsing using search engine(s)", scHandler, // 4
        new Arg("--se", "Search engine[google(default)|ddg|yandex|bing]"), 
        new Arg("help")),
    new Command("mkdir", "Make bookmark category", mkdirHandler, // 5
        new Arg("help")),
    new Command("rmdir", "Remove bookmark category", rmdirHandler, // 6
        new Arg("help")),
    new Command("cd", "Change directory", cdHandler, // 7
        new Arg("help")),
    new Command("mkl", "Make link inside category", mklHandler, // 8
        new Arg("help")),
    new Command("rml", "Remove link inside category", rmlHandler, // 9
        new Arg("help")),
    new Command("exit", "Exit terminal", exitHandler) // 10
];