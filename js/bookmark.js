const cardElement = (json) => {
    let contents = '';

    // Adding category contents with html tag
    for (const e of json.contents) {
        contents += `<a href="${e.url}">${e.title}</a>\n`;
    }

    // Return card
    return `
        <div class="card">
            <span class="card-title ${json.color}">${json.name}</span>
            <div class="card-content">
                ${contents}
            </div>
        </div>
    `;
}

// Function to convert color into it's lighter or darker color
const modColor = (hex, amount) => {
    hex = hex.slice(1);

    const num = parseInt(hex, 16);

    let r = (num >> 16) + amount;

    if (r > 255) {r = 255;} 
    else if (r < 0) {r = 0;}

    let b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) {b = 255;} 
    else if (b < 0) {b = 0;}

    let g = (num & 0x0000FF) + amount;

    if (g > 255) {g = 255;}
    else if (g < 0) {g = 0;}

    return "#" + (g | (b << 8) | (r << 16)).toString(16);
}

const initBookmark = () => {
    const bookmark = document.querySelector(".bookmarks");

    let contents = '';

    // Append available category from localstorage into array
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.includes("bookmark-")) {
            let json = localStorage.getItem(key);
            json = JSON.parse(json);

            contents += `${cardElement(json)}\n`;
        }
    }

    bookmark.innerHTML = contents;

    document.querySelectorAll(".card").forEach(e => {
        e.style.backgroundColor = modColor(localStorage.getItem("config-bg-color") || "#2b2a33", -7);
    });
}