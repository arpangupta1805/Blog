import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (articleData: {
    title: string;
    author: string;
    date: string;
    category: string;
    coverImage: string;
    keywords: string;
  }) => void;
}

export function CreateArticleModal({
  isOpen,
  onClose,
  onContinue,
}: CreateArticleModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleContinue = () => {
    if (!title.trim() || !author.trim() || !category) {
      return;
    }

    onContinue({
      title: title.trim(),
      author: author.trim(),
      date,
      category,
      coverImage: coverImage.trim(),
      keywords: keywords.trim(),
    });

    // Reset form
    setTitle("");
    setAuthor("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setCoverImage("");
    setKeywords("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Article
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-foreground"
              >
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label
                htmlFor="author"
                className="text-sm font-medium text-gray-700"
              >
                Author *
              </Label>
              <Input
                id="author"
                placeholder="Author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Publish Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium text-gray-700"
              >
                Publish Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category *
              </Label>
              <Input
                id="category"
                placeholder="e.g., Programming, Machine Learning, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label
              htmlFor="coverImage"
              className="text-sm font-medium text-gray-700"
            >
              Cover Image URL
            </Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label
              htmlFor="keywords"
              className="text-sm font-medium text-gray-700"
            >
              Keywords *
            </Label>
            <Textarea
              id="keywords"
              placeholder="React, JavaScript, Frontend (comma separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!title.trim() || !author.trim() || !category}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Editor
          </Button>
        </div>
      </div>
    </div>
  );
}
