'use strict';

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const inputLine = document.getElementById('input-line');

// Focus input whenever terminal is clicked
document.addEventListener('click', () => {
  input.focus();
});

// Data
const data = {
  about: `Hello! I am Jyothish P S.
I'm an MCA graduate who enjoys turning ideas into real-world solutions through technology.
I'm passionate about building software, exploring AI/ML, and continuously learning new skills.
Location: Kerala, India (Perumbavoor, Ernakulam)
Birthday: January 8, 2005`,

  skills: `=== TECHNICAL SKILLS ===
[Frontend & Design]
- HTML5/CSS3   [█████████░] 90%
- Bootstrap    [████████░░] 80%
- Canva        [███████░░░] 70%

[Backend & Programming]
- Python       [█████████░] 90%
- Django       [████████░░] 80%
- C/C++        [████████░░] 80%
- PHP          [███████░░░] 70%`,

  experience: `=== EXPERIENCE ===
[AI ML Intern]
Elixir Softwares, Kaloor
May 2026 - July 2026

[Python Django Intern]
Progressive Software Solutions, Muvattupuzha
Dec 2024 - Apr 2025`,

  education: `=== EDUCATION ===
[Master of Computer Applications]
MACE, Kothamangalam (2025 - 2027)

[Bachelor of Computer Applications]
Nirmala College, Muvattupuzha (2022 - 2025)

[Plus Two - Computer Science]
MGM HSS, Kuruppampady (2020 - 2022)`,

  contact: `=== CONTACT INFO ===
Email:    <a href="mailto:jyothishparachalil@gmail.com">jyothishparachalil@gmail.com</a>
Phone:    <a href="tel:+919539728117">+91 953 972 8117</a>
LinkedIn: <a href="https://www.linkedin.com/in/jyothish-p-s-672057241/" target="_blank">linkedin.com/in/jyothish-p-s-672057241/</a>
GitHub:   <a href="https://github.com/jyothishps" target="_blank">github.com/jyothishps</a>
Instagram:<a href="https://www.instagram.com/j__y_o_t_h_i_s__h/" target="_blank">@j__y_o_t_h_i_s__h</a>`,

  credentials: `=== CERTIFICATIONS ===
- <a href="#" onclick="showCert('privacy-nptel.png', 'Privacy and Security in Online Social Media (NPTEL)'); return false;">Privacy and Security in Online Social Media (NPTEL)</a>
- <a href="#" onclick="showCert('dbms.png', 'Database Management System (NPTEL)'); return false;">Database Management System (NPTEL)</a>
- <a href="#" onclick="showCert('c.png', 'Problem solving through programming in C (NPTEL)'); return false;">Problem solving through programming in C (NPTEL)</a>
- <a href="#" onclick="showCert('introPy.png', 'Introduction to Python (DataCamp)'); return false;">Introduction to Python (DataCamp)</a>
- <a href="#" onclick="showCert('intermediatePy.png', 'Intermediate Python (DataCamp)'); return false;">Intermediate Python (DataCamp)</a>
- <a href="#" onclick="showCert('tcs.png', 'TCS iON Career Edge (TCS iON)'); return false;">TCS iON Career Edge (TCS iON)</a>
- <a href="#" onclick="showCert('freeCodeCamp.png', 'Responsive Web Design (freeCodeCamp)'); return false;">Responsive Web Design (freeCodeCamp)</a>
- <a href="#" onclick="showCert('excel.png', 'Advanced Excel (ICT Academy of Kerala)'); return false;">Advanced Excel (ICT Academy of Kerala)</a>`,

  projects: `=== MY PROJECTS ===
- <a href="#" onclick="showImage('project-1.jpg', 'IntelliPredict AI - ML Analysis System'); return false;">IntelliPredict AI</a> (Python, Scikit-Learn)
- <a href="#" onclick="showImage('project-2.png', 'Secure Django Portal'); return false;">Secure Django Portal</a> (Python, Django, SQLite)
- <a href="#" onclick="showImage('project-3.jpg', 'CLI System Scheduler'); return false;">CLI System Scheduler</a> (C++, OS Scheduling)
- <a href="#" onclick="showImage('project-4.png', 'Responsive vCard Theme'); return false;">Responsive vCard Theme</a> (HTML5, CSS3, JS)
- <a href="#" onclick="showImage('project-5.png', 'Database Query Tool'); return false;">Database Query Tool</a> (SQL, Python)`
};

const asciiWelcome = `
      _             _   _     _     _       ____  ____  
     | |           | | | |   (_)   | |     |  _ \\/ ___| 
     | |_   _  ___ | |_| |__  _ ___| |__   | |_) \\___ \\ 
 _   | | | | |/ _ \\| __| '_ \\| / __| '_ \\  |  __/ ___) |
| |__| | |_| | (_) | |_| | | | \\__ \\ | | | | |   |____/ 
 \\____/ \\__, |\\___/ \\__|_| |_|_|___/_| |_| |_|          
         __/ |                                          
        |___/                                           `;

const printLine = (text, className = '') => {
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  line.innerHTML = text; // using innerHTML to support links
  output.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
};

const printEcho = (cmd) => {
  printLine(`jyothish@portfolio:~$ ${cmd}`, 'command-echo');
};

let isTyping = false;

// Typewriter effect function
const typeLine = (text, className = '', speed = 10, callback = null) => {
  isTyping = true;
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  
  // Syntax Highlighting Phase (applied instantly before typewriter starts)
  let html = text;
  if (!className.includes('error') && !className.includes('command-echo')) {
    html = html.replace(/=== (.*?) ===/g, '<span class="hl-title">=== $1 ===</span>');
    html = html.replace(/\[([^█░\n]*?)\]/g, '<span class="hl-bracket">[$1]</span>');
    html = html.replace(/\[([█░]+)\]/g, '<span class="hl-bar">[$1]</span>');
    html = html.replace(/^- (.*)/gm, '<span class="hl-bullet">- </span><span class="hl-item">$1</span>');
  }
  line.innerHTML = html;
  output.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;

  // Find all text nodes recursively
  const textNodes = [];
  const getTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      for (let child of node.childNodes) {
        getTextNodes(child);
      }
    }
  };
  getTextNodes(line);

  // Store original texts and clear text nodes
  const originalTexts = textNodes.map(node => {
    const txt = node.textContent;
    node.textContent = '';
    return txt;
  });

  // Animate text nodes character by character
  let nodeIndex = 0;
  let charIndex = 0;

  const typeNextChar = () => {
    if (nodeIndex >= textNodes.length) {
      isTyping = false;
      if (callback) callback();
      return;
    }

    const currentNode = textNodes[nodeIndex];
    const originalText = originalTexts[nodeIndex];

    // Handle empty text nodes safely
    if (originalText.length === 0) {
      nodeIndex++;
      typeNextChar();
      return;
    }

    currentNode.textContent += originalText.charAt(charIndex);
    terminal.scrollTop = terminal.scrollHeight;
    charIndex++;

    if (charIndex >= originalText.length) {
      nodeIndex++;
      charIndex = 0;
    }

    setTimeout(typeNextChar, speed);
  };

  typeNextChar();
};

const executeCommand = (cmd) => {
  const cleanCmd = cmd.trim().toLowerCase();
  
  if (cleanCmd === '') return;
  
  printEcho(cleanCmd);

  switch(cleanCmd) {
    case 'start':
      typeLine(`Available commands:
  whoami      - Display my introduction
  skills      - List technical skills
  projects    - View my personal projects
  experience  - Show work history
  education   - Show academic background
  credentials - Show certifications
  contact     - Display contact information
  clear       - Clear the terminal screen

Hint: You can also click the commands below if you prefer not to type.`);
      
      // Inject clickable buttons for recruiters
      setTimeout(() => {
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'btns-container';
        ['whoami', 'skills', 'projects', 'experience', 'education', 'credentials', 'contact', 'clear'].forEach(c => {
          const btn = document.createElement('button');
          btn.className = 'cmd-btn';
          btn.innerText = c;
          btn.onclick = () => {
            if (isTyping) return;
            input.value = '';
            executeCommand(c);
          };
          btnsDiv.appendChild(btn);
        });
        output.appendChild(btnsDiv);
        terminal.scrollTop = terminal.scrollHeight;
      }, 500);
      break;
    
    case 'whoami':
    case 'about':
      typeLine(data.about);
      break;
      
    case 'skills':
      typeLine(data.skills);
      break;
      
    case 'experience':
      typeLine(data.experience);
      break;
      
    case 'education':
      typeLine(data.education);
      break;

    case 'credentials':
    case 'certs':
      typeLine(data.credentials);
      break;
      
    case 'projects':
      typeLine(data.projects);
      break;

    case 'contact':
      typeLine(data.contact);
      break;
      
    case 'clear':
      output.innerHTML = '';
      break;
      
    case 'sudo':
      typeLine('nice try. This incident will be reported.', 'error');
      break;
      
    default:
      // Prevent multiple typeLines from overlapping the isTyping lock
      isTyping = true;
      const line1 = document.createElement('div');
      line1.className = 'output-line error';
      line1.textContent = `bash: ${cleanCmd}: command not found`;
      output.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.className = 'output-line';
      line2.textContent = `Type 'start' to see a list of available commands.`;
      output.appendChild(line2);
      
      terminal.scrollTop = terminal.scrollHeight;
      isTyping = false;
  }
};

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent default enter behavior just in case
    if (isTyping) return; // Prevent spamming while typing
    const cmd = input.value;
    input.value = '';
    executeCommand(cmd);
  }
});

const bootSequence = [
  "BIOS Date 06/30/26 21:50:00 Ver 08.00.15",
  "CPU: GenuineIntel(R) CPU @ 3.40GHz",
  "Speed: 3.40 GHz",
  "Press DEL to run Setup",
  "Press F8 for BBS POPUP",
  "Initializing USB Controllers .. Done.",
  "2048MB OK",
  "Auto-Detecting Pri Master..IDE Hard Disk",
  "Auto-Detecting Pri Slave...Not Detected",
  "Pri Master: 3.M.A WDC WD2500AAJS-00VTA0",
  "Ultra DMA Mode-5, S.M.A.R.T. Capable and Status OK",
  "Booting from Hard Disk...",
  "Loading Kernel... OK",
  "Mounting File System... OK",
  "Bypassing Mainframe... SUCCESS"
];

// Boot sequence
window.onload = () => {
  input.disabled = true;
  
  let delay = 0;
  bootSequence.forEach((line, index) => {
    setTimeout(() => {
      printLine(line);
      if (index === bootSequence.length - 1) {
        setTimeout(() => {
          // Clear the boot logs
          output.innerHTML = '';
          
          // Print the ASCII logo
          printLine(asciiWelcome, "ascii-art");
          
          // Print centered welcome text
          printLine("MCA Student<br>Type 'start' to explore.", "welcome-subtitle");
          
          // Show the input prompt
          inputLine.classList.add('visible');
          input.disabled = false;
          input.focus();
        }, 800);
      }
    }, delay);
    // Random delay between 20ms and 150ms per line to simulate real loading
    delay += Math.floor(Math.random() * 130) + 20; 
  });
};

// --- MATRIX RAIN BACKGROUND ---
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*]*'.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lastWidth = window.innerWidth;
  }
});

// Certificate Modal Logic
const modal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close-modal');

window.showCert = (imgName, certTitle) => {
  modalImg.src = `./assets/images/${imgName}`;
  modalTitle.textContent = certTitle;
  modal.classList.add('visible');
};
window.showImage = window.showCert;

const hideModal = () => {
  modal.classList.remove('visible');
};

closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});