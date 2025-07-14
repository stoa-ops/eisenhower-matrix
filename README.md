# Eisenhower Matrix - Todoist Integration

A modern web application that connects to your Todoist account and organizes your tasks using the Eisenhower Matrix (urgent/important quadrants) with drag-and-drop functionality.

## Features

- **Todoist OAuth Integration**: Secure authentication with your Todoist account
- **Eisenhower Matrix**: Organize tasks into 4 quadrants:
  - **Do**: Urgent & Important
  - **Schedule**: Important, Not Urgent
  - **Delegate**: Urgent, Not Important
  - **Delete**: Not Urgent, Not Important
- **Drag & Drop**: Move tasks between quadrants easily
- **Task Management**: Create, edit, complete, and delete tasks
- **Real-time Sync**: Changes sync back to your Todoist account
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Todoist OAuth
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core
- **API**: Todoist REST API v2
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Todoist account
- Basic knowledge of React/Next.js

### 2. Todoist App Registration

1. Go to [Todoist App Management](https://todoist.com/app_console)
2. Create a new app
3. Set the redirect URI to: `http://localhost:3000/api/auth/callback/todoist`
4. Note your Client ID and Client Secret

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
TODOIST_CLIENT_ID=your-todoist-client-id
TODOIST_CLIENT_SECRET=your-todoist-client-secret
```

### 4. Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### 5. Usage

1. Visit `http://localhost:3000`
2. Click "Connect with Todoist"
3. Authorize the application
4. Start organizing your tasks!

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Main dashboard
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── DragDropMatrix.tsx # Main matrix component
│   ├── TaskCard.tsx       # Task display component
│   └── Layout.tsx         # App layout
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript definitions
└── middleware.ts          # Route protection
```

## Task Categorization Logic

Tasks are automatically categorized based on:

- **Urgency**: 
  - Due date within 2 days = urgent
  - High priority (P3-P4) = urgent
- **Importance**:
  - Priority 3-4 = important
  - Contains keywords: "project", "deadline", "meeting", "presentation", "review"

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]` - Complete task

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production URL
5. Update Todoist app redirect URI to your production URL

### Other Platforms

The app can be deployed to any platform that supports Next.js applications. Make sure to:

1. Set all environment variables
2. Update the Todoist redirect URI
3. Set `NEXTAUTH_URL` to your production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for personal use and learning purposes.

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check your Todoist Client ID and Secret
2. **Tasks Not Loading**: Verify your Todoist API permissions
3. **Drag & Drop Not Working**: Ensure you have the latest version of @dnd-kit

### Support

For issues and questions:
1. Check the [Todoist API documentation](https://developer.todoist.com/rest/v2/)
2. Review the [NextAuth.js documentation](https://next-auth.js.org/)
3. Open an issue in the repository

---

Built with ❤️ for better task management and productivity.
