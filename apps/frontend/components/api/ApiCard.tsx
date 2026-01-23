import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Bookmark } from "lucide-react";

interface ApiCardProps {
  api: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logoUrl?: string;
    authType: string;
    rateLimit: string;
    isFree: boolean;
    averageRating: number;
    reviewCount: number;
    category: {
      name: string;
    };
  };
}

export function ApiCard({ api }: ApiCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-start flex-1">
            {api.logoUrl && (
              <img 
                src={api.logoUrl} 
                alt={api.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <Link href={`/api/${api.slug}`}>
                <CardTitle className="hover:text-blue-600 transition-colors">
                  {api.name}
                </CardTitle>
              </Link>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{api.category.name}</Badge>
                {api.isFree && <Badge variant="outline">Free</Badge>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-2">
          {api.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{api.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({api.reviewCount})</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {api.authType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {api.rateLimit}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
