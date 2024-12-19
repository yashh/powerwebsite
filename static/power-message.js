const paragraphs = [
  {
    text: "Power uses BANK TO BANK transfers.",
    highlights: [{ start: 11, end: 23, className: "highlight-1" }],
  },
  {
    text: "Credit card issuers take over $150 billion yearly using BANK TO FEES TO BANK transfers.",
    highlights: [{ start: 56, end: 76, className: "highlight-2" }],
  },
  {
    text: "They call them interchange fees ... We call them a clever way to make you pay more for the same stuff while giving you â€œrewards.â€ Because who wouldnâ€™t want cash back on the 2.5% they just squeezed out of your payment? ",
    highlights: [],
  },
  {
    text: "Wouldnâ€™t it be nice if your money was ... yours?",
    highlights: [
      {
        start: 42,
        end: 49,
        link: "https://www.threads.net/@nowthisimpact/post/DCpsFaNK9EB?xmt=AQGzcWVzNw6ZdA2-pJFsVGDffyC8lwgOu6XX7qLCoiHE9Q",
        className: "yours-link",
      },
    ],
  },
];

const typingSpeed = 20; // Typing speed in ms
const paragraphPause = 1000; // Pause between paragraphs in ms
const typingTextElement = document.getElementById("typingText");

// Function to simulate typing
async function typeText() {
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];

    // Create a paragraph container for each paragraph
    const paragraphElement = document.createElement("div");
    paragraphElement.className = "paragraph"; // Add spacing via CSS

    // Set text color based on paragraph position
    paragraphElement.style.color = i === 0 ? "#FFFFFF" : "#868686"; // White for the first paragraph, grey for the rest
    typingTextElement.appendChild(paragraphElement);

    // Type out the paragraph inside the container
    await typeParagraph(p.text, p.highlights, paragraphElement);

    // Pause before typing the next paragraph
    await pause(paragraphPause);
  }
}

// Helper function to type a paragraph with highlights
function typeParagraph(text, highlights, container) {
  return new Promise((resolve) => {
    let index = 0;
    let elements = [];

    // Preconstruct spans and text nodes for the paragraph
    highlights.sort((a, b) => a.start - b.start); // Ensure highlights are sorted
    let lastIndex = 0;

    highlights.forEach((h) => {
      // Add text before the highlight
      if (h.start > lastIndex) {
        elements.push({
          type: "text",
          content: text.slice(lastIndex, h.start),
        });
      }
      // Add the highlighted text
      elements.push({
        type: h.link ? "link" : "highlight",
        content: text.slice(h.start, h.end),
        className: h.className || "",
        link: h.link || "",
      });
      lastIndex = h.end;
    });

    // Add remaining text after the last highlight
    if (lastIndex < text.length) {
      elements.push({ type: "text", content: text.slice(lastIndex) });
    }

    // Typing effect
    let elementIndex = 0,
      charIndex = 0;
    let currentElement = null;

    const interval = setInterval(() => {
      if (elementIndex < elements.length) {
        const el = elements[elementIndex];

        if (!currentElement) {
          // Create a new element to type into
          if (el.type === "text") {
            currentElement = document.createTextNode("");
            container.appendChild(currentElement);
          } else if (el.type === "highlight") {
            currentElement = document.createElement("span");
            currentElement.className = el.className;
            container.appendChild(currentElement);
          } else if (el.type === "link") {
            currentElement = document.createElement("a");
            currentElement.href = el.link;
            currentElement.target = "_blank";
            currentElement.className = el.className;
            container.appendChild(currentElement);
          }
        }

        // Type one character at a time
        currentElement.textContent += el.content.charAt(charIndex);
        charIndex++;

        // If we finish the current element, move to the next one
        if (charIndex >= el.content.length) {
          currentElement = null;
          charIndex = 0;
          elementIndex++;
        }
      } else {
        clearInterval(interval);
        resolve();
      }
    }, typingSpeed);
  });
}

// Helper function to pause between paragraphs
function pause(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// Start the typing effect
typeText();
