// Run all Notepad setup code after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  setupTabSwitching();
  setupAutoSaveNote();
  setupStatusBarUpdates();
});


//    1. Tab switching (top bar)
  
function setupTabSwitching() {
  const tabs = document.querySelectorAll(".file-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });
}


//    2. Auto save note (content)
   
function setupAutoSaveNote() {
  // Get the note title and note content fields
  const noteTitleInput = document.getElementById("note-title");
  const noteContentArea = document.getElementById("note-content");

  // If these elements don't exist, stop this setup
  if (!noteTitleInput || !noteContentArea) {
    return;
  }

  // Storage key for saving the note
  const savedNoteKey = "notepad-saved-note";

  // Load previously saved note from localStorage
  function loadSavedNote() {
    const savedNote = localStorage.getItem(savedNoteKey);

    if (savedNote) {
      const noteData = JSON.parse(savedNote);
      noteTitleInput.value = noteData.title || "";
      noteContentArea.value = noteData.content || "";
    }
  }

  // Save note to localStorage
  function saveNoteToStorage() {
    const noteData = {
      title: noteTitleInput.value,
      content: noteContentArea.value,
    };

    localStorage.setItem(savedNoteKey, JSON.stringify(noteData));
  }

  // Save automatically whenever the user types
  noteTitleInput.addEventListener("input", saveNoteToStorage);
  noteContentArea.addEventListener("input", saveNoteToStorage);

  // Load saved note when the page opens
  loadSavedNote();
}


//    3. Status bar updates (footer)
   
function setupStatusBarUpdates() {
  // Get references to the note textarea and footer status elements
  const noteContentArea = document.getElementById("note-content");

  const statusWords = document.getElementById("status-words");
  const statusCharacters = document.getElementById("status-characters");
  const statusLine = document.getElementById("status-line");
  const statusColumn = document.getElementById("status-column");
  const statusMessage = document.getElementById("status-message");

  // If any required element is missing, stop this setup
  if (
    !noteContentArea ||
    !statusWords ||
    !statusCharacters ||
    !statusLine ||
    !statusColumn ||
    !statusMessage
  ) {
    return;
  }

  /**
   * Calculate the number of words in the note.
   * Empty strings and extra spaces are ignored.
   */
  function calculateWordCount(text) {
    const trimmedText = text.trim();

    if (trimmedText === "") {
      return 0;
    }

    const words = trimmedText.split(/\s+/);
    return words.length;
  }

  /**
   * Calculate the number of characters in the note.
   */
  function calculateCharacterCount(text) {
    return text.length;
  }

  /**
   * Calculate the current line number based on the caret position.
   */
  function calculateCurrentLine(textarea) {
    const caretIndex = textarea.selectionStart; // caret position [web:210]
    const textBeforeCaret = textarea.value.slice(0, caretIndex);

    // Count how many newline characters are before the caret
    const lineBreaks = textBeforeCaret.match(/\n/g);
    const lineNumber = lineBreaks ? lineBreaks.length + 1 : 1;

    return lineNumber;
  }

  
    //Calculate the current column number based on the caret position.
   
  function calculateCurrentColumn(textarea) {
    const caretIndex = textarea.selectionStart;
    const textBeforeCaret = textarea.value.slice(0, caretIndex);

    // Find index of last newline before caret
    const lastNewlineIndex = textBeforeCaret.lastIndexOf("\n");

    // Column is characters after the last newline (or from start if no newline)
    const columnNumber =
      lastNewlineIndex === -1
        ? textBeforeCaret.length + 1
        : textBeforeCaret.length - lastNewlineIndex;

    return columnNumber;
  }

  
    // Update all status bar values: words, characters, line, column, and status
   
  function updateStatusBar() {
    const currentText = noteContentArea.value;

    const words = calculateWordCount(currentText);
    const characters = calculateCharacterCount(currentText);
    const lineNumber = calculateCurrentLine(noteContentArea);
    const columnNumber = calculateCurrentColumn(noteContentArea);

    statusWords.textContent = words;
    statusCharacters.textContent = characters;
    statusLine.textContent = lineNumber;
    statusColumn.textContent = columnNumber;

    // Update status message: empty note = Ready, otherwise Typing
    if (currentText.trim() === "") {
      statusMessage.textContent = "Ready";
    } else {
      statusMessage.textContent = "Typing";
    }
  }

  
    // Set status to "Saved".
    // You can call this later after you implement a Save feature.
   
  function setStatusSaved() {
    statusMessage.textContent = "Saved";
  }

  // Update status bar when user types in the note area
  noteContentArea.addEventListener("input", updateStatusBar);

  // Also update line/column when user clicks or moves the caret
  noteContentArea.addEventListener("click", updateStatusBar);
  noteContentArea.addEventListener("keyup", updateStatusBar);

  // Initialize status bar when the page loads
  updateStatusBar();
}