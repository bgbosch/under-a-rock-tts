
// Initialize voice selection
document.getElementById('voice').addEventListener('change', (event) => {
    localStorage.setItem('selectedVoice', event.target.value);
});

window.speechSynthesis.onvoiceschanged = populateVoices;
populateVoices();

// Handle file upload
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const content = await file.text();
    currentClips = parseContent(content, file.name);
    
    // Use the new function to organize clips into separate windows
    organizeClipsIntoWindows(currentClips);

    // Add Play All button if it doesn't exist
    const globalActions = document.querySelector('.global-actions');
    if (!globalActions.querySelector('.play-all')) {
        globalActions.insertBefore(createPlayAllButton(), globalActions.firstChild);
    }
});
