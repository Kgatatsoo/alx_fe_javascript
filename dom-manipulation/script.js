// Initialize an array of quotes
let quotes = [
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
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
        // Add the new quote to the array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        
        // Clear the input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        
        // Notify the user
        alert("New quote added!");
    } else {
        alert("Please fill out both fields.");
    }
}

// Function to dynamically create the form for adding quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    
    const quoteInput = document.createElement('input');
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";
    
    const categoryInput = document.createElement('input');
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";
    
    const addButton = document.createElement('button');
    addButton.id = "addQuoteBtn";
    addButton.innerText = "Add Quote";
    addButton.addEventListener("click", addQuote);

    // Append elements to the form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
    
    // Append the form container to the body or a specific element in your page
    document.body.appendChild(formContainer);
}

// Event listeners for the buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call the function to create the add quote form dynamically
createAddQuoteForm();

// Initially show a random quote
showRandomQuote();
