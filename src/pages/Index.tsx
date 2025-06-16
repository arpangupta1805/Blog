import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BlogAPIService } from "@/lib/api-service";
import { BlogPostPreview } from "@/types/blog";

const Index = () => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayPosts, setDisplayPosts] = useState<BlogPostPreview[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await BlogAPIService.getPostPreviews();
      const sortedPosts = allPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
      setDisplayPosts(sortedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setDisplayPosts(filteredPosts);
    } else {
      try {
        const searchResults = await BlogAPIService.searchPosts(query);
        const finalResults = searchResults.filter((searchPost) =>
          filteredPosts.some(
            (filteredPost) => filteredPost.id === searchPost.id,
          ),
        );
        setDisplayPosts(finalResults);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    }
  };

  const handleCategoryFilter = async (
    categoryFilteredPosts: BlogPostPreview[],
  ) => {
    setFilteredPosts(categoryFilteredPosts);
    // Apply current search to the category filtered posts
    if (searchQuery.trim() === "") {
      setDisplayPosts(categoryFilteredPosts);
    } else {
      try {
        const searchResults = await BlogAPIService.searchPosts(searchQuery);
        const finalResults = searchResults.filter((searchPost) =>
          categoryFilteredPosts.some(
            (filteredPost) => filteredPost.id === searchPost.id,
          ),
        );
        setDisplayPosts(finalResults);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    }
  };

  return (
    <Layout onSearch={handleSearch} showSearch={posts.length > 0}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 bg-slate-100 p-4 py-10 rounded-md dark:text-blue-500 dark:bg-slate-900">
          <h1 className="text-4xl font-bold mb-4">Arpan's Blog Page</h1>
        </div>

        {/* Category Filter */}
        {posts.length > 0 && (
          <CategoryFilter posts={posts} onFilter={handleCategoryFilter} />
        )}

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground mb-6">
            {displayPosts.length > 0
              ? `Found ${displayPosts.length} post${displayPosts.length === 1 ? "" : "s"} matching "${searchQuery}"`
              : `No posts found matching "${searchQuery}"`}
          </div>
        )}

        {/* Blog Posts Grid */}
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No blog posts found matching your search.
            </p>
            <Button onClick={() => handleSearch("")} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Show All Posts
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No blog posts available. Create your first post in the admin panel!
            </p>
          </div>
        ) : null}

      </div>
    </Layout>
  );
};

export default Index;
