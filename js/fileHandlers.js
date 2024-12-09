const downloadTextFile = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

let currentClips = [];
let originalFileName = ''; // Store the original filename

const getCurrentClipsState = () => {
    const clipsContainer = document.getElementById('clips-container');
    const clipEditors = clipsContainer.querySelectorAll('.clip-editor');
    
    return Array.from(clipEditors).map((editor, index) => ({
        id: String(index + 1),
        text: editor.querySelector('textarea').value,
        startTime: editor.querySelector('.start-time').value,
        endTime: editor.querySelector('.end-time').value
    }));
};

// Update main.js event listener to store the filename
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    originalFileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const content = await file.text();
    currentClips = parseContent(content, file.name);
    
    const container = document.getElementById('clips-container');
    container.innerHTML = '';
    
    currentClips.forEach(clip => {
        container.appendChild(createClipEditor(clip));
    });
});

const downloadTXT = () => {
    const clips = getCurrentClipsState();
    const content = clips.map(clip => clip.text).join('\n\n');
    const fileName = originalFileName ? `${originalFileName}.txt` : 'script.txt';
    downloadTextFile(content, fileName);
};

const downloadSRT = () => {
    const clips = getCurrentClipsState();
    const content = clips.map(clip => (
        `${clip.id}\n${clip.startTime} --> ${clip.endTime}\n${clip.text}\n\n`
    )).join('');
    const fileName = originalFileName ? `${originalFileName}.srt` : 'script.srt';
    downloadTextFile(content, fileName);
};