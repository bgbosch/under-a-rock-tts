export const handleSpeechSynthesis = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoiceName = sessionStorage.getItem('selectedVoice');
  if (selectedVoiceName) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) utterance.voice = voice;
  }
  return utterance;
};

export const downloadTextFile = (content: string, fileName: string) => {
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