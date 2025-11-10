import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { connections, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Authentication token is required',
        code: 'MISSING_TOKEN' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: { userId: number; email: string };

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number; email: string };
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN' 
      }, { status: 401 });
    }

    const userId = decoded.userId;

    // Query pending connection requests where the authenticated user is the receiver
    const pendingRequests = await db
      .select({
        id: connections.id,
        userId: connections.userId,
        connectedUserId: connections.connectedUserId,
        status: connections.status,
        createdAt: connections.createdAt,
        requester: {
          id: users.id,
          name: users.name,
          headline: users.headline,
          avatar: users.avatar,
          location: users.location,
          company: users.company,
          position: users.position,
        },
      })
      .from(connections)
      .leftJoin(users, eq(connections.userId, users.id))
      .where(
        and(
          eq(connections.connectedUserId, userId),
          eq(connections.status, 'pending')
        )
      )
      .orderBy(desc(connections.createdAt));

    return NextResponse.json({
      requests: pendingRequests,
      count: pendingRequests.length,
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}