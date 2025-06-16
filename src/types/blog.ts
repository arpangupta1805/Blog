export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  keywords: string[];
  coverImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  keywords: string[];
  coverImage: string;
  excerpt: string;
  createdAt: string;
}

export interface ParsedContent {
  type: "text" | "title" | "subtitle" | "image" | "code" | "table";
  content: string;
  caption?: string;
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}
