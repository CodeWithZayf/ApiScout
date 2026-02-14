import { PricingType, AuthType } from './types';

export const PRICING_LABELS: Record<PricingType, string> = {
    FREE: 'Free',
    FREEMIUM: 'Freemium',
    PAID: 'Paid',
};

export const PRICING_COLORS: Record<PricingType, string> = {
    FREE: 'bg-green-100 text-green-700',
    FREEMIUM: 'bg-blue-100 text-blue-700',
    PAID: 'bg-orange-100 text-orange-700',
};

export const AUTH_LABELS: Record<AuthType, string> = {
    API_KEY: 'API Key',
    OAUTH: 'OAuth',
    NONE: 'No Auth',
    BEARER_TOKEN: 'Bearer Token',
};

export const RATE_LIMIT_LABELS: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    UNLIMITED: 'Unlimited',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
};

export const CATEGORY_ICONS: Record<string, string> = {
    'ai-ml': 'Sparkles',
    'payments': 'CreditCard',
    'authentication': 'Lock',
    'email-messaging': 'Mail',
    'cloud-storage': 'Database',
    'maps-geo': 'Globe',
    'communication': 'Phone',
    'devtools': 'Code',
    'social-media': 'Users',
    'weather': 'Cloud',
    'data-analytics': 'BarChart',
    'e-commerce': 'ShoppingCart',
};

export const CATEGORY_COLORS: Record<string, string> = {
    'ai-ml': 'bg-pink-100 text-pink-600',
    'payments': 'bg-blue-100 text-blue-600',
    'authentication': 'bg-purple-100 text-purple-600',
    'email-messaging': 'bg-green-100 text-green-600',
    'cloud-storage': 'bg-orange-100 text-orange-600',
    'maps-geo': 'bg-cyan-100 text-cyan-600',
    'communication': 'bg-yellow-100 text-yellow-600',
    'devtools': 'bg-gray-100 text-gray-700',
    'social-media': 'bg-indigo-100 text-indigo-600',
    'weather': 'bg-sky-100 text-sky-600',
    'data-analytics': 'bg-emerald-100 text-emerald-600',
    'e-commerce': 'bg-rose-100 text-rose-600',
};

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'free-first', label: 'Free First' },
];
