function fillInBlanks() {
    console.log('fillInBlanks function started');
  
    const answers = [
      {
        before: "Agency is the",
        after: "of every",
        answer: "heart"
      },
      {
        before: "defines the roles and responsibilities of the",
        after: ".",
        answer: "parties"
      },
      {
        before: "Agency is a",
        after: "in which",
        answer: "relationship"
      },
      {
        before: "business dealings with third",
        after: ".",
        answer: "parties"
      },
      {
        before: "A licensee",
        after: "expeditiously",
        answer: "shall"
      },
      {
        before: "Salesperson or broker is not",
        after: "to have",
        answer: "required"
      },
      {
        before: "broker's",
        after: ".",
        answer: "license"
      },
      {
        before: "Because of the",
        after: "closed",
        answer: "transaction"
      },
      {
        before: "brokerage to the",
        after: ".",
        answer: "buyer"
      }
    ];
  
    const quizBoxes = document.querySelectorAll('.su-box-content');
    console.log(`Found ${quizBoxes.length} quiz boxes`);
  
    quizBoxes.forEach((box, index) => {
      console.log(`Processing box ${index + 1}`);
      const text = box.innerHTML;
      
      answers.forEach(({before, after, answer}) => {
        if (text.includes(before) && text.includes(after)) {
          console.log(`Found match: ${before}___${after}`);
          const regex = new RegExp(`(${before})\\s+(${after})`, 'g');
          box.innerHTML = text.replace(regex, `$1 <span style="color: green; font-weight: bold;">${answer}</span> $2`);
        }
      });
    });
  }
  
  // Execute immediately
  console.log('Content script loaded');
  fillInBlanks();
  
  // Add click handler for debugging
  document.addEventListener('click', (e) => {
    console.log('Click detected:', e.target);
  });