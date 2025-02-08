
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", category: "Purpose" }
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    document.getElementById("quoteDisplay").innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  }
  
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
  
      document.getElementById("newQuoteText").value = '';
      document.getElementById("newQuoteCategory").value = '';
  
      alert("New quote added!");
    } else {
      alert("Please fill in both fields.");
    }
  }
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  showRandomQuote();
  