# 達特每日儲值輪盤簽到活動

A luxury slot machine lottery application with Supabase backend and admin dashboard.

## Features

- 🎰 **Slot Machine Lottery**: Beautiful glass-morphism design with 3-reel slot machine
- 💰 **Multiple Prize Tiers**: Three deposit amounts ($1,000, $5,000, $10,000) with different prize pools
- 📸 **Image Upload**: Users can upload deposit proof images
- 📊 **Admin Dashboard**: Comprehensive admin panel to view all entries, filter, and manage data
- 🗄️ **Supabase Backend**: All data stored in Supabase for persistence
- 🚀 **Zeabur Ready**: Optimized for deployment on Zeabur

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Runtime**: Bun
- **Deployment**: Zeabur

## Getting Started

### Prerequisites

- Bun installed (https://bun.sh)
- A Supabase account (https://supabase.com)
- Node.js 18+ (optional, if not using Bun)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd luxury-slot-app
```

2. Install dependencies:
```bash
bun install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL from `SUPABASE_SETUP.md` to create the database schema
   - Copy your project URL and anon key

4. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Run the development server:
```bash
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
luxury-slot-app/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin pages
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   └── page.tsx       # Admin login
│   │   ├── page.tsx           # Main lottery page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── SlotMachine.tsx    # Slot machine component
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts        # Supabase client & functions
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript types
├── SUPABASE_SETUP.md          # Database setup guide
├── ZEABUR_DEPLOYMENT.md       # Deployment guide
└── README.md                  # This file
```

## Usage

### User Flow

1. **Account Confirmation**: Enter your 3A/朕天下 account
2. **Amount Selection**: Choose deposit amount ($1,000, $5,000, or $10,000)
3. **Image Upload**: Upload deposit proof image
4. **Lottery**: Spin the slot machine to win prizes

### Admin Dashboard

1. Navigate to `/admin`
2. Login with credentials (stored in localStorage for demo)
3. View all entries with:
   - Search by username
   - Filter by deposit amount
   - View/download uploaded images
   - Delete individual entries
   - Clear all entries
   - Generate test data

## Prize Distribution

### $1,000 Tier
- 58獎金: 80%
- 168獎金: 10%
- 馬逼簽名: 9%
- 666獎金: 1%

### $5,000 Tier
- 188獎金: 80%
- 388獎金: 10%
- 馬逼簽名: 9%
- 1688獎金: 1%

### $10,000 Tier
- 388獎金: 80%
- 1288獎金: 10%
- 馬逼簽名: 9%
- 3688獎金: 1%

## Database Schema

See `SUPABASE_SETUP.md` for the complete database schema and setup instructions.

## Deployment

### Zeabur Deployment

See `ZEABUR_DEPLOYMENT.md` for detailed deployment instructions.

Quick steps:
1. Push code to Git repository
2. Create a Supabase project and set up database
3. Create a Zeabur project
4. Connect your Git repository
5. Add environment variables
6. Deploy!

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run linter

### Adding New Features

1. Database changes: Update schema in Supabase and `src/lib/supabase.ts`
2. UI changes: Components are in `src/components/`
3. Pages: Add new pages in `src/app/`

## Security Considerations

⚠️ **Important**: This is a demo application. For production use:

1. Implement proper authentication (use Supabase Auth)
2. Set up proper Row Level Security (RLS) policies
3. Use Supabase Storage for images instead of base64
4. Add rate limiting
5. Implement CSRF protection
6. Validate and sanitize all user inputs
7. Use environment variables for sensitive data
8. Set up proper CORS policies

## License

MIT

## Support

For issues and questions:
- Check the deployment guides
- Review Supabase docs: https://supabase.com/docs
- Review Zeabur docs: https://zeabur.com/docs
