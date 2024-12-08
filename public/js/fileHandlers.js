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

const downloadTXT = () => {
    const clips = getCurrentClipsState();
    const content = clips.map(clip => clip.text).join('\n\n');
    downloadTextFile(content, 'script.txt');
};

const downloadSRT = () => {
    const clips = getCurrentClipsState();
    const content = clips.map(clip => (
        `${clip.id}\n${clip.startTime} --> ${clip.endTime}\n${clip.text}\n\n`
    )).join('');
    downloadTextFile(content, 'script.srt');
};