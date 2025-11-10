import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { likes, posts } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract and validate post ID
    const postId = params.id;
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    const parsedPostId = parseInt(postId);

    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: { userId: number; email: string };

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Check if post exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, parsedPostId))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, parsedPostId)))
      .limit(1);

    let isLiked: boolean;
    let message: string;

    if (existingLike.length > 0) {
      // Unlike: Delete the like and decrement likesCount
      await db
        .delete(likes)
        .where(and(eq(likes.userId, userId), eq(likes.postId, parsedPostId)));

      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} - 1` })
        .where(eq(posts.id, parsedPostId));

      isLiked = false;
      message = 'Post unliked';
    } else {
      // Like: Insert new like and increment likesCount
      await db.insert(likes).values({
        userId,
        postId: parsedPostId,
        createdAt: new Date().toISOString(),
      });

      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} + 1` })
        .where(eq(posts.id, parsedPostId));

      isLiked = true;
      message = 'Post liked';
    }

    // Fetch updated post
    const updatedPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, parsedPostId))
      .limit(1);

    return NextResponse.json(
      {
        message,
        isLiked,
        likesCount: updatedPost[0].likesCount || 0,
        post: updatedPost[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST like toggle error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}