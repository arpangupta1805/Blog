import { ParsedContent } from "@/types/blog";

export class BlogParser {
  static parseContent(rawContent: string): ParsedContent[] {
    const lines = rawContent.split("\n");
    const parsedContent: ParsedContent[] = [];
    let currentContent = "";
    let pendingImage = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("/title ")) {
        if (currentContent) {
          parsedContent.push({
            type: "text",
            content: this.applyTextStyles(currentContent.trim()),
          });
          currentContent = "";
        }
        parsedContent.push({
          type: "title",
          content: line.substring(7),
        });
      } else if (line.startsWith("/subtitle ")) {
        if (currentContent) {
          parsedContent.push({
            type: "text",
            content: this.applyTextStyles(currentContent.trim()),
          });
          currentContent = "";
        }
        parsedContent.push({
          type: "subtitle",
          content: line.substring(10),
        });
      } else if (line.startsWith("/img ")) {
        if (currentContent) {
          parsedContent.push({
            type: "text",
            content: this.applyTextStyles(currentContent.trim()),
          });
          currentContent = "";
        }
        pendingImage = line.substring(5);
      } else if (line.startsWith("/imgcaption ")) {
        if (pendingImage) {
          parsedContent.push({
            type: "image",
            content: pendingImage,
            caption: line.substring(12),
          });
          pendingImage = "";
        }
      } else if (line.startsWith("/code")) {
        if (currentContent) {
          parsedContent.push({
            type: "text",
            content: this.applyTextStyles(currentContent.trim()),
          });
          currentContent = "";
        }
        // Collect code block content
        const codeLines = [];
        i++; // Move to next line
        while (i < lines.length && !lines[i].trim().startsWith("/")) {
          codeLines.push(lines[i]);
          i++;
        }
        i--; // Step back one line since the loop will increment
        parsedContent.push({
          type: "code",
          content: codeLines.join("\n"),
        });
      } else if (line.startsWith("/table")) {
        if (currentContent) {
          parsedContent.push({
            type: "text",
            content: this.applyTextStyles(currentContent.trim()),
          });
          currentContent = "";
        }
        // Collect table data
        const tableLines = [];
        i++; // Move to next line
        while (i < lines.length && !lines[i].trim().startsWith("/")) {
          if (lines[i].trim()) {
            tableLines.push(lines[i].trim());
          }
          i++;
        }
        i--; // Step back one line since the loop will increment

        if (tableLines.length > 0) {
          const headers = tableLines[0].split("|");
          const rows = tableLines.slice(1).map((row) => row.split("|"));
          parsedContent.push({
            type: "table",
            content: JSON.stringify({ headers, rows }),
          });
        } else {
          parsedContent.push({
            type: "table",
            content: JSON.stringify({
              headers: ["Column 1"],
              rows: [["No data"]],
            }),
          });
        }
      } else if (line !== "" || currentContent !== "") {
        if (pendingImage && !line.startsWith("/imgcaption")) {
          // Image without caption
          parsedContent.push({
            type: "image",
            content: pendingImage,
          });
          pendingImage = "";
        }
        currentContent += line + "\n";
      }
    }

    if (currentContent.trim()) {
      parsedContent.push({
        type: "text",
        content: this.applyTextStyles(currentContent.trim()),
      });
    }

    if (pendingImage) {
      parsedContent.push({
        type: "image",
        content: pendingImage,
      });
    }

    return parsedContent;
  }

  private static applyTextStyles(content: string): string {
    // Apply hyperlink formatting first (before other formatting)
    content = content.replace(
      /\\hyperlink\{([^}]+)\}\[([^\]]+)\]/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-600 hover:no-underline">$2</a>',
    );

    // Apply bold formatting
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Apply italic formatting
    content = content.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
    // Apply underline formatting
    content = content.replace(/__(.*?)__/g, "<u>$1</u>");
    // Convert line breaks to paragraphs
    content = content.replace(/\n\n+/g, "</p><p>");
    content = content.replace(/\n/g, "<br>");

    return `<p>${content}</p>`;
  }

  static truncateTitle(title: string, wordLimit: number = 30): string {
    const words = title.split(" ");
    if (words.length <= wordLimit) return title;
    return words.slice(0, wordLimit).join(" ") + "...";
  }
}
