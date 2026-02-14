import { PrismaClient, PricingType, AuthType, RateLimit, Difficulty } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // ─── Users ────────────────────────────────────────────────
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@apiscout.com' },
        update: {},
        create: {
            email: 'admin@apiscout.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'dev@example.com' },
        update: {},
        create: {
            email: 'dev@example.com',
            name: 'John Dev',
            password: userPassword,
            role: 'USER',
        },
    });

    console.log('✅ Users created');

    // ─── Categories ───────────────────────────────────────────
    const categoriesData = [
        { name: 'AI & Machine Learning', slug: 'ai-ml', description: 'Artificial intelligence and machine learning APIs', icon: 'Sparkles' },
        { name: 'Payments', slug: 'payments', description: 'Payment processing and financial APIs', icon: 'CreditCard' },
        { name: 'Authentication', slug: 'authentication', description: 'Auth, identity, and access management APIs', icon: 'Lock' },
        { name: 'Email & Messaging', slug: 'email-messaging', description: 'Email, SMS, and notification APIs', icon: 'Mail' },
        { name: 'Cloud Storage', slug: 'cloud-storage', description: 'File storage and content delivery APIs', icon: 'Database' },
        { name: 'Maps & Geolocation', slug: 'maps-geo', description: 'Mapping, geocoding, and location APIs', icon: 'Globe' },
        { name: 'Communication', slug: 'communication', description: 'Voice, video, and real-time communication APIs', icon: 'Phone' },
        { name: 'DevTools', slug: 'devtools', description: 'Developer tools, CI/CD, and productivity APIs', icon: 'Code' },
        { name: 'Social Media', slug: 'social-media', description: 'Social media platform APIs and integrations', icon: 'Users' },
        { name: 'Weather & Environment', slug: 'weather', description: 'Weather data and environmental APIs', icon: 'Cloud' },
        { name: 'Data & Analytics', slug: 'data-analytics', description: 'Data enrichment, analytics, and monitoring APIs', icon: 'BarChart' },
        { name: 'E-Commerce', slug: 'e-commerce', description: 'E-commerce, product, and marketplace APIs', icon: 'ShoppingCart' },
    ];

    const categories: Record<string, any> = {};
    for (const cat of categoriesData) {
        categories[cat.slug] = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    console.log('✅ Categories created');

    // ─── Tags ─────────────────────────────────────────────────
    const tagsData = [
        { name: 'Free', slug: 'free' },
        { name: 'No Auth Required', slug: 'no-auth' },
        { name: 'Open Source', slug: 'open-source' },
        { name: 'Popular', slug: 'popular' },
        { name: 'Beginner Friendly', slug: 'beginner-friendly' },
        { name: 'Production Ready', slug: 'production-ready' },
        { name: 'Enterprise', slug: 'enterprise' },
        { name: 'GraphQL', slug: 'graphql' },
        { name: 'REST', slug: 'rest' },
        { name: 'WebSocket', slug: 'websocket' },
        { name: 'SDK Available', slug: 'sdk-available' },
        { name: 'Webhook Support', slug: 'webhook-support' },
        { name: 'Great Docs', slug: 'great-docs' },
        { name: 'New', slug: 'new' },
        { name: 'Trending', slug: 'trending' },
    ];

    const tags: Record<string, any> = {};
    for (const tag of tagsData) {
        tags[tag.slug] = await prisma.tag.upsert({
            where: { slug: tag.slug },
            update: {},
            create: tag,
        });
    }

    console.log('✅ Tags created');

    // ─── APIs ─────────────────────────────────────────────────
    const apisData = [
        {
            name: 'OpenAI API',
            slug: 'openai',
            description: 'Build AI-powered applications with GPT-4, DALL-E, Whisper, and more. The most popular AI API for text generation, code completion, image creation, and speech recognition.',
            websiteUrl: 'https://openai.com',
            documentationUrl: 'https://platform.openai.com/docs',
            providerName: 'OpenAI',
            pricingType: PricingType.PAID,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.MEDIUM,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Pay-per-token pricing. GPT-4 Turbo: $0.01/1K input tokens. Free tier: $5 credit for new accounts.',
            useCases: JSON.stringify(['Chatbots', 'Content Generation', 'Code Completion', 'Image Generation', 'Translation']),
            rateLimitInfo: '500 RPM for GPT-4, 3500 RPM for GPT-3.5. Varies by tier.',
            authDescription: 'Bearer token authentication. Get your API key from the OpenAI dashboard.',
            categorySlug: 'ai-ml',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'great-docs'],
            viewCount: 15420,
            bookmarkCount: 892,
            likeCount: 1204,
            averageRating: 4.7,
            reviewCount: 156,
            isFeatured: true,
        },
        {
            name: 'Stripe API',
            slug: 'stripe',
            description: 'Financial infrastructure for the internet. Accept payments, send payouts, and manage business operations online with the most developer-friendly payment platform.',
            websiteUrl: 'https://stripe.com',
            documentationUrl: 'https://stripe.com/docs/api',
            providerName: 'Stripe, Inc.',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: '2.9% + 30¢ per transaction. No monthly fees. Volume discounts available.',
            useCases: JSON.stringify(['Payment Processing', 'Subscriptions', 'Invoicing', 'Marketplace Payments', 'Identity Verification']),
            rateLimitInfo: '100 read requests/sec, 100 write requests/sec in live mode.',
            dashboardUrl: 'https://dashboard.stripe.com',
            pricingUrl: 'https://stripe.com/pricing',
            categorySlug: 'payments',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'great-docs', 'webhook-support'],
            viewCount: 18930,
            bookmarkCount: 1205,
            likeCount: 1567,
            averageRating: 4.9,
            reviewCount: 243,
            isFeatured: true,
        },
        {
            name: 'GitHub API',
            slug: 'github',
            description: 'Create integrations, retrieve data, and automate workflows on the world\'s leading software development platform. Supports REST and GraphQL.',
            websiteUrl: 'https://github.com',
            documentationUrl: 'https://docs.github.com/en/rest',
            providerName: 'GitHub (Microsoft)',
            pricingType: PricingType.FREE,
            authType: AuthType.OAUTH,
            rateLimit: RateLimit.MEDIUM,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free for public repositories. Authenticated: 5,000 requests/hour. Unauthenticated: 60 requests/hour.',
            useCases: JSON.stringify(['Repository Management', 'CI/CD Integration', 'Issue Tracking', 'Code Search', 'Webhooks']),
            rateLimitInfo: '5,000 requests per hour (authenticated), 60/hour (unauthenticated).',
            categorySlug: 'devtools',
            tagSlugs: ['free', 'popular', 'beginner-friendly', 'graphql', 'rest', 'open-source', 'great-docs'],
            viewCount: 12450,
            bookmarkCount: 934,
            likeCount: 1102,
            averageRating: 4.8,
            reviewCount: 189,
            isFeatured: true,
        },
        {
            name: 'Twilio',
            slug: 'twilio',
            description: 'Connect with customers everywhere they want to interact. SMS, Voice, Video, and Email APIs for every platform and programming language.',
            websiteUrl: 'https://twilio.com',
            documentationUrl: 'https://www.twilio.com/docs',
            providerName: 'Twilio',
            pricingType: PricingType.PAID,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'SMS: $0.0079/msg. Voice: $0.0085/min. Free trial with $15 credit.',
            useCases: JSON.stringify(['SMS Notifications', 'Two-Factor Auth', 'Voice Calls', 'Video Chat', 'WhatsApp Integration']),
            categorySlug: 'communication',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'webhook-support'],
            viewCount: 9870,
            bookmarkCount: 567,
            likeCount: 723,
            averageRating: 4.7,
            reviewCount: 134,
        },
        {
            name: 'Google Maps Platform',
            slug: 'google-maps',
            description: 'Build immersive location experiences with Maps, Routes, and Places. Used by millions of apps worldwide for geocoding, directions, and map visualization.',
            websiteUrl: 'https://cloud.google.com/maps-platform',
            documentationUrl: 'https://developers.google.com/maps/documentation',
            providerName: 'Google',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: '$200 free monthly credit. Dynamic Maps: $7/1K loads. Geocoding: $5/1K requests.',
            useCases: JSON.stringify(['Map Embedding', 'Geocoding', 'Directions', 'Place Search', 'Distance Matrix']),
            categorySlug: 'maps-geo',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'beginner-friendly', 'great-docs'],
            viewCount: 11200,
            bookmarkCount: 789,
            likeCount: 901,
            averageRating: 4.5,
            reviewCount: 167,
            isFeatured: true,
        },
        {
            name: 'Auth0',
            slug: 'auth0',
            description: 'Rapidly integrate authentication and authorization for web, mobile, and legacy applications. Universal login, SSO, MFA, and more.',
            websiteUrl: 'https://auth0.com',
            documentationUrl: 'https://auth0.com/docs',
            providerName: 'Okta (Auth0)',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.OAUTH,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free: up to 7,500 active users. Essentials: $35/mo for 500 users. Professional: custom pricing.',
            useCases: JSON.stringify(['User Authentication', 'Single Sign-On', 'Multi-Factor Auth', 'Social Login', 'Role-Based Access']),
            categorySlug: 'authentication',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'enterprise', 'great-docs'],
            viewCount: 8900,
            bookmarkCount: 678,
            likeCount: 812,
            averageRating: 4.6,
            reviewCount: 98,
        },
        {
            name: 'SendGrid',
            slug: 'sendgrid',
            description: 'Trusted for sending transactional and marketing emails at scale. Handles email delivery, templates, analytics, and deliverability optimization.',
            websiteUrl: 'https://sendgrid.com',
            documentationUrl: 'https://docs.sendgrid.com',
            providerName: 'Twilio (SendGrid)',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 100 emails/day. Essentials: $19.95/mo for 50K emails. Pro: $89.95/mo for 100K emails.',
            useCases: JSON.stringify(['Transactional Email', 'Marketing Campaigns', 'Email Templates', 'Deliverability Analytics']),
            categorySlug: 'email-messaging',
            tagSlugs: ['popular', 'beginner-friendly', 'production-ready', 'sdk-available', 'webhook-support'],
            viewCount: 7650,
            bookmarkCount: 456,
            likeCount: 589,
            averageRating: 4.4,
            reviewCount: 87,
        },
        {
            name: 'AWS S3',
            slug: 'aws-s3',
            description: 'Industry-leading object storage with unmatched scalability, availability, security, and performance. Store and retrieve any amount of data from anywhere.',
            websiteUrl: 'https://aws.amazon.com/s3',
            documentationUrl: 'https://docs.aws.amazon.com/s3',
            providerName: 'Amazon Web Services',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.UNLIMITED,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free tier: 5 GB storage, 20K GET, 2K PUT monthly. Standard: $0.023/GB/month.',
            useCases: JSON.stringify(['File Storage', 'Static Website Hosting', 'Backup & Archive', 'Content Delivery', 'Data Lake']),
            categorySlug: 'cloud-storage',
            tagSlugs: ['popular', 'production-ready', 'enterprise', 'sdk-available'],
            viewCount: 10200,
            bookmarkCount: 890,
            likeCount: 967,
            averageRating: 4.5,
            reviewCount: 145,
        },
        {
            name: 'Firebase',
            slug: 'firebase',
            description: 'Google\'s app development platform. Build, improve, and grow your app with tools for authentication, real-time database, cloud functions, and hosting.',
            websiteUrl: 'https://firebase.google.com',
            documentationUrl: 'https://firebase.google.com/docs',
            providerName: 'Google',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Generous free tier (Spark plan). Blaze (pay-as-you-go): varies by service.',
            useCases: JSON.stringify(['Real-time Database', 'Authentication', 'Cloud Functions', 'Push Notifications', 'Analytics']),
            categorySlug: 'devtools',
            tagSlugs: ['popular', 'beginner-friendly', 'sdk-available', 'great-docs', 'free'],
            viewCount: 9100,
            bookmarkCount: 723,
            likeCount: 834,
            averageRating: 4.6,
            reviewCount: 112,
        },
        {
            name: 'Cloudinary',
            slug: 'cloudinary',
            description: 'End-to-end image and video management. Upload, store, transform, optimize, and deliver media with powerful APIs and smart automations.',
            websiteUrl: 'https://cloudinary.com',
            documentationUrl: 'https://cloudinary.com/documentation',
            providerName: 'Cloudinary',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.MEDIUM,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 25 credits/month (~25K transformations). Plus: $89/mo. Advanced: $224/mo.',
            useCases: JSON.stringify(['Image Optimization', 'Video Processing', 'Media Upload', 'Image Transformation', 'CDN Delivery']),
            categorySlug: 'cloud-storage',
            tagSlugs: ['beginner-friendly', 'sdk-available', 'great-docs', 'production-ready'],
            viewCount: 5430,
            bookmarkCount: 345,
            likeCount: 412,
            averageRating: 4.5,
            reviewCount: 67,
        },
        {
            name: 'OpenWeatherMap',
            slug: 'openweathermap',
            description: 'Access current weather, forecasts, historical data, and weather maps for any location worldwide. Simple, fast, and developer-friendly weather API.',
            websiteUrl: 'https://openweathermap.org',
            documentationUrl: 'https://openweathermap.org/api',
            providerName: 'OpenWeather',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.LOW,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 60 calls/min, current weather + 3h forecast. Pro: $40/mo for 1-day forecast + historical.',
            useCases: JSON.stringify(['Weather Data', 'Forecasting', 'Weather Maps', 'Air Pollution Data', 'Weather Alerts']),
            categorySlug: 'weather',
            tagSlugs: ['free', 'beginner-friendly', 'no-auth', 'rest'],
            viewCount: 8760,
            bookmarkCount: 534,
            likeCount: 645,
            averageRating: 4.2,
            reviewCount: 89,
        },
        {
            name: 'Mapbox',
            slug: 'mapbox',
            description: 'Design and build beautiful, customized maps for your applications. Advanced navigation, geocoding, and spatial analysis with stunning visual styles.',
            websiteUrl: 'https://mapbox.com',
            documentationUrl: 'https://docs.mapbox.com',
            providerName: 'Mapbox',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free: 50K map loads/month, 100K geocoding requests. Pay-as-you-go after that.',
            useCases: JSON.stringify(['Custom Maps', 'Navigation', 'Geocoding', 'Spatial Analysis', 'AR Navigation']),
            categorySlug: 'maps-geo',
            tagSlugs: ['production-ready', 'sdk-available', 'great-docs'],
            viewCount: 6340,
            bookmarkCount: 412,
            likeCount: 498,
            averageRating: 4.6,
            reviewCount: 78,
        },
        {
            name: 'Resend',
            slug: 'resend',
            description: 'The best API to reach humans instead of spam folders. Modern email API built for developers with React Email integration.',
            websiteUrl: 'https://resend.com',
            documentationUrl: 'https://resend.com/docs',
            providerName: 'Resend',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.MEDIUM,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 100 emails/day, 3,000/month. Pro: $20/mo for 50K emails.',
            useCases: JSON.stringify(['Transactional Email', 'React Email Templates', 'Email Verification', 'Notification Emails']),
            categorySlug: 'email-messaging',
            tagSlugs: ['new', 'trending', 'beginner-friendly', 'great-docs', 'sdk-available'],
            viewCount: 4560,
            bookmarkCount: 367,
            likeCount: 489,
            averageRating: 4.8,
            reviewCount: 45,
        },
        {
            name: 'Supabase',
            slug: 'supabase',
            description: 'Open source Firebase alternative. Build apps with a Postgres database, authentication, real-time subscriptions, storage, and edge functions.',
            websiteUrl: 'https://supabase.com',
            documentationUrl: 'https://supabase.com/docs',
            providerName: 'Supabase',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 2 projects, 500MB database, 1GB storage. Pro: $25/mo for 8GB database.',
            useCases: JSON.stringify(['Database', 'Authentication', 'Real-time Subscriptions', 'File Storage', 'Edge Functions']),
            categorySlug: 'devtools',
            tagSlugs: ['free', 'open-source', 'trending', 'beginner-friendly', 'production-ready', 'great-docs'],
            viewCount: 11800,
            bookmarkCount: 945,
            likeCount: 1289,
            averageRating: 4.8,
            reviewCount: 178,
            isFeatured: true,
        },
        {
            name: 'Algolia',
            slug: 'algolia',
            description: 'Lightning-fast search and discovery API. Build powerful search experiences with typo tolerance, faceting, geo-search, and AI-powered recommendations.',
            websiteUrl: 'https://algolia.com',
            documentationUrl: 'https://www.algolia.com/doc',
            providerName: 'Algolia',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.API_KEY,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free: 10K search requests/mo + 10K records. Premium: from $1/1K requests.',
            useCases: JSON.stringify(['Site Search', 'E-Commerce Search', 'Autocomplete', 'Faceted Navigation', 'Analytics']),
            categorySlug: 'data-analytics',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'enterprise'],
            viewCount: 5670,
            bookmarkCount: 389,
            likeCount: 445,
            averageRating: 4.6,
            reviewCount: 72,
        },
        {
            name: 'Clerk',
            slug: 'clerk',
            description: 'Complete user management platform. Drop-in authentication UI components, user profiles, organizations, and robust backend APIs.',
            websiteUrl: 'https://clerk.com',
            documentationUrl: 'https://clerk.com/docs',
            providerName: 'Clerk',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.BEGINNER,
            pricingSummary: 'Free: 10K monthly active users. Pro: $25/mo + $0.02/MAU after 10K.',
            useCases: JSON.stringify(['User Authentication', 'User Profiles', 'Organization Management', 'Social Login', 'Session Management']),
            categorySlug: 'authentication',
            tagSlugs: ['trending', 'beginner-friendly', 'sdk-available', 'great-docs', 'production-ready'],
            viewCount: 7890,
            bookmarkCount: 623,
            likeCount: 756,
            averageRating: 4.7,
            reviewCount: 89,
        },
        {
            name: 'PayPal REST API',
            slug: 'paypal',
            description: 'Accept payments online and in mobile apps with PayPal. Process credit cards, PayPal payments, subscriptions, and payouts globally.',
            websiteUrl: 'https://developer.paypal.com',
            documentationUrl: 'https://developer.paypal.com/docs/api/overview',
            providerName: 'PayPal',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.OAUTH,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: '3.49% + 49¢ per transaction (US). No monthly fees for standard processing.',
            useCases: JSON.stringify(['Payment Processing', 'Subscriptions', 'Payouts', 'Invoicing', 'Marketplace Payments']),
            categorySlug: 'payments',
            tagSlugs: ['popular', 'production-ready', 'sdk-available', 'enterprise'],
            viewCount: 7200,
            bookmarkCount: 456,
            likeCount: 534,
            averageRating: 4.1,
            reviewCount: 156,
        },
        {
            name: 'Hugging Face Inference',
            slug: 'hugging-face',
            description: 'Access 200K+ open-source AI models. Run inference on text, image, audio, and multimodal models through a simple API or deploy dedicated endpoints.',
            websiteUrl: 'https://huggingface.co',
            documentationUrl: 'https://huggingface.co/docs/api-inference',
            providerName: 'Hugging Face',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.LOW,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free: rate-limited inference on public models. Pro: $9/mo. Inference Endpoints: from $0.06/hr.',
            useCases: JSON.stringify(['Text Generation', 'Image Classification', 'NLP Tasks', 'Model Hosting', 'Fine-tuning']),
            categorySlug: 'ai-ml',
            tagSlugs: ['open-source', 'trending', 'free', 'sdk-available'],
            viewCount: 8900,
            bookmarkCount: 678,
            likeCount: 834,
            averageRating: 4.5,
            reviewCount: 92,
        },
        {
            name: 'Shopify Storefront API',
            slug: 'shopify-storefront',
            description: 'Build custom storefronts and commerce experiences. Access products, collections, checkout, and customer data with a powerful GraphQL API.',
            websiteUrl: 'https://shopify.dev',
            documentationUrl: 'https://shopify.dev/docs/api/storefront',
            providerName: 'Shopify',
            pricingType: PricingType.PAID,
            authType: AuthType.BEARER_TOKEN,
            rateLimit: RateLimit.HIGH,
            difficultyLevel: Difficulty.ADVANCED,
            pricingSummary: 'Requires Shopify subscription ($39+/mo). API access included in all plans.',
            useCases: JSON.stringify(['Headless Commerce', 'Custom Storefronts', 'Product Catalog', 'Cart & Checkout', 'Customer Data']),
            categorySlug: 'e-commerce',
            tagSlugs: ['popular', 'enterprise', 'graphql', 'sdk-available', 'webhook-support'],
            viewCount: 5430,
            bookmarkCount: 345,
            likeCount: 398,
            averageRating: 4.3,
            reviewCount: 67,
        },
        {
            name: 'Twitter/X API',
            slug: 'twitter-x',
            description: 'Access tweets, users, spaces, and trends on the X platform. Build apps, bots, and analytics tools on one of the world\'s largest social networks.',
            websiteUrl: 'https://developer.x.com',
            documentationUrl: 'https://developer.x.com/en/docs',
            providerName: 'X Corp',
            pricingType: PricingType.FREEMIUM,
            authType: AuthType.OAUTH,
            rateLimit: RateLimit.LOW,
            difficultyLevel: Difficulty.INTERMEDIATE,
            pricingSummary: 'Free: read-only, 1,500 tweets/mo. Basic: $100/mo for 3K tweets/mo. Pro: $5,000/mo.',
            useCases: JSON.stringify(['Social Analytics', 'Content Publishing', 'Bot Development', 'Trend Analysis', 'User Research']),
            categorySlug: 'social-media',
            tagSlugs: ['popular', 'rest'],
            viewCount: 6780,
            bookmarkCount: 412,
            likeCount: 356,
            averageRating: 3.2,
            reviewCount: 234,
        },
    ];

    for (const apiData of apisData) {
        const { categorySlug, tagSlugs, ...data } = apiData;
        const category = categories[categorySlug];

        if (!category) {
            console.warn(`⚠️ Category "${categorySlug}" not found, skipping ${data.name}`);
            continue;
        }

        const api = await prisma.api.upsert({
            where: { slug: data.slug },
            update: {},
            create: {
                ...data,
                categoryId: category.id,
            },
        });

        // Create tag associations
        for (const tagSlug of tagSlugs) {
            const tag = tags[tagSlug];
            if (tag) {
                await prisma.apiTag.upsert({
                    where: { apiId_tagId: { apiId: api.id, tagId: tag.id } },
                    update: {},
                    create: { apiId: api.id, tagId: tag.id },
                });
            }
        }
    }

    console.log('✅ APIs created');

    // ─── Sample Reviews ───────────────────────────────────────
    const stripe = await prisma.api.findUnique({ where: { slug: 'stripe' } });
    const openai = await prisma.api.findUnique({ where: { slug: 'openai' } });

    if (stripe) {
        await prisma.review.upsert({
            where: { userId_apiId: { userId: user.id, apiId: stripe.id } },
            update: {},
            create: {
                userId: user.id,
                apiId: stripe.id,
                rating: 5,
                comment: 'Best payment API out there. Documentation is incredible and the SDKs are well-maintained.',
            },
        });
    }

    if (openai) {
        await prisma.review.upsert({
            where: { userId_apiId: { userId: user.id, apiId: openai.id } },
            update: {},
            create: {
                userId: user.id,
                apiId: openai.id,
                rating: 4,
                comment: 'Powerful API but pricing can add up quickly. GPT-4 is amazing for complex tasks.',
            },
        });
    }

    console.log('✅ Sample reviews created');

    // ─── Sample Bookmarks ─────────────────────────────────────
    const github = await prisma.api.findUnique({ where: { slug: 'github' } });
    const supabase = await prisma.api.findUnique({ where: { slug: 'supabase' } });

    for (const api of [stripe, openai, github, supabase]) {
        if (api) {
            await prisma.bookmark.upsert({
                where: { userId_apiId: { userId: user.id, apiId: api.id } },
                update: {},
                create: { userId: user.id, apiId: api.id },
            });
        }
    }

    console.log('✅ Sample bookmarks created');

    console.log('\n🎉 Seeding complete!');
    console.log('Admin: admin@apiscout.com / admin123');
    console.log('User: dev@example.com / user123');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
