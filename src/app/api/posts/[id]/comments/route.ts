import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, users, posts } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Validate post ID
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    const postIdNum = parseInt(postId);

    // Check if post exists
    const postExists = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postIdNum))
      .limit(1);

    if (postExists.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Query comments with user information
    const postComments = await db
      .select({
        id: comments.id,
        userId: comments.userId,
        postId: comments.postId,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          headline: users.headline,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postIdNum))
      .orderBy(asc(comments.createdAt));

    return NextResponse.json(
      {
        comments: postComments,
        count: postComments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Validate post ID
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    const postIdNum = parseInt(postId);

    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_TOKEN' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: number;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: number; email: string };
      userId = decoded.userId;
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    // Check if post exists
    const postExists = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postIdNum))
      .limit(1);

    if (postExists.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { content } = body;

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty', code: 'EMPTY_CONTENT' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 2000) {
      return NextResponse.json(
        {
          error: 'Content cannot exceed 2000 characters',
          code: 'CONTENT_TOO_LONG',
        },
        { status: 400 }
      );
    }

    // Insert new comment
    const newComment = await db
      .insert(comments)
      .values({
        userId: userId,
        postId: postIdNum,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Increment post comments count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, postIdNum));

    // Get user information for the response
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        headline: users.headline,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        comment: {
          ...newComment[0],
          user: user[0],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}