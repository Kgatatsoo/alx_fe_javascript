
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspirational" }
  ];
  

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
 
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br> <strong>- ${randomQuote.category}</strong>`;
  
   
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  }
  
 
  window.onload = function () {
    showRandomQuote();
  };
  

  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
     
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      
      saveQuotes();
  
  
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("New quote added successfully!");
    } else {
      alert("Please fill in both fields.");
    }
  }
  

  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
  
 
  function exportToJson() {
    const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(jsonBlob);
    link.download = 'quotes.json';
    link.click();
  }
  
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes as JSON";
  document.body.appendChild(exportButton);
  
  exportButton.addEventListener("click", exportToJson);
  

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes; 
        saveQuotes(); 
        alert('Quotes imported successfully!');
        showRandomQuote(); 
      } else {
        alert('Invalid JSON file format. Please ensure the file contains an array of quotes.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  const importButton = document.createElement("button");
  importButton.textContent = "Import Quotes from JSON";
  document.body.appendChild(importButton);
  
  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.accept = ".json";
  importFileInput.addEventListener("change", importFromJsonFile);
  
 
  document.body.appendChild(importFileInput);
  