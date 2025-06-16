import { useState } from "react";
import { Link, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HyperlinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
}

export function HyperlinkDialog({
  isOpen,
  onClose,
  onInsert,
}: HyperlinkDialogProps) {
  const [url, setUrl] = useState("");
  const [displayText, setDisplayText] = useState("");

  const handleInsert = () => {
    if (url.trim() && displayText.trim()) {
      onInsert(url.trim(), displayText.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    setDisplayText("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5" />
              <DialogTitle>Insert Hyperlink</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Create a hyperlink that opens in a new tab
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayText">Display Text</Label>
            <Input
              id="displayText"
              placeholder="Link text"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Preview:</strong>
            </p>
            <p className="text-sm">
              {displayText || "Link text"}{" "}
              <span className="text-xs text-muted-foreground">
                → {url || "https://example.com"}
              </span>
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!url.trim() || !displayText.trim()}
            >
              Insert Link
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <strong>Syntax:</strong> \\hyperlink{"{url}"}[display text]
          <br />
          <strong>Example:</strong> \\hyperlink{"{https://google.com}"}[Google]
        </div>
      </DialogContent>
    </Dialog>
  );
}
