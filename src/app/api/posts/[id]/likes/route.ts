import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { likes, users, posts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Validate post ID is a valid integer
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { 
          error: 'Valid post ID is required',
          code: 'INVALID_POST_ID'
        },
        { status: 400 }
      );
    }

    const postIdInt = parseInt(postId);

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postIdInt))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { 
          error: 'Post not found',
          code: 'POST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Query likes with user information
    const postLikes = await db
      .select({
        id: likes.id,
        userId: likes.userId,
        postId: likes.postId,
        createdAt: likes.createdAt,
        user: {
          id: users.id,
          name: users.name,
          headline: users.headline,
          avatar: users.avatar,
        },
      })
      .from(likes)
      .leftJoin(users, eq(likes.userId, users.id))
      .where(eq(likes.postId, postIdInt))
      .orderBy(desc(likes.createdAt));

    return NextResponse.json(
      {
        likes: postLikes,
        count: postLikes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET likes error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}