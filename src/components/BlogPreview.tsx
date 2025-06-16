import { Calendar, User, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogPost } from "@/types/blog";
import { BlogParser } from "@/lib/blog-parser";

interface BlogPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  post: Partial<BlogPost>;
  content: string;
}

export function BlogPreview({
  isOpen,
  onClose,
  post,
  content,
}: BlogPreviewProps) {
  const parsedContent = BlogParser.parseContent(content);

  const renderContent = () => {
    return parsedContent.map((content, index) => {
      switch (content.type) {
        case "title":
          return (
            <h1 key={index} className="text-4xl font-bold leading-tight mb-6">
              {content.content}
            </h1>
          );
        case "subtitle":
          return (
            <h2 key={index} className="text-2xl font-semibold mb-4 mt-8">
              {content.content}
            </h2>
          );
        case "image":
          return (
            <div key={index} className="my-8">
              <img
                src={content.content}
                alt={content.caption || "Blog image"}
                className="w-full rounded-lg shadow-lg max-h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                }}
              />
              {content.caption && (
                <p className="text-sm text-muted-foreground mt-2 text-center italic">
                  {content.caption}
                </p>
              )}
            </div>
          );
        case "code":
          return (
            <div key={index} className="my-6">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono">{content.content}</code>
              </pre>
            </div>
          );
        case "table":
          try {
            const tableData = JSON.parse(content.content);
            return (
              <div key={index} className="my-6 overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      {tableData.headers.map((header: string, i: number) => (
                        <th
                          key={i}
                          className="border border-border p-3 text-left font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-t">
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="border border-border p-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          } catch {
            return (
              <div key={index} className="my-6 p-4 border rounded-lg">
                <p className="text-muted-foreground">Invalid table data</p>
              </div>
            );
          }
        case "text":
        default:
          return (
            <div
              key={index}
              className="prose prose-lg dark:prose-invert max-w-none mb-4"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Blog Preview</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <article className="space-y-6">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title || "Cover image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                  }}
                />
              </div>
            )}

            {/* Meta Information */}
            <div className="space-y-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {post.author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Keywords */}
              {post.keywords && post.keywords.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {content.trim() ? (
                renderContent()
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Start writing your blog content to see the preview</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
}
