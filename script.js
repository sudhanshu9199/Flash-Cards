const progressBar = document.querySelector(".progress");
const card = document.querySelector(".card1");
const front = document.querySelector(".front");
const back = document.querySelector(".back");
const shownBtn = document.querySelector(".hide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentCard = 0;
// Flashcard data (You can modify the content here)
let Flashcards = []; // To store flashcard data loaded from JSON.
let totalCards = 0;
const reviewedCards = new Set(
  JSON.parse(localStorage.getItem("reviwedCards")) || []
);

// Fetch flashcard data dynamically from an external JSON file
async function fetchFlashcards() {
  try {
    const response = await fetch("flashcards.json"); // Path to your JSON file
    if (response.ok) {
      Flashcards = await response.json();
      totalCards = Flashcards.length;
      if (totalCards > 0) {
        updateCard();
        updateProgress();
      } else {
        console.warn("No flashcards found.");
        progressBar.textContent = "No flashcards available.";
      }
    } else {
      console.erroe("Failed to load flashcards.");
      progressBar.textContent = "Error loading flashcards.";
    }
  } catch (error) {
    console.error.textContent = "Error loading flashcards.";
  }
}

// Update card visuals to show whether it's reviewed or not
function updateCardVisuals() {
  if (reviewedCards.has(currentCard)) {
    front.classList.add("reviewed-status");
    front.classList.remove("not-reviewed-status");
  } else {
    front.classList.add("not-reviewed-status");
    front.classList.remove("reviewed-status");
  }
}

// Update flashcard content
function updateCard() {
  if (Flashcards.length > 0) {
    front.querySelector("h1").textContent = Flashcards[currentCard].question;
    front.querySelector("p").textContent = `Front of Card ${currentCard + 1}`;
    back.querySelector("h1").textContent = `Answer:`;
    back.querySelector("p").textContent = Flashcards[currentCard].answer;
    updateCardVisuals();
  } else {
    front.querySelector("h1").textContent = "No Flashcards Available";
    front.querySelector("p").textContent = "";
    back.querySelector("h1").textContent = "";
    back.querySelector("p").textContent = "";
  }
  updateBtnState();
}

// Save reviewed cards to localStorage
function saveProgress() {
  localStorage.setItem("reviewedCards", JSON.stringify([...reviewedCards]));
}

function updateBtnState() {
  // Disable/Enable next/prev buttons based on current card
  if (currentCard === 0) {
    prevBtn.classList.add("disabled");
    prevBtn.style.pointerEvents = "none";
  } else {
    prevBtn.classList.remove("disabled");
    prevBtn.style.pointerEvents = "auto";
  }

  // Disable Next button on the last card
  if (currentCard === totalCards - 1) {
    nextBtn.classList.add("disabled");
    nextBtn.style.pointerEvents = "none";
  } else {
    nextBtn.classList.remove("disabled");
    nextBtn.style.pointerEvents = "auto";
  }
}

// Add button animation for feedback
prevBtn.addEventListener('mousedown', () => {
    if(!prevBtn.classList.contains('disabled')){
        prevBtn.classList.add('active');
    }
});

prevBtn.addEventListener('mouseup', () => {
    prevBtn.classList.remove('active');
});

nextBtn.addEventListener('mousedown', ()=> {
    if(!nextBtn.classList.contains('disabled')){
        nextBtn.classList.add('active');
    }
});

nextBtn.addEventListener('mouseup', () => {
    nextBtn.classList.remove('active');
});

// Flip card to show/hide the answer
shownBtn.addEventListener("click", () => {
  if (card.style.transform !== "rotateY(180deg)") {
    reviewedCards.add(currentCard);
    updateCardVisuals();
    saveProgress();
    updateProgress();
  }
  if (card.style.transform === "rotateY(180deg)") {
    card.style.transform = "rotateY(0deg)";
    shownBtn.textContent = "Show Answer";
  } else {
    card.style.transform = "rotateY(180deg)";
    shownBtn.textContent = "Hide Answer";
  }
});

// Next card
nextBtn.addEventListener("click", () => {
  if (currentCard < totalCards - 1) {
    currentCard++;
    updateProgress();
    updateCard();
    card.style.transform = "rotateY(0deg)"; // reset card flip
    shownBtn.textContent = "Show Answer"; // reset button text
  }
});

// Previous card
prevBtn.addEventListener("click", () => {
  if (currentCard > 0) {
    currentCard--;
    updateProgress();
    updateCard();
    card.style.transform = "rotateY(0deg)"; // reset card flip
    shownBtn.textContent = "Show Answer"; // reset button text
  }
});

function updateProgress() {
  const reviewedCount = reviewedCards.size;
  const percentage = Math.floor((reviewedCount / totalCards) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${percentage}%`;
  //   progressBar.textContent = `${percentage}% Reviewed (${reviewedCount}/${totalCards})`;
  const reviewedTextElement = document.querySelector(".reviewed-text");
  reviewedTextElement.textContent = `${reviewedCount} of ${totalCards} Reviewed`;
}
fetchFlashcards();
