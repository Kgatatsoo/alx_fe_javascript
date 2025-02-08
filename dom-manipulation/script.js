// Initialize an array of quotes from localStorage (if available)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;

    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
        // Add the new quote to the array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        
        // Save quotes to localStorage
        saveQuotes();
        
        // Clear the input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        
        // Notify the user
        alert("New quote added!");
    } else {
        alert("Please fill out both fields.");
    }
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to export quotes as a JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners for the buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotes);

// Initially show a random quote
showRandomQuote();
