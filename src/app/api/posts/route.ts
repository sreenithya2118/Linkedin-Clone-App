import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { posts, users, likes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// GET all posts with user information, likes/comments counts, and isLiked status
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user ID if token provided
    let authUserId: number | null = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-secret-key'
        ) as { userId: number; email: string };
        authUserId = decoded.userId;
      } catch (error) {
        // Invalid token - continue without authentication
      }
    }

    const postsWithUsers = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          headline: users.headline,
          avatar: users.avatar,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));

    // If authenticated, check which posts the user liked
    let likedPostIds: number[] = [];
    if (authUserId) {
      const userLikes = await db
        .select({ postId: likes.postId })
        .from(likes)
        .where(eq(likes.userId, authUserId));
      likedPostIds = userLikes.map(like => like.postId);
    }

    // Add isLiked flag to each post
    const postsWithLikeStatus = postsWithUsers.map(post => ({
      ...post,
      isLiked: authUserId ? likedPostIds.includes(post.id) : false,
    }));

    return NextResponse.json({ posts: postsWithLikeStatus }, { status: 200 });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

// POST create a new post (protected)
export async function POST(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract and verify token
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content cannot exceed 5000 characters' },
        { status: 400 }
      );
    }

    // Create post
    const newPost = await db
      .insert(posts)
      .values({
        userId: decoded.userId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Fetch the created post with user information
    const postWithUser = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          headline: users.headline,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, newPost[0].id))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: postWithUser[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}