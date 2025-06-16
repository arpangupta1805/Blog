import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BlogPostPreview } from "@/types/blog";

interface CategoryFilterProps {
  posts: BlogPostPreview[];
  onFilter: (filteredPosts: BlogPostPreview[]) => void;
}

export function CategoryFilter({ posts, onFilter }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from posts
  const categories = ["All", ...new Set(posts.map((post) => post.category))];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);

    if (category === "All") {
      onFilter(posts);
    } else {
      const filtered = posts.filter((post) => post.category === category);
      onFilter(filtered);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest Articles</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
