import { BlogPost, BlogPostPreview } from "@/types/blog";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export class BlogAPIService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
    
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    
      return response.json();
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>("/posts");
  }

  static async getPostById(id: string): Promise<BlogPost | null> {
    try {
      return await this.request<BlogPost>(`/posts/${id}`);
    } catch {
      return null;
    }
  }

  static async getPostPreviews(): Promise<BlogPostPreview[]> {
    return this.request<BlogPostPreview[]>("/posts/previews");
  }

  static async searchPosts(query: string): Promise<BlogPostPreview[]> {
    return this.request<BlogPostPreview[]>(
      `/posts/search?q=${encodeURIComponent(query)}`,
    );
  }

  static async savePost(post: BlogPost): Promise<void> {
    const method = "POST";
    const endpoint = `/posts/new/${post.id}`;

    await this.request(endpoint, {
      method,
      body: JSON.stringify(post),
    });
  }

  static async updatePost(post: BlogPost): Promise<void> {
    const method = "PUT";
    const endpoint = `/posts/${post.id}`;

    await this.request(endpoint, {
      method,
      body: JSON.stringify(post),
    });
  }

  static async deletePost(id: string): Promise<void> {
    await this.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  static async verifyAdminPassword(password: string): Promise<boolean> {
    try {
      const response = await this.request<{ valid: boolean }>("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      return response.valid;
    } catch {
      return false;
    }
  }
}
