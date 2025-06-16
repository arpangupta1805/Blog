import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { BlogPostDetail } from "@/components/BlogPostDetail";
import { BlogAPIService } from "@/lib/api-service";
import { BlogPost as BlogPostType } from "@/types/blog";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const foundPost = await BlogAPIService.getPostById(id);
          setPost(foundPost);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="aspect-video bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BlogPostDetail post={post} />
      </div>
    </Layout>
  );
};

export default BlogPost;
