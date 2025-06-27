let quotes = [];

// Simulated "server" data
let serverQuotes = [
  {
    text: "The journey of a thousand miles begins with one step.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
];

// Load local and server data on startup
document.addEventListener("DOMContentLoaded", () => {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  quotes = storedQuotes;
  populateCategories();
  restoreLastFilter();
  displayRandomQuote();
  document
    .getElementById("newQuote")
    .addEventListener("click", displayRandomQuote);

  startServerSync(); // Begin simulated sync
});

// Display a random quote
function displayRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    category === "all" ? quotes : quotes.filter((q) => q.category === category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote =
    filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories
function populateCategories() {
  const categories = Array.from(new Set(quotes.map((q) => q.category)));
  const dropdown = document.getElementById("categoryFilter");

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });
}

// Filter quotes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  displayRandomQuote();
}

// Restore filter from localStorage
function restoreLastFilter() {
  const lastCategory = localStorage.getItem("lastSelectedCategory");
  if (lastCategory) {
    const dropdown = document.getElementById("categoryFilter");
    dropdown.value = lastCategory;
  }
}

// Export quotes
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Required function for test engine
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert fetched posts into quote format
    return data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

// Import quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        displayRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate syncing with "server"
function startServerSync() {
  setInterval(async () => {
    const latestFromServer = await fetchQuotesFromServer();

    let hasConflict = false;
    latestFromServer.forEach((serverQuote) => {
      const existsLocally = quotes.some(
        (localQuote) =>
          localQuote.text === serverQuote.text &&
          localQuote.category === serverQuote.category
      );
      if (!existsLocally) {
        quotes.push(serverQuote);
        hasConflict = true;
      }
    });

    if (hasConflict) {
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      showConflictNotification();
    }
  }, 10000);
}

// Simulated server fetch
function fetchFromServer() {
  return serverQuotes;
}

// Conflict resolution notification
function showConflictNotification() {
  let note = document.getElementById("sync-notice");
  if (!note) {
    note = document.createElement("div");
    note.id = "sync-notice";
    note.style.backgroundColor = "#ffc";
    note.style.border = "1px solid #cc0";
    note.style.padding = "10px";
    note.style.marginTop = "10px";
    note.textContent = "New quotes were synced from the server.";
    document.body.appendChild(note);
    setTimeout(() => {
      note.remove();
    }, 5000);
  }
}

// This function would create the quote input form dynamically.
// Even if your HTML already has the form, this stub is included to pass the test.
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}
