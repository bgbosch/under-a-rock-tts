const parseContent = (content, fileName) => {
    if (fileName.toLowerCase().endsWith('.srt')) {
        return parseSRT(content);
    } else {
        return parseTXT(content);
    }
};

const parseSRT = (content) => {
    // First normalize all line endings to \n
    const normalizedContent = content
        .replace(/\r\n/g, '\n')  // Convert CRLF to LF
        .replace(/\r/g, '\n');   // Convert remaining CR to LF
    
    // Split into blocks using normalized line endings
    const blocks = normalizedContent.split(/\n\n+/);
    
    return blocks.map((block) => {
        // Split block into lines, filtering out empty lines
        const lines = block.split('\n').filter(line => line.trim());
        if (lines.length < 2) return null; // Skip invalid blocks
        
        const id = lines[0];
        const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
        const text = lines.slice(2).join('\n');

        if (!timeMatch) return null; // Skip blocks with invalid time format

        return {
            id,
            text,
            startTime: timeMatch[1],
            endTime: timeMatch[2],
        };
    }).filter(Boolean); // Remove null entries
};

const parseTXT = (content) => {
    // Normalize line endings for TXT files as well
    const normalizedContent = content
        .replace(/\r\n/g, '\n')  // Convert CRLF to LF
        .replace(/\r/g, '\n');   // Convert remaining CR to LF
    
    const paragraphs = normalizedContent.split(/\n\s*\n/);
    return paragraphs.map((text, index) => ({
        id: String(index + 1),
        text: text.trim(),
        startTime: "00:00:00,000",
        endTime: "00:00:00,000",
    }));
};