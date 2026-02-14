-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CONTRIBUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FREE', 'FREEMIUM', 'PAID');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('API_KEY', 'OAUTH', 'NONE', 'BEARER_TOKEN');

-- CreateEnum
CREATE TYPE "RateLimit" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'UNLIMITED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ApiStatus" AS ENUM ('ACTIVE', 'DEPRECATED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('USEFUL', 'OVERPRICED', 'OUTDATED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "documentationUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "providerName" TEXT,
    "pricingType" "PricingType" NOT NULL DEFAULT 'FREE',
    "authType" "AuthType" NOT NULL,
    "rateLimit" "RateLimit" NOT NULL,
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "difficultyLevel" "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "pricingSummary" TEXT,
    "useCases" TEXT,
    "rateLimitInfo" TEXT,
    "authDescription" TEXT,
    "dashboardUrl" TEXT,
    "pricingUrl" TEXT,
    "status" "ApiStatus" NOT NULL DEFAULT 'ACTIVE',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" TIMESTAMP(3),
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_tags" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "api_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_signals" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "userId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "documentationUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "providerContact" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "submittedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_providerId_key" ON "users"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "apis_slug_key" ON "apis"("slug");

-- CreateIndex
CREATE INDEX "apis_slug_idx" ON "apis"("slug");

-- CreateIndex
CREATE INDEX "apis_categoryId_idx" ON "apis"("categoryId");

-- CreateIndex
CREATE INDEX "apis_pricingType_idx" ON "apis"("pricingType");

-- CreateIndex
CREATE INDEX "apis_authType_idx" ON "apis"("authType");

-- CreateIndex
CREATE INDEX "apis_rateLimit_idx" ON "apis"("rateLimit");

-- CreateIndex
CREATE INDEX "apis_status_idx" ON "apis"("status");

-- CreateIndex
CREATE INDEX "apis_isFeatured_idx" ON "apis"("isFeatured");

-- CreateIndex
CREATE INDEX "apis_viewCount_idx" ON "apis"("viewCount");

-- CreateIndex
CREATE INDEX "apis_averageRating_idx" ON "apis"("averageRating");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "api_tags_apiId_idx" ON "api_tags"("apiId");

-- CreateIndex
CREATE INDEX "api_tags_tagId_idx" ON "api_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "api_tags_apiId_tagId_key" ON "api_tags"("apiId", "tagId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE INDEX "bookmarks_apiId_idx" ON "bookmarks"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_apiId_key" ON "bookmarks"("userId", "apiId");

-- CreateIndex
CREATE INDEX "reviews_apiId_idx" ON "reviews"("apiId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_apiId_key" ON "reviews"("userId", "apiId");

-- CreateIndex
CREATE INDEX "feedback_signals_apiId_idx" ON "feedback_signals"("apiId");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_signals_userId_apiId_type_key" ON "feedback_signals"("userId", "apiId", "type");

-- CreateIndex
CREATE INDEX "api_submissions_status_idx" ON "api_submissions"("status");

-- CreateIndex
CREATE INDEX "api_submissions_submittedBy_idx" ON "api_submissions"("submittedBy");

-- AddForeignKey
ALTER TABLE "apis" ADD CONSTRAINT "apis_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tags" ADD CONSTRAINT "api_tags_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "apis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_tags" ADD CONSTRAINT "api_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "apis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "apis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_signals" ADD CONSTRAINT "feedback_signals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_signals" ADD CONSTRAINT "feedback_signals_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "apis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_submissions" ADD CONSTRAINT "api_submissions_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
