//paste all below into devtools console!
(function () {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Create GUI container
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.right = '20px';
  panel.style.zIndex = 9999;
  panel.style.background = '#1e1e1e';
  panel.style.color = '#fff';
  panel.style.padding = '12px';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  panel.style.fontFamily = 'monospace';
  panel.style.width = '320px';

  const title = document.createElement('div');
  title.innerText = 'turinglab-inator™';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '8px';
  panel.appendChild(title);

  const logBox = document.createElement('div');
  logBox.style.height = '160px';
  logBox.style.overflowY = 'auto';
  logBox.style.background = '#111';
  logBox.style.border = '1px solid #444';
  logBox.style.padding = '8px';
  logBox.style.marginBottom = '10px';
  logBox.style.fontSize = '12px';
  logBox.style.whiteSpace = 'pre-wrap';
  panel.appendChild(logBox);

  function log(msg) {
    logBox.textContent += msg + '\n';
    logBox.scrollTop = logBox.scrollHeight;
  }

  // Solve MCQs
  async function solveMCQs() {
    const mcqs = document.querySelectorAll('.inline-mcq');
    let solvedCount = 0;
    let alreadyCorrect = 0;
    
    for (const mcq of mcqs) {
      const label = mcq.querySelector('span[id$="-label"]');
      if (label && label.classList.contains('mcq-correct')) {
        alreadyCorrect++;
        continue;
      }

      const buttons = mcq.querySelectorAll('button.inline-mcq-option');
      for (const btn of buttons) {
        btn.click();
        await delay(200);
        if (label && label.classList.contains('mcq-correct')) {
          solvedCount++;
          break;
        }
      }
    }
    
    return { solved: solvedCount, alreadyCorrect };
  }

  // Solve Text Inputs
  async function solveTextInputs() {
    const inputs = document.querySelectorAll('input[oninput]');
    let solvedCount = 0;
    let unsureCount = 0;
    
    for (const input of inputs) {
      const code = input.getAttribute('oninput');
      const match = code.match(/'([^']+)'/); // Find the answer string
      if (!match) continue;

      const answer = match[1].split(',,')[0].trim(); // First valid answer
      input.value = answer;
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await delay(200);
      if (input.classList.contains('inline-input-correct')) {
        solvedCount++;
      } else {
        unsureCount++;
      }
    }
    
    return { solved: solvedCount, unsure: unsureCount };
  }

  // Solve Checkboxes
  async function solveCheckboxes() {
    const checkboxes = document.querySelectorAll('.inline-checkbox');
    let solvedCount = 0;
    
    for (const checkbox of checkboxes) {
      // Skip if already correct
      if (checkbox.classList.contains('checkbox-correct')) {
        continue;
      }
      
      // Determine if this checkbox should be checked based on its ID
      const shouldCheck = checkbox.id.includes('[x]');
      
      // Only change if needed
      if (checkbox.checked !== shouldCheck) {
        checkbox.checked = shouldCheck;
        
        // Trigger the change event
        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
        
        solvedCount++;
        await delay(200);
      }
    }
    
    return solvedCount;
  }

  const button = document.createElement('button');
  button.innerText = 'get the answers shinji';
  button.style.padding = '6px 12px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.background = '#4CAF50';
  button.style.color = '#fff';
  button.style.cursor = 'pointer';
  button.onclick = async function () {
    log('Starting solver...');
    
    // Solve all question types
    const mcqResults = await solveMCQs();
    const textResults = await solveTextInputs();
    const checkboxCount = await solveCheckboxes();
    
    // Log results
    log('\nResults:');
    log(`solved ${mcqResults.solved} MCQs (${mcqResults.alreadyCorrect} already correct dumah)`);
    log(`solved ${textResults.solved} text inputs (${textResults.unsure} unsure; if any unsure press green button)`);
    log(`solved ${checkboxCount} checkboxes`);
    log(`program cant solve buttons...`);
    log('\ndone');
  };
  panel.appendChild(button);

  const close = document.createElement('div');
  close.innerText = '×';
  close.style.position = 'absolute';
  close.style.top = '6px';
  close.style.right = '10px';
  close.style.cursor = 'pointer';
  close.style.fontWeight = 'bold';
  close.onclick = () => panel.remove();
  panel.appendChild(close);

  document.body.appendChild(panel);
})();