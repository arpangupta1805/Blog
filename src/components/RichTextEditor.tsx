import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Image,
  Upload,
  Code,
  Table,
  Type,
  FileText,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ImageUtils } from "@/lib/image-utils";
import { TableEditor } from "./TableEditor";
import { HyperlinkDialog } from "./HyperlinkDialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [showHyperlinkDialog, setShowHyperlinkDialog] = useState(false);

  const insertText = (beforeCursor: string, afterCursor: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newValue =
      value.substring(0, start) +
      beforeCursor +
      selectedText +
      afterCursor +
      value.substring(end);

    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + beforeCursor.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertAtNewLine = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);

    // Add newlines if we're not at the start of a line
    const needsNewlineBefore =
      beforeCursor.length > 0 && !beforeCursor.endsWith("\n");
    const needsNewlineAfter =
      afterCursor.length > 0 && !afterCursor.startsWith("\n");

    const prefix = needsNewlineBefore ? "\n" : "";
    const suffix = needsNewlineAfter ? "\n" : "";

    const newValue = beforeCursor + prefix + text + suffix + afterCursor;
    onChange(newValue);

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos = start + prefix.length + text.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      ImageUtils.validateImageFile(file);
      const base64 = await ImageUtils.convertToBase64(file);
      insertAtNewLine(`/img ${base64}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image");
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTableSave = (tableData: {
    headers: string[];
    rows: string[][];
  }) => {
    // Convert table data to a custom format for storage
    const tableText = `/table
${tableData.headers.join("|")}
${tableData.rows.map((row) => row.join("|")).join("\n")}`;

    insertAtNewLine(tableText);
    setShowTableEditor(false);
  };

  const openTableEditor = () => {
    setShowTableEditor(true);
  };

  const handleHyperlinkInsert = (url: string, text: string) => {
    const hyperlinkText = `\\hyperlink{${url}}[${text}]`;
    insertText(hyperlinkText);
  };

  const openHyperlinkDialog = () => {
    setShowHyperlinkDialog(true);
  };

  const formatCommands = [
    {
      icon: Type,
      label: "/title",
      description: "Main title",
      action: () => insertAtNewLine("/title Your Title Here"),
    },
    {
      icon: FileText,
      label: "/subtitle",
      description: "Section subtitle",
      action: () => insertAtNewLine("/subtitle Your Subtitle Here"),
    },
    {
      icon: Image,
      label: "/img URL",
      description: "Insert image URL",
      action: () => insertAtNewLine("/img https://example.com/image.jpg"),
    },
    {
      icon: Upload,
      label: "Upload",
      description: "Upload local image",
      action: openImageUpload,
    },
    {
      icon: Image,
      label: "/imgcaption",
      description: "Image caption",
      action: () => insertAtNewLine("/imgcaption Your image caption here"),
    },
    {
      icon: Code,
      label: "/code",
      description: "Code block",
      action: () => insertAtNewLine("/code\nyour code here"),
    },
    {
      icon: Table,
      label: "/table",
      description: "Insert table",
      action: openTableEditor,
    },
    {
      icon: Link,
      label: "Link",
      description: "Insert hyperlink",
      action: openHyperlinkDialog,
    },
  ];

  const styleCommands = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertText("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*", "*"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertText("__", "__"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Table Editor Modal */}
      {showTableEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <TableEditor
            onSave={handleTableSave}
            onCancel={() => setShowTableEditor(false)}
          />
        </div>
      )}

      {/* Hyperlink Dialog */}
      <HyperlinkDialog
        isOpen={showHyperlinkDialog}
        onClose={() => setShowHyperlinkDialog(false)}
        onInsert={handleHyperlinkInsert}
      />

      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formatting Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Parsing Commands */}
          <div>
            <h4 className="font-medium mb-2">Content Elements</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {formatCommands.map((command) => (
                <Button
                  key={command.label}
                  variant="outline"
                  size="sm"
                  onClick={command.action}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                  title={command.description}
                >
                  <command.icon className="h-4 w-4" />
                  <span className="text-xs">{command.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Text Styling */}
          <div>
            <h4 className="font-medium mb-2">Text Styling</h4>
            <div className="flex gap-2">
              {styleCommands.map((command) => (
                <Button
                  key={command.label}
                  variant="outline"
                  size="sm"
                  onClick={command.action}
                  className="flex items-center gap-1"
                >
                  <command.icon className="h-4 w-4" />
                  <span className="text-xs">{command.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Syntax Help */}
          <div>
            <h4 className="font-medium mb-2">Syntax Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <Badge variant="outline">/title Main Title</Badge>
                <Badge variant="outline">/subtitle Section Title</Badge>
                <Badge variant="outline">/img URL</Badge>
                <Badge variant="outline">Upload Button</Badge>
                <Badge variant="outline">\\hyperlink{"{url}"}[text]</Badge>
              </div>
              <div className="space-y-1">
                <Badge variant="outline">**bold text**</Badge>
                <Badge variant="outline">*italic text*</Badge>
                <Badge variant="outline">__underlined text__</Badge>
                <Badge variant="outline">/imgcaption Caption</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor */}
      <div>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder ||
            "Start writing your blog post here...\n\nUse /title, /subtitle, /img, /code etc. for formatting\nClick 'Upload' button to add local images"
          }
          className="min-h-96 font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-2">
          {value.length} characters
        </div>
      </div>
    </div>
  );
}
