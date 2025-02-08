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

// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter quotes by category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  
  let filteredQuotes;
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ''; // Clear previous quotes

  quotesToDisplay.forEach(quote => {
      const quoteElement = document.createElement("div");
      quoteElement.innerHTML = `"${quote.text}" <br><strong>- ${quote.category}</strong>`;
      quoteDisplay.appendChild(quoteElement);
  });
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
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotes);

// Initially show a random quote
showRandomQuote();

// Populate categories and filter quotes based on selection
populateCategories();
filterQuotes(); 

// Call the function to create the add quote form dynamically
createAddQuoteForm();

// Sync Quotes Function to simulate fetching from a server
const API_URL = 'https://jsonplaceholder.typicode.com/posts';  // Simulating the API endpoint

function syncQuotes() {
  console.log("Checking for new quotes from the server...");
  fetchQuotesFromServer();  // Fetch quotes from the server and handle syncing
}

async function fetchQuotesFromServer() {
try {
  const response = await fetch(API_URL);  // Simulate fetching from the server
  const serverQuotes = await response.json();

  // Format server data as needed (simulating real server response)
  const formattedServerQuotes = serverQuotes.map(post => ({
    id: post.id,
    text: post.title,  // Assume title is the quote text
    category: 'General'  // Placeholder category
  }));

  handleSync(formattedServerQuotes);  // Sync the quotes with the server data
} catch (error) {
  console.error('Error fetching quotes from server:', error);
}
}

// Handle Syncing and conflict resolution
function handleSync(serverQuotes) {
let updatesMade = false;

serverQuotes.forEach(serverQuote => {
  const localQuoteIndex = quotes.findIndex(q => q.id === serverQuote.id);

  if (localQuoteIndex === -1) {
    // Add new server quote if it's not in the local data
    quotes.push(serverQuote);
    updatesMade = true;
  } else {
    // Resolve conflicts by using the server's version
    const localQuote = quotes[localQuoteIndex];

    if (localQuote.text !== serverQuote.text) {
      // Conflict detected: server data takes precedence
      quotes[localQuoteIndex] = serverQuote;
      updatesMade = true;
    }
  }
});

saveQuotes();  // Save updated quotes to localStorage
displayQuotes(quotes);  // Update the display with the latest quotes

if (updatesMade) {
  console.log("Quotes have been updated from the server.");
}
}

// Sync quotes every 10 seconds
setInterval(syncQuotes, 10000);  // Sync every 10 seconds
