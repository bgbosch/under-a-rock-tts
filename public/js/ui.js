const createClipEditor = (clip) => {
    const clipEditor = document.createElement('div');
    clipEditor.className = 'clip-editor';
    clipEditor.innerHTML = `
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