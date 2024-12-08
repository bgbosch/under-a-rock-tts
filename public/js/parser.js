const parseContent = (content, fileName) => {
    if (fileName.toLowerCase().endsWith('.srt')) {
        return parseSRT(content);
    } else {
        return parseTXT(content);
    }
};

const parseSRT = (content) => {
    const blocks = content.trim().split('\n\n');
    return blocks.map((block) => {
        const lines = block.split('\n');
        const id = lines[0];
        const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
        const text = lines.slice(2).join('\n');

        return {
            id,
            text,
            startTime: timeMatch?.[1] || "00:00:00,000",
            endTime: timeMatch?.[2] || "00:00:00,000",
        };
    });
};

const parseTXT = (content) => {
    const paragraphs = content.split(/\n\s*\n/);
    return paragraphs.map((text, index) => ({
        id: String(index + 1),
        text: text.trim(),
        startTime: "00:00:00,000",
        endTime: "00:00:00,000",
    }));
};