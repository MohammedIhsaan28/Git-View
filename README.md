# Gitview

A modern Next.js application for managing GitHub projects, meetings, and team collaboration with AI-powered features.

## 🚀 Features

- **Project Management**: Create and manage GitHub-connected projects
- **Team Collaboration**: Invite team members and manage permissions
- **Meeting Management**: Schedule and track project meetings
- **Q&A System**: Built-in question and answer system for teams
- **AI Integration**: Google Gemini and LangChain for intelligent features
- **Code Analysis**: GitHub integration for code insights and references
- **Audio Processing**: Assembly AI integration for meeting transcription
- **File Upload**: UploadThing integration for file management
- **Billing System**: Stripe integration for subscription management
- **Real-time Sync**: tRPC for real-time client-server communication
- **Authentication**: Clerk authentication for secure user management
- **Dark Mode**: Theme support with next-themes

## 📋 Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) 16.1.1
- **UI Library**: [React](https://react.dev/) 19.2.3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 + [Radix UI](https://radix-ui.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **State Management**: [TanStack React Query](https://tanstack.com/query/latest)

### Backend

- **Runtime**: Node.js
- **API Layer**: [tRPC](https://trpc.io/) for type-safe RPC
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Authentication**: [Clerk](https://clerk.com/)

### AI & Integrations

- **LLM**: [Google Generative AI](https://ai.google.dev/) (Gemini)
- **LangChain**: For AI orchestration
- **GitHub**: [Octokit](https://octokit.js.org/) for GitHub API integration
- **Audio**: [AssemblyAI](https://www.assemblyai.com/) for speech-to-text
- **Storage**: [UploadThing](https://uploadthing.com/) for file uploads
- **Payments**: [Stripe](https://stripe.com/) for billing

### Development Tools

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Database Migration**: Prisma Migrations

## 📁 Project Structure

```
gitview/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (auth required)
│   │   ├── dashboard/           # Main dashboard
│   │   ├── billing/             # Billing management
│   │   ├── meetings/            # Meetings management
│   │   ├── qa/                  # Q&A system
│   │   ├── create/              # Create project
│   │   └── join/                # Join project
│   ├── api/                     # API routes
│   │   ├── routers/             # tRPC routers
│   │   ├── webhook/             # Webhook handlers (Stripe)
│   │   └── process-meeting/     # Meeting processing
│   └── auth/                    # Auth pages (sign-in, sign-up)
├── components/
│   ├── common/                  # Shared components
│   ├── ui/                      # Reusable UI components
│   └── Providers.tsx            # App providers wrapper
├── lib/
│   ├── db.ts                    # Database utilities
│   ├── gemini.ts                # Google Gemini integration
│   ├── github.ts                # GitHub integration
│   ├── stripe.ts                # Stripe integration
│   ├── firebase.ts              # Firebase integration
│   ├── uploadthing.ts           # File upload config
│   └── utils.ts                 # Utility functions
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- GitHub account (for GitHub integration)
- Google Cloud API key (for Gemini)
- Stripe account (for payments)
- Clerk account (for authentication)
- UploadThing account (for file uploads)
- AssemblyAI account (for audio processing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gitview
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gitview"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # Google Gemini
   GOOGLE_API_KEY=your_google_api_key

   # GitHub
   GITHUB_TOKEN=your_github_token

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

   # UploadThing
   UPLOADTHING_TOKEN=your_uploadthing_token

   # AssemblyAI
   ASSEMBLYAI_API_KEY=your_assemblyai_key

   # Firebase (if needed)
   FIREBASE_CONFIG=your_firebase_config
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🗄️ Database

This project uses PostgreSQL with Prisma ORM. The schema includes:

- Users (via Clerk)
- Projects
- Teams and Team Members
- Meetings and Meeting Transcripts
- Q&A (Questions and Answers)
- Billing and Subscriptions

To view or modify the database schema:

```bash
npx prisma studio
```

## 🔐 Authentication

This project uses [Clerk](https://clerk.com/) for authentication. Users can sign in via email, Google, GitHub, and other social providers.

Protected routes require authentication and are located in the `app/(protected)` directory.

## 💳 Billing

The application integrates with Stripe for subscription management. Users can:

- View billing information
- Manage subscriptions
- View invoice history
- Update payment methods

## 🤖 AI Features

The application leverages:

- **Google Gemini API** for intelligent code analysis and Q&A
- **LangChain** for complex AI workflows
- **AssemblyAI** for meeting transcription and analysis

## 🔗 Integrations

### GitHub

- Clone repositories and analyze code
- Extract code references for Q&A
- Track commits and contributions

### Stripe

- Manage subscription billing
- Handle webhooks for payment events
- Store billing information

### UploadThing

- Upload and manage project files
- Store meeting recordings or documents

## 🚀 Deployment

This project is ready to deploy on:

- **Vercel** (recommended for Next.js)

### Deployment Checklist

1. Set all environment variables in your hosting platform
2. Set up PostgreSQL database
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`



## 📧 Support

For support, please contact via github or open an issue on GitHub.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.com/)
- [tRPC](https://trpc.io/)
- [Stripe](https://stripe.com/)
- [Google Cloud](https://cloud.google.com/)
