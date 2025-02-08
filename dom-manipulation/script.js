
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" }
];


function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;

 
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}


function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
    
      saveQuotes();
      
     
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      
 
      alert("New quote added!");
  } else {
      alert("Please fill out both fields.");
  }
}


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}


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

 
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  
 
  document.body.appendChild(formContainer);
}


document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotes);


showRandomQuote();


populateCategories();
filterQuotes(); 

createAddQuoteForm();

const API_URL = 'https://jsonplaceholder.typicode.com/posts';  

function syncQuotes() {
  console.log("Checking for new quotes from the server...");
  fetchQuotesFromServer(); 
}

async function fetchQuotesFromServer() {
try {
  const response = await fetch(API_URL);  
  const serverQuotes = await response.json();

  
  const formattedServerQuotes = serverQuotes.map(post => ({
    id: post.id,
    text: post.title,  
    category: 'General'  
  }));

  handleSync(formattedServerQuotes);  
} catch (error) {
  console.error('Error fetching quotes from server:', error);
}
}


function handleSync(serverQuotes) {
let updatesMade = false;

serverQuotes.forEach(serverQuote => {
  const localQuoteIndex = quotes.findIndex(q => q.id === serverQuote.id);

  if (localQuoteIndex === -1) {
    
    quotes.push(serverQuote);
    updatesMade = true;
  } else {
    
    const localQuote = quotes[localQuoteIndex];

    if (localQuote.text !== serverQuote.text) {
     
      quotes[localQuoteIndex] = serverQuote;
      updatesMade = true;
    }
  }
});

saveQuotes(); 
displayQuotes(quotes);  

if (updatesMade) {
  console.log("Quotes have been updated from the server.");
}
}


setInterval(syncQuotes, 10000);  
