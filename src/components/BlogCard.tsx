import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlogPostPreview } from "@/types/blog";
import { BlogParser } from "@/lib/blog-parser";

interface BlogCardProps {
  post: BlogPostPreview;
}

export function BlogCard({ post }: BlogCardProps) {
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const visibleKeywords = showAllKeywords
    ? post.keywords
    : post.keywords.slice(0, 4);
  const remainingCount = post.keywords.length - 4;

  const truncatedTitle = BlogParser.truncateTitle(post.title, 12);
  const getCategoryColor = (category: string) => {
    const colors = {
      Programming:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      "Machine Learning":
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
      "Web Development":
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      DevOps:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      Database:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      Security:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      default:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group bg-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border rounded-2xl">
      {/* Cover Image */}
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
          }}
        />
      </div>

      <div className="p-6 space-y-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <Badge
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(post.category)}`}
          >
            {post.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-tight hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          <Link to={`/blog/${post.id}`} className="line-clamp-2">
            {truncatedTitle}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {visibleKeywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-1 bg-secondary text-secondary-foreground border rounded-md hover:bg-secondary/80 transition-colors"
            >
              {keyword}
            </Badge>
          ))}
          {remainingCount > 0 && !showAllKeywords && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllKeywords(true)}
              className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              +{remainingCount} more
            </Button>
          )}
          {showAllKeywords && post.keywords.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllKeywords(false)}
              className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Show less
            </Button>
          )}
        </div>

        {/* Author and Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
                {getAuthorInitials(post.author)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {post.author}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/btn"
          >
            <Link
              to={`/blog/${post.id}`}
              className="flex items-center space-x-1"
            >
              <span className="text-sm font-medium">Read More</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
