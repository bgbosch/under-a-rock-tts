
const createClipEditor = (clip) => {
    const clipEditor = document.createElement('div');
    clipEditor.className = 'clip-editor';
    clipEditor.innerHTML = `
        <div class="clip-header">
            <span class="clip-number">Clip #${clip.id}</span>
        </div>
        <div class="time-inputs">
            <div class="time-input">
                <label>Start Time</label>
                <input type="text" class="start-time" value="${clip.startTime}" />
            </div>
            <div class="time-input">
                <label>End Time</label>
                <input type="text" class="end-time" value="${clip.endTime}" />
            </div>
        </div>
        <textarea>${clip.text}</textarea>
        <div class="actions">
            <button class="play">▶ Play</button>
        </div>
    `;

    const textarea = clipEditor.querySelector('textarea');
    const playButton = clipEditor.querySelector('.play');

    playButton.addEventListener('click', () => {
        const utterance = handleSpeechSynthesis(textarea.value);
        window.speechSynthesis.speak(utterance);
    });

    return clipEditor;
};

const createPlayAllButton = () => {
    const button = document.createElement('button');
    button.className = 'outline-button play-all';
    button.textContent = '▶ Play All';
    button.onclick = playAllClips;
    return button;
};

const playAllClips = () => {
    const clips = getCurrentClipsState();
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    let currentIndex = 0;
    
    const speakNext = () => {
        if (currentIndex < clips.length) {
            const utterance = handleSpeechSynthesis(clips[currentIndex].text);
            utterance.onend = () => {
                currentIndex++;
                speakNext();
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    speakNext();
};

// Create a clip window container
const createClipWindow = (clip) => {
    const clipWindow = document.createElement('div');
    clipWindow.className = 'clip-window';
    
    const clipEditor = createClipEditor(clip);
    clipWindow.appendChild(clipEditor);
    
    return clipWindow;
};

// Organize clips into separate windows
const organizeClipsIntoWindows = (clips) => {
    const container = document.getElementById('clips-container');
    container.innerHTML = '';
    
    clips.forEach(clip => {
        const clipWindow = createClipWindow(clip);
        container.appendChild(clipWindow);
    });
};
