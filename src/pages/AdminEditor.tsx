import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Save, ArrowLeft, FileText, Eye } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { BlogPreview } from "@/components/BlogPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BlogAPIService } from "@/lib/api-service";
import { BlogPost } from "@/types/blog";

const AdminEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  const articleData = location.state?.articleData;

  const [showMetaDialog, setShowMetaDialog] = useState(!isEditing);
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing && id) {
        try {
          const post = await BlogAPIService.getPostById(id);
          if (post) {
            setTitle(post.title);
            setAuthor(post.author);
            setDate(post.date);
            setCategory(post.category);
            setKeywords(post.keywords.join(", "));
            setCoverImage(post.coverImage);
            setContent(post.content);
            setShowMetaDialog(false);
          } else {
            navigate("/admin");
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          navigate("/admin");
        }
      } else if (articleData) {
        // Initialize with data from create modal
        setTitle(articleData.title);
        setAuthor(articleData.author);
        setDate(articleData.date);
        setCategory(articleData.category);
        setKeywords(articleData.keywords);
        setCoverImage(articleData.coverImage || "");
        setShowMetaDialog(false);
      }
    };

    fetchPost();
  }, [id, isEditing, navigate, articleData]);

  const handleSave = async () => {
    if (
      !title.trim() ||
      !author.trim() ||
      !category.trim() ||
      !content.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      let createdAt = new Date().toISOString();

      if (isEditing && id) {
        const existingPost = await BlogAPIService.getPostById(id);
        createdAt = existingPost?.createdAt || new Date().toISOString();
      }

      const post: BlogPost = {
        id: id || Date.now().toString(),
        title: title.trim(),
        author: author.trim(),
        date,
        category: category.trim(),
        keywords: keywordArray,
        coverImage:
          coverImage.trim() ||
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        content: content.trim(),
        createdAt,
        updatedAt: new Date().toISOString(),
      };

      await BlogAPIService.updatePost(post);
      navigate("/admin");
    } catch (error) {
      console.error("Error Saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMetaSubmit = () => {
    if (!title.trim() || !author.trim() || !category.trim()) {
      alert("Please fill in title, author, and category");
      return;
    }
    setShowMetaDialog(false);
  };

  return (
    <Layout restrictHeight={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h1>
              {title && <p className="text-muted-foreground mt-1">{title}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!content.trim()}
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Dialog open={showMetaDialog} onOpenChange={setShowMetaDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Post Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Post Information</DialogTitle>
                  <DialogDescription>
                    Fill in the basic information for your blog post
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Programming, AI, Design"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button onClick={handleMetaSubmit} className="w-full">
                    Continue to Editor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>

        {/* Editor */}
        {!showMetaDialog && (
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your blog post..."
              />
            </CardContent>
          </Card>
        )}

        {/* Preview Modal */}
        <BlogPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          post={{
            title,
            author,
            date,
            category,
            keywords: keywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k.length > 0),
            coverImage:
              coverImage.trim() ||
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
          }}
          content={content}
        />
      </div>
    </Layout>
  );
};

export default AdminEditor;
