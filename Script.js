const japaneseMap = {
    'a': 'ka', 'b': 'zu', 'c': 'mi', 'd': 'te', 'e': 'ku',
    'f': 'lu', 'g': 'ji', 'h': 'ri', 'i': 'ki', 'j': 'zu',
    'k': 'me', 'l': 'ta', 'm': 'rin', 'n': 'to', 'o': 'mo',
    'p': 'no', 'q': 'ke', 'r': 'shi', 's': 'ari', 't': 'chi',
    'u': 'do', 'v': 'ru', 'w': 'me', 'x': 'na', 'y': 'fu',
    'z': 'zi'
};

const inputField = document.getElementById('nameInput');
const outputField = document.getElementById('output');
const speakBtn = document.getElementById('speakBtn');

let typingTimeout;

function convertName() {
    const name = inputField.value.toLowerCase();
    let convertedName = '';

    clearTimeout(typingTimeout);

    for (let i = 0; i < name.length; i++) {
        const char = name[i];

        if (japaneseMap[char]) {
            // Added a space after each syllable for readability (e.g., "ka ri na")
            convertedName += japaneseMap[char];
        } else if (char === ' ') {
            convertedName += ' ';
        } else {
            convertedName += char;
        }
    }

    if (name.length === 0) {
        outputField.innerText = "---";
        outputField.classList.remove('typing-cursor');
        outputField.style.opacity = "0.5";
    } else {
        outputField.classList.add('typing-cursor');
        outputField.style.opacity = "1";
        outputField.innerText = convertedName.trim();

        typingTimeout = setTimeout(() => {
            outputField.classList.remove('typing-cursor');
        }, 1000);
    }
}

function speakText() {
    const text = outputField.innerText;

    if (text === "---" || text === "") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    // Try to find a Japanese voice
    const japaneseVoice = voices.find(voice => voice.lang.includes('ja'));

    if (japaneseVoice) {
        utterance.voice = japaneseVoice;
        utterance.lang = 'ja-JP';
    } else {
        utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);

    speakBtn.style.transform = "scale(0.9) rotate(-10deg)";
    setTimeout(() => speakBtn.style.transform = "scale(1) rotate(0deg)", 150);
}

inputField.addEventListener('input', convertName);
speakBtn.addEventListener('click', speakText);

window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};