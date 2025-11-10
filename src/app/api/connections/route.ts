import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { connections, users } from '@/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
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
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        userId: number;
        email: string;
      };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const authenticatedUserId = decoded.userId;

    // Query all accepted connections where the authenticated user is involved
    const acceptedConnections = await db
      .select()
      .from(connections)
      .where(
        and(
          eq(connections.status, 'accepted'),
          or(
            eq(connections.userId, authenticatedUserId),
            eq(connections.connectedUserId, authenticatedUserId)
          )
        )
      )
      .orderBy(desc(connections.createdAt));

    // For each connection, determine the "other" user and fetch their details
    const connectionsWithUsers = await Promise.all(
      acceptedConnections.map(async (connection) => {
        // Determine which user is the "other" user
        const otherUserId =
          connection.userId === authenticatedUserId
            ? connection.connectedUserId
            : connection.userId;

        // Fetch the other user's details
        const [connectedUser] = await db
          .select({
            id: users.id,
            name: users.name,
            headline: users.headline,
            avatar: users.avatar,
            location: users.location,
            company: users.company,
            position: users.position,
          })
          .from(users)
          .where(eq(users.id, otherUserId))
          .limit(1);

        return {
          id: connection.id,
          userId: connection.userId,
          connectedUserId: connection.connectedUserId,
          status: connection.status,
          createdAt: connection.createdAt,
          connectedUser: connectedUser || null,
        };
      })
    );

    // Filter out any connections where the user details couldn't be found
    const validConnections = connectionsWithUsers.filter(
      (conn) => conn.connectedUser !== null
    );

    return NextResponse.json(
      {
        connections: validConnections,
        count: validConnections.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET connections error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}