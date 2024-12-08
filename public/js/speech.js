const handleSpeechSynthesis = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceName = localStorage.getItem('selectedVoice');
    if (selectedVoiceName) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) utterance.voice = voice;
    }
    return utterance;
};

const populateVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voice');
    voiceSelect.innerHTML = '';
    
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    const lastUsedVoice = localStorage.getItem('selectedVoice');
    
    if (lastUsedVoice && voices.some(v => v.name === lastUsedVoice)) {
        voiceSelect.value = lastUsedVoice;
    } else {
        const defaultVoice = voices.find(voice => voice.default);
        if (defaultVoice) {
            voiceSelect.value = defaultVoice.name;
            localStorage.setItem('selectedVoice', defaultVoice.name);
        }
    }
};