interface TextClip {
  id: string;
  text: string;
  startTime?: string;
  endTime?: string;
}

export const parseContent = (content: string, fileName: string): TextClip[] => {
  if (fileName.toLowerCase().endsWith('.srt')) {
    return parseSRT(content);
  } else {
    return parseTXT(content);
  }
};

const parseSRT = (content: string): TextClip[] => {
  const blocks = content.trim().split('\n\n');
  return blocks.map((block) => {
    const lines = block.split('\n');
    const id = lines[0];
    const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
    const text = lines.slice(2).join('\n');

    return {
      id,
      text,
      startTime: timeMatch?.[1],
      endTime: timeMatch?.[2],
    };
  });
};

const parseTXT = (content: string): TextClip[] => {
  const paragraphs = content.split(/\n\s*\n/);
  return paragraphs.map((text, index) => ({
    id: String(index + 1),
    text: text.trim(),
  }));
};