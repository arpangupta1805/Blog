import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUtils } from "@/lib/image-utils";

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
  const [imageFileName, setImageFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImageFileName("");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      ImageUtils.validateImageFile(file);
      const base64 = await ImageUtils.convertToBase64(file);
      setCoverImage(base64);
      setImageFileName(file.name);
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

          {/* Cover Image */}
          <div className="space-y-2">
            <Label
              htmlFor="coverImage"
              className="text-sm font-medium text-gray-700"
            >
              Cover Image
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage.startsWith('data:image') ? '' : coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                    setImageFileName('');
                  }}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Enter image URL or upload from your computer</p>
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={openImageUpload}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                {imageFileName && (
                  <p className="text-xs text-muted-foreground self-center truncate max-w-[150px]">
                    {imageFileName}
                  </p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
              </div>
            </div>
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
