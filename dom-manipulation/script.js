// Simulated server URL (replace with actual server API)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';  // Simulating the API endpoint

// Function to show notifications to the user
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = 'block';

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Sync Quotes Function (modified to use notifications)
function syncQuotes() {
  console.log("Checking for new quotes from the server...");
  fetchQuotesFromServer();  // Fetch quotes from the server and handle syncing
}

// Fetch quotes from the server and handle syncing with local storage
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

// Handle Syncing and conflict resolution (with notification and saving to local storage)
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
        showNotification(`Conflict resolved: Quote with ID ${serverQuote.id} updated from server.`);
      }
    }
  });

  saveQuotes();  // Save updated quotes to localStorage
  displayQuotes(quotes);  // Update the display with the latest quotes

  if (updatesMade) {
    showNotification("Quotes have been updated from the server.");
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));  // Save to localStorage
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");

  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    displayQuotes(quotes);  // Display the loaded quotes
  }
}

// Display quotes (existing function)
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ''; // Clear previous quotes

  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `"${quote.text}" <br><strong>- ${quote.category}</strong>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Filter quotes based on category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  displayQuotes(filteredQuotes);
}

// Populate category filter dropdown
function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));
  const categoryFilter = document.getElementById('categoryFilter');
  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });
}

// Initialize quotes from local storage when the page loads
let quotes = [];  // Array to store quotes
loadQuotes();  // Load quotes from local storage
populateCategories();  // Populate categories in the dropdown

// Add new quote function
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: Date.now(),  // Use timestamp as a unique ID
      text: newQuoteText,
      category: newQuoteCategory
    };
    
    quotes.push(newQuote);
    saveQuotes();  // Save to local storage
    displayQuotes(quotes);  // Update the display

    // Add the category to the dropdown if it's not already there
    if (!Array.from(document.getElementById('categoryFilter').options).some(option => option.value === newQuoteCategory)) {
      const option = document.createElement("option");
      option.value = newQuoteCategory;
      option.innerText = newQuoteCategory;
      document.getElementById('categoryFilter').appendChild(option);
    }

    document.getElementById('newQuoteText').value = '';  // Clear input field
    document.getElementById('newQuoteCategory').value = '';  // Clear input field
  }
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    displayQuotes(quotes);
    showNotification('Quotes imported successfully!');
  };
  
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quotes.json';
  link.click();
}

// Start syncing quotes with the server every 10 seconds
setInterval(syncQuotes, 10000);  // Sync every 10 seconds (adjust interval as needed)
