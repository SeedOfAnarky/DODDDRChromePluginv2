document.getElementById('debugButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('Debug button clicked');
      
      const quizBoxes = document.querySelectorAll('.su-box-content');
      console.log(`Found ${quizBoxes.length} quiz boxes`);
      
      function getAnswers(boxText) {
        // Get the full question text
        const questionMatch = boxText.match(/Fill in the Blank:\s*(.*?)(?=\s*$)/);
        if (!questionMatch) return null;
        
        console.log('Question:', questionMatch[1]);
        
        // Match patterns to determine answers
        if (boxText.includes('Agency is the')) return ['heart', 'parties'];
        if (boxText.includes('Agency is a')) return ['relationship', 'parties'];
        if (boxText.includes('A licensee')) return ['shall'];
        if (boxText.includes('Salesperson or broker is not')) return ['required', 'license'];
        if (boxText.includes('Because of the')) return ['transaction', 'buyer'];
        return null;
      }

      quizBoxes.forEach((box, index) => {
        const answers = getAnswers(box.textContent);
        const inputs = box.querySelectorAll('input');
        
        if (answers && inputs.length > 0) {
          console.log(`Box ${index + 1} answers:`, answers);
          inputs.forEach((input, inputIndex) => {
            if (answers[inputIndex]) {
              input.value = answers[inputIndex];
              input.style.color = 'green';
              input.style.fontWeight = 'bold';
            }
          });
        }
      });
    }
  });
});