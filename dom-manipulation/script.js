
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspirational" }
  ];
  
 
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  
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
  
 
  function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ''; 
  
  
    quotesToDisplay.forEach(quote => {
      const quoteElement = document.createElement("div");
      quoteElement.innerHTML = `"${quote.text}" <br><strong>- ${quote.category}</strong>`;
      quoteDisplay.appendChild(quoteElement);
    });
  }
  
 
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br> <strong>- ${randomQuote.category}</strong>`;
  
   
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  }
  

  window.onload = function () {
    populateCategories();
    filterQuotes(); 
  };
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      saveQuotes();
  
      populateCategories();
  
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("New quote added successfully!");
  
      filterQuotes();
    } else {
      alert("Please fill in both fields.");
    }
  }
  
  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
  