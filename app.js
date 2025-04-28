// BaC-v2.5 - Betterward as Collaborators Council Mode

let memory = {
    userInput: "",
    aiResponses: {},
    chairSynthesis: "",
    timestamp: new Date().toISOString()
};

let conversationState = 0;

const prompts = [
    "Hi, I'm Lorem, the Default Face of Betterward Collaboration. Where are you now in your life, in your own words?",
    "Where would you like to go?",
    "Thank you. Describe any paths you believe might get you from here to there.",
    "Logged. Would you like the Council to deliberate on this?"
];

function appendMessage(text, sender) {
    const chatbox = document.getElementById("chatbox");
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.innerText = text;
    chatbox.appendChild(message);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function processInput() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    appendMessage(text, "user");
    input.value = "";

    if (conversationState < 3) {
        if (conversationState === 0) memory.userInput = text;
        setTimeout(() => appendMessage(prompts[conversationState + 1], "system"), 500);
        conversationState++;
    } else {
        if (text.toLowerCase().includes("yes")) {
            await startCouncilDeliberation();
        } else {
            appendMessage("Understood. No council deliberation initiated.", "system");
        }
        conversationState = 0;
        setTimeout(() => appendMessage(prompts[0], "system"), 1000);
    }
}

async function startCouncilDeliberation() {
    appendMessage("Council is deliberating...", "system");

    const gptResponse = await queryOpenAI(memory.userInput);
    const claudeResponse = await queryClaude(memory.userInput);

    memory.aiResponses["GPT-4"] = gptResponse;
    memory.aiResponses["Claude"] = claudeResponse;

    const chairPrompt = `
Two AI advisors have offered suggestions:

Advisor 1 (GPT-4): ${gptResponse}

Advisor 2 (Claude): ${claudeResponse}

As Chair, please synthesize these into a coherent, clear, actionable menu of options for the user.
`;

    const chairReply = await queryOpenAI(chairPrompt);
    memory.chairSynthesis = chairReply;

    appendMessage(chairReply, "system");
    saveMemory();
}

async function queryOpenAI(promptText) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: promptText }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

async function queryClaude(promptText) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}` // Using OpenAI as a placeholder
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: "(Simulated Claude Reply) " + promptText }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function saveMemory() {
    fetch('/save-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory)
    })
    .then(response => response.text())
    .then(data => {
        appendMessage("Council deliberation saved.", "system");
    })
    .catch(error => {
        console.error('Save error:', error);
    });
}

// Initialize Lorem
window.onload = () => {
    setTimeout(() => appendMessage(prompts[0], "system"), 1000);
};
