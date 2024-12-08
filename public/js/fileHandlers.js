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

const downloadTXT = () => {
    const content = currentClips.map(clip => clip.text).join('\n\n');
    downloadTextFile(content, 'script.txt');
};

const downloadSRT = () => {
    const content = currentClips.map(clip => (
        `${clip.id}\n${clip.startTime} --> ${clip.endTime}\n${clip.text}\n\n`
    )).join('');
    downloadTextFile(content, 'script.srt');
};