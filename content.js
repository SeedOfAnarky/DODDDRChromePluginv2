function enableButton() {
  console.log('enableButton function called');
  const footer = document.querySelector('footer');
  if (footer) {
    console.log('Footer found');
    const button = footer.querySelector('a.button.disabled');
    if (button) {
      console.log('Disabled button found');
      button.classList.remove('disabled');
      button.removeAttribute('disabled');
    }
  }
}

function handleQuiz() {
  console.log('handleQuiz called');
  if (window.location.href.includes('doddsre.com/quiz')) {
    // Add complete quiz button
    const form = document.querySelector("form");
    if (form && !form.querySelector('input[name="quiz_complete"]')) {
      const button = document.createElement("input");
      button.type = "submit";
      button.name = "quiz_complete";
      button.value = "Complete Quiz";
      button.classList.add("complete-quiz-button");
      const resetButton = form.querySelector("input[name='quiz_reset']");
      if (resetButton) {
        resetButton.parentNode.insertBefore(button, resetButton.nextSibling);
      }
    }

    // Set all radio buttons to false initially
    const radios = document.querySelectorAll('input[type="radio"][value="false"]');
    radios.forEach(radio => radio.checked = true);

    // Listen for quiz completion
    form.addEventListener('submit', async (e) => {
      if (e.submitter.name === 'quiz_complete') {
        // After form submission, look for correct answers
        setTimeout(() => {
          const correctAnswers = document.querySelectorAll('.answer_message');
          correctAnswers.forEach(answer => {
            if (answer.textContent.includes('Right Answer: True')) {
              const questionDiv = answer.closest('li');
              const trueRadio = questionDiv.querySelector('input[value="true"]');
              if (trueRadio) trueRadio.checked = true;
            }
          });
        }, 1000);
      }
    });
  }
}

// Check auto settings on page load
chrome.storage.sync.get(['autoEnable', 'autoQuiz'], function(data) {
  if (data.autoEnable) enableButton();
  if (data.autoQuiz) handleQuiz();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'enableQuizButton') {
    handleQuiz();
  }
});