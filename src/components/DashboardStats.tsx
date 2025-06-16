import { FileText, CheckCircle, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";

interface DashboardStatsProps {
  posts: BlogPost[];
}

export function DashboardStats({ posts }: DashboardStatsProps) {
  const totalArticles = posts.length;
  const publishedArticles = posts.length; // All posts are considered published in this system
  const drafts = 0; // We don't have draft functionality yet

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Published",
      value: publishedArticles,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Drafts",
      value: drafts,
      icon: Edit,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${stat.bgColor} dark:bg-opacity-20`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
