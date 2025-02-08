// Simulate quote data with localStorage or a default set if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { id: 3, text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspirational" }
  ];
  
  // Function to save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Simulated server interaction (mock API call using JSONPlaceholder)
  const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using mock API
  
  // Function to fetch quotes from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(API_URL);
      const serverQuotes = await response.json();
  
      // Simulate mapping server data to our quote structure (assuming the API gives post data)
      const formattedServerQuotes = serverQuotes.map(post => ({
        id: post.id,
        text: post.title,  // Assume the title is the quote text
        category: 'General' // This is a placeholder category
      }));
  
      handleSync(formattedServerQuotes); // Handle syncing and conflict resolution
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
    }
  }
  
  // Syncing logic with conflict resolution
  function handleSync(serverQuotes) {
    // Iterate through the server quotes and check for conflicts with local data
    serverQuotes.forEach(serverQuote => {
      const localQuoteIndex = quotes.findIndex(q => q.id === serverQuote.id);
  
      if (localQuoteIndex === -1) {
        // If the quote doesn't exist locally, add it
        quotes.push(serverQuote);
      } else {
        // If the quote exists locally, resolve the conflict
        const localQuote = quotes[localQuoteIndex];
        
        if (localQuote.text !== serverQuote.text) {
          // Conflict detected: Use server's quote as the source of truth
          quotes[localQuoteIndex] = serverQuote;
          alert(`Conflict resolved: The quote with ID ${serverQuote.id} has been updated from the server.`);
        }
      }
    });
  
    saveQuotes(); // Save the updated quotes to localStorage
    displayQuotes(quotes); // Update the UI with the synced quotes
  }
  
  // Function to display quotes
  function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ''; // Clear any previous quotes
  
    quotesToDisplay.forEach(quote => {
      const quoteElement = document.createElement("div");
      quoteElement.innerHTML = `"${quote.text}" <br><strong>- ${quote.category}</strong>`;
      quoteDisplay.appendChild(quoteElement);
    });
  }
  
  // Fetch quotes from the server every 10 seconds (simulating periodic sync)
  setInterval(fetchQuotesFromServer, 10000); // Fetch every 10 seconds
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br> <strong>- ${randomQuote.category}</strong>`;
  }
  
  // Show an initial random quote when the page loads
  window.onload = function () {
    displayQuotes(quotes); // Display quotes when the page loads
    fetchQuotesFromServer(); // Fetch server quotes when the page loads
  };
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { 
        id: quotes.length + 1, // Generate a unique ID
        text: newQuoteText, 
        category: newQuoteCategory 
      };
  
      quotes.push(newQuote);
      saveQuotes(); // Save the new quote to localStorage
  
      displayQuotes(quotes); // Update the UI with the new quote
      alert("New quote added successfully!");
  
      // Simulate posting the new quote to the server (mock API)
      postQuoteToServer(newQuote);
    } else {
      alert("Please fill in both fields.");
    }
  }
  
  // Simulate posting a new quote to the server
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      
      const serverResponse = await response.json();
      console.log('Quote posted to server:', serverResponse);
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }
  
  // Event listener for the 'Show New Quote' button
  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
  