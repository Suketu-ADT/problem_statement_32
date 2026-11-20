const uploadForm = document.querySelector("#upload-form");
const fileInput = document.querySelector("#handbook-file");
const chooseButton = document.querySelector("#choose-file");
const uploadFeedback = document.querySelector("#upload-feedback");
const fileName = document.querySelector("#file-name");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const askButton = document.querySelector("#ask-button");
const answerCard = document.querySelector("#answer-card");
const answerText = document.querySelector("#answer-text");
const askedQuestion = document.querySelector("#asked-question");
const sourcesContainer = document.querySelector("#sources");
const globalError = document.querySelector("#global-error");

let documentId = null;

function showError(message) {
  globalError.textContent = message;
  globalError.hidden = false;
}

function clearError() {
  globalError.textContent = "";
  globalError.hidden = true;
}

function setBusy(element, busy) {
  element.classList.toggle("is-loading", busy);
  element.setAttribute("aria-busy", String(busy));
}

chooseButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) uploadHandbook(fileInput.files[0]);
});

for (const eventName of ["dragenter", "dragover"]) {
  uploadForm.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadForm.classList.add("dragover");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  uploadForm.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadForm.classList.remove("dragover");
  });
}

uploadForm.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  if (file) uploadHandbook(file);
});

async function uploadHandbook(file) {
  clearError();
  documentId = null;
  questionInput.disabled = true;
  askButton.disabled = true;
  answerCard.hidden = true;
  fileName.hidden = false;
  fileName.textContent = file.name;
  uploadFeedback.textContent = "Preparing your handbook for search…";
  setBusy(uploadForm, true);

  const body = new FormData();
  body.append("handbook", file);
  try {
    const response = await fetch("/api/handbook", { method: "POST", body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not upload this PDF.");
    documentId = result.document_id;
    uploadFeedback.textContent = `${result.filename} is ready · ${result.sections} searchable sections`;
    questionInput.disabled = false;
    askButton.disabled = false;
    questionInput.focus();
  } catch (error) {
    uploadFeedback.textContent = "";
    showError(error.message || "Could not upload this PDF.");
  } finally {
    setBusy(uploadForm, false);
  }
}

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!documentId || !question) return;
  clearError();
  askButton.disabled = true;
  askButton.querySelector("span").textContent = "Searching…";
  setBusy(questionForm, true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document_id: documentId, question }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not answer this question.");
    renderAnswer(question, result);
  } catch (error) {
    showError(error.message || "Could not answer this question.");
  } finally {
    askButton.disabled = false;
    askButton.querySelector("span").textContent = "Ask question";
    setBusy(questionForm, false);
  }
});

function renderAnswer(question, result) {
  askedQuestion.textContent = `You asked: ${question}`;
  answerText.textContent = result.answer;
  sourcesContainer.replaceChildren();
  if (result.sources && result.sources.length) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `View ${result.sources.length} handbook passages`;
    details.append(summary);
    for (const source of result.sources) {
      const item = document.createElement("div");
      item.className = "source-item";
      item.textContent = `Page ${source.page} · relevance ${source.score}\n${source.text}`;
      details.append(item);
    }
    sourcesContainer.append(details);
  }
  answerCard.hidden = false;
  answerCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.querySelectorAll(".suggestion-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    questionInput.value = chip.dataset.question;
    if (documentId) questionInput.focus();
    else document.querySelector("#upload-form").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
