document.getElementById('fillAnswers').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: fillInBlanks
    });
  });
  
  function fillInBlanks() {
    const answers = {
      "Agency is the __ of every real estate transaction": "heart",
      "defines the roles and responsibilities of the __": "parties",
      "Agency is a __ in which one person": "relationship",
      "business dealings with third __": "parties",
      "A licensee __ expeditiously performs": "shall",
      "Salesperson or broker is not __ to have expertise": "required",
      "obtain the salesperson's or broker's __": "license",
      "Because of the __ closed approximately": "transaction",
      "statutory duties are owed by the brokerage to the __": "buyer"
    };
  
    for (const [phrase, answer] of Object.entries(answers)) {
      const elements = document.evaluate(
        `//text()[contains(., "${phrase}")]`,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
  
      for (let i = 0; i < elements.snapshotLength; i++) {
        const element = elements.snapshotItem(i);
        const parent = element.parentNode;
        const newHtml = element.textContent.replace(
          '__',
          `<span style="color: green; font-weight: bold;">${answer}</span>`
        );
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHtml;
        parent.replaceChild(wrapper, element);
      }
    }
  }