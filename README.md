# LinkedIn Clone - Simple Social Media Website

A professional social media application built with Next.js 15, MongoDB, and JWT authentication. This LinkedIn clone features user authentication, post creation, and a real-time feed.

## Features

✅ **User Authentication**
- Sign up with email and password
- Login with JWT token-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

✅ **Post Management**
- Create posts with text content
- View all posts in a feed
- Real-time feed updates
- Character limit (5000 characters)

✅ **User Interface**
- Responsive design with Tailwind CSS
- Dark mode support
- Professional LinkedIn-inspired UI
- Loading states and error handling
- Form validation with react-hook-form

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Form Handling**: React Hook Form
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd linkedin-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/linkedin-clone
   JWT_SECRET=your-secret-key-change-in-production
   ```

   For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-clone?retryWrites=true&w=majority
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── logout/
│   │   │   │   └── me/
│   │   │   └── posts/         # Posts endpoints
│   │   ├── feed/              # Main feed page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── layout.tsx
│   │   └── page.tsx           # Home page (redirects)
│   ├── components/
│   │   └── ui/                # Shadcn/UI components
│   ├── lib/
│   │   ├── mongodb.ts         # MongoDB connection
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── auth.ts            # Auth helper functions
│   │   └── utils.ts
│   └── models/
│       ├── User.ts            # User model
│       └── Post.ts            # Post model
├── .env.example
├── .env.local                 # Your environment variables
└── package.json
```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Create a new user account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "headline": "Software Engineer" // optional
  }
  ```

- **POST** `/api/auth/login` - Login with credentials
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/logout` - Logout (clears JWT cookie)

- **GET** `/api/auth/me` - Get current user info (protected)

### Posts

- **GET** `/api/posts` - Get all posts (sorted by newest first)

- **POST** `/api/posts` - Create a new post (protected)
  ```json
  {
    "content": "This is my post content",
    "imageUrl": "https://example.com/image.jpg" // optional
  }
  ```

## Database Models

### User Model
```typescript
{
  name: string;
  email: string;
  password: string; // hashed
  headline?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Model
```typescript
{
  user: ObjectId; // reference to User
  content: string;
  imageUrl?: string;
  likes: ObjectId[]; // array of User references
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage

1. **Sign Up**: Navigate to `/signup` and create an account
2. **Login**: Use your credentials at `/login`
3. **Create Posts**: Once logged in, you'll be redirected to `/feed` where you can create posts
4. **View Feed**: See all posts from all users in chronological order
5. **Logout**: Click the logout button in the navigation bar

## Security Features

- Passwords are hashed using bcrypt before storing
- JWT tokens are stored in HTTP-only cookies
- Protected API routes require valid authentication
- Email validation and password strength requirements
- CSRF protection with same-site cookies

## Future Enhancements

- [ ] Like and comment on posts
- [ ] User profiles with edit functionality
- [ ] Follow/unfollow users
- [ ] Image upload for posts and profile pictures
- [ ] Search functionality
- [ ] Notifications
- [ ] Private messaging
- [ ] Post editing and deletion
- [ ] Pagination for posts

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/linkedin-clone` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-change-in-production` |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)