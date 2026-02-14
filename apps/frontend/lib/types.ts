// Shared types matching backend Prisma models

export type PricingType = 'FREE' | 'FREEMIUM' | 'PAID';
export type AuthType = 'API_KEY' | 'OAUTH' | 'NONE' | 'BEARER_TOKEN';
export type RateLimit = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNLIMITED';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ApiStatus = 'ACTIVE' | 'DEPRECATED' | 'MAINTENANCE';
export type FeedbackType = 'USEFUL' | 'OVERPRICED' | 'OUTDATED';

export interface Tag {
    id: string;
    name: string;
    slug: string;
    apiCount?: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    apiCount?: number;
}

export interface ApiItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    websiteUrl: string;
    documentationUrl: string;
    logoUrl?: string;
    providerName?: string;
    pricingType: PricingType;
    authType: AuthType;
    rateLimit: RateLimit;
    difficultyLevel: Difficulty;
    isOpenSource: boolean;
    status: ApiStatus;
    isFeatured: boolean;
    isDeprecated: boolean;
    pricingSummary?: string;
    useCases?: string;
    rateLimitInfo?: string;
    authDescription?: string;
    dashboardUrl?: string;
    pricingUrl?: string;
    bookmarkCount: number;
    reviewCount: number;
    viewCount: number;
    likeCount: number;
    averageRating: number;
    category: Category;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    rating: number;
    comment?: string;
    user: {
        id: string;
        name?: string;
        image?: string;
    };
    createdAt: string;
}

export interface ApiDetail extends ApiItem {
    reviews: Review[];
    feedbackCounts: Record<string, number>;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
