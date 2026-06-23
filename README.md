# Resource Hub — Upload Engine

Handles document uploads, moderation, ratings, reports and SEO for the Resource Hub platform.

## Live URL
https://resource-hub-uploads.vercel.app

## What this does
- Users can upload study documents (past papers, memos, notes, tests)
- Every upload goes into a moderation queue with status `pending`
- Admins can approve or reject documents at `/admin`
- Approved documents get a public page with ratings and reporting
- Every document page has SEO metadata and is included in the sitemap

## Pages
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/upload` | Upload a document |
| `/admin` | Moderation queue |
| `/documents/[id]` | Document detail, ratings, reports |
| `/sitemap.xml` | Auto-generated sitemap for Google |

## Running locally
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with your Supabase credentials: