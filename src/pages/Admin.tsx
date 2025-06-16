import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminAuth } from "@/components/AdminAuth";
import { CreateArticleModal } from "@/components/CreateArticleModal";
import { DashboardStats } from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogAPIService } from "@/lib/api-service";
import { BlogPost } from "@/types/blog";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      const allPosts = await BlogAPIService.getAllPosts();
      setPosts(
        allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await BlogAPIService.deletePost(id);
        await loadPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleCreateArticle = (articleData: any) => {
    setShowCreateModal(false);
    // Navigate to editor with the article data
    navigate("/admin/editor", { state: { articleData } });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Programming:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-180",
      "Machine Learning":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-180",
      "Web Development":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-180",
      "DevOps":
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-180",
      "Database": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-180",
      "Security":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-180",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-180",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout restrictHeight={true}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your blog posts and content
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>

          {/* Stats */}
          <DashboardStats posts={posts} />

          {/* Manage Articles */}
          <div className="bg-card rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">
                Manage Articles
              </h2>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No articles found. Create your first article!
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Article
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted text-sm font-medium text-muted-foreground">
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Table Content - Scrollable */}
                <div className="max-h-96 overflow-y-auto">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 transition-colors items-center"
                    >
                      {/* Title */}
                      <div className="col-span-4">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          By {post.author}
                        </p>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full hover:bg-blue-180">
                          Published
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(`/blog/${post.id}`)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/editor/${post.id}`)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Article Modal */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onContinue={handleCreateArticle}
      />
    </Layout>
  );
};

export default Admin;
