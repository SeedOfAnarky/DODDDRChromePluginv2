document.addEventListener('DOMContentLoaded', function() {
  const checkbox = document.getElementById('autoEnable');
  const quizCheckbox = document.getElementById('autoQuiz');
  const statusDiv = document.getElementById('status');

  // Load saved preferences
  chrome.storage.sync.get(['autoEnable', 'autoQuiz'], function(data) {
    checkbox.checked = data.autoEnable || false;
    quizCheckbox.checked = data.autoQuiz || false;

    // If auto-quiz is enabled, add the Mod - QuizButton
    if (data.autoQuiz) {
      addModQuizButton();
    }
  });

  // Save checkbox states
  checkbox.addEventListener('change', function() {
    chrome.storage.sync.set({ 
      autoEnable: checkbox.checked 
    }, function() {
      statusDiv.textContent = 'Preference saved!';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  quizCheckbox.addEventListener('change', function() {
    chrome.storage.sync.set({ 
      autoQuiz: quizCheckbox.checked 
    }, function() {
      statusDiv.textContent = 'Quiz preference saved!';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);

      // If auto-quiz is enabled, add the Mod - QuizButton
      if (quizCheckbox.checked) {
        addModQuizButton();
      }
    });
  });

  // Enable button click handler
  document.getElementById('enableButton').addEventListener('click', async function() {
    // Code remains the same
  });

  // Enable quiz button handler
  document.getElementById('quizButton').addEventListener('click', async function() {
    addModQuizButton();
  });

  function addModQuizButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0].url.includes('doddsre.com/quiz')) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: function() {
            const form = document.querySelector('form');
            if (form) {
              // Add new button with modified name
              const button = document.createElement("input");
              button.type = "submit";
              button.name = "quiz_complete";
              button.value = "Mod - QuizButton";
              button.classList.add("complete-quiz-button");
              const resetButton = form.querySelector("input[name='quiz_reset']");
              if (resetButton) {
                resetButton.parentNode.insertBefore(button, resetButton.nextSibling);
              }

              // Set all radio buttons to false
              const radios = form.querySelectorAll('input[type="radio"]');
              radios.forEach(radio => radio.checked = radio.value === 'false');

              return true;
            }
            return false;
          }
        }, (results) => {
          statusDiv.textContent = results[0].result ? 'Mod - QuizButton added and radio buttons set to false!' : 'Quiz form not found';
          setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        });
      } else {
        statusDiv.textContent = 'Not on a quiz page';
        setTimeout(() => { statusDiv.textContent = ''; }, 2000);
      }
    });
  }
});