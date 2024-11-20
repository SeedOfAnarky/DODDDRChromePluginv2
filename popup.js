document.addEventListener('DOMContentLoaded', function() {
  const checkbox = document.getElementById('autoEnable');
  const quizCheckbox = document.getElementById('autoQuiz');
  const statusDiv = document.getElementById('status');
  
  // Load saved preferences
  chrome.storage.sync.get(['autoEnable', 'autoQuiz'], function(data) {
    checkbox.checked = data.autoEnable || false;
    quizCheckbox.checked = data.autoQuiz || false;
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
    });
  });

  // Enable button click handler
  document.getElementById('enableButton').addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab.url.includes('doddsre.com/lesson')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          const footer = document.querySelector('footer');
          if (footer) {
            const button = footer.querySelector('a.button.disabled');
            if (button) {
              button.classList.remove('disabled');
              button.removeAttribute('disabled');
              return true;
            }
          }
          return false;
        }
      }, (results) => {
        if (results[0].result) {
          statusDiv.textContent = 'Button enabled!';
        } else {
          statusDiv.textContent = 'Button not found';
        }
        setTimeout(() => { statusDiv.textContent = ''; }, 2000);
      });
    } else {
      statusDiv.textContent = 'Not on a lesson page';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    }
  });

  // Enable quiz button handler
  document.getElementById('quizButton').addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab.url.includes('doddsre.com/quiz')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          const form = document.querySelector('form');
          if (form) {
            const button = document.createElement('input');
            button.type = 'submit';
            button.name = 'quiz_complete';
            button.value = 'Complete Quiz';
            const resetButton = document.querySelector('input[name="quiz_reset"]');
            if (resetButton) {
              resetButton.parentNode.insertBefore(button, resetButton);
              return true;
            }
          }
          return false;
        }
      }, (results) => {
        if (results[0].result) {
          statusDiv.textContent = 'Quiz button added!';
        } else {
          statusDiv.textContent = 'Quiz form not found';
        }
        setTimeout(() => { statusDiv.textContent = ''; }, 2000);
      });
    } else {
      statusDiv.textContent = 'Not on a quiz page';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    }
  });
});