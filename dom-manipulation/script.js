document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const importFileInput = document.getElementById("importFile");
  const exportBtn = document.getElementById("exportQuotes");

  let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

  // Fallback if local storage is empty
  if (quotes.length === 0) {
    quotes = [
      {
        text: "The best way to get started is to quit talking and begin doing.",
        category: "Motivation",
      },
      {
        text: "Don’t let yesterday take up too much of today.",
        category: "Inspiration",
      },
      {
        text: "You learn more from failure than from success.",
        category: "Wisdom",
      },
    ];
    saveQuotes();
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = "No quotes available. Please add one.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small><em>Category: ${quote.category}</em></small>
        `;

    // Save last viewed quote to session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);

  window.addQuote = function () {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text === "" || category === "") {
      alert("Please fill in both fields.");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();

    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  };

  window.importFromJsonFile = function (event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert("Quotes imported successfully!");
        } else {
          alert("Invalid JSON structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Show last viewed quote from session storage if available
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small><em>Category: ${quote.category}</em></small>
        `;
  } else {
    showRandomQuote(); // fallback to random quote
  }
});
