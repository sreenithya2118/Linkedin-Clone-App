import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, connections } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid user ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const targetUserId = parseInt(id);

    // Get authenticated user ID if token provided
    let authUserId: number | null = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          console.error('JWT_SECRET not configured');
        } else {
          const decoded = jwt.verify(token, jwtSecret) as { userId: number };
          authUserId = decoded.userId;
        }
      } catch (error) {
        // Invalid token - continue without authentication
        console.warn('Invalid JWT token provided:', error);
      }
    }

    // Find user by ID
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        headline: users.headline,
        bio: users.bio,
        avatar: users.avatar,
        location: users.location,
        company: users.company,
        position: users.position,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // If no authentication, return user without connection status
    if (!authUserId) {
      return NextResponse.json({ user });
    }

    // If viewing own profile
    if (authUserId === targetUserId) {
      return NextResponse.json({
        user,
        connectionStatus: 'self'
      });
    }

    // Check connection status between authenticated user and target user
    const connectionResult = await db
      .select()
      .from(connections)
      .where(
        or(
          and(
            eq(connections.userId, authUserId),
            eq(connections.connectedUserId, targetUserId)
          ),
          and(
            eq(connections.userId, targetUserId),
            eq(connections.connectedUserId, authUserId)
          )
        )
      )
      .limit(1);

    let connectionStatus: string | null = null;

    if (connectionResult.length > 0) {
      const connection = connectionResult[0];
      
      if (connection.status === 'accepted') {
        connectionStatus = 'connected';
      } else if (connection.status === 'pending') {
        if (connection.userId === authUserId) {
          connectionStatus = 'pending_sent';
        } else {
          connectionStatus = 'pending_received';
        }
      } else if (connection.status === 'rejected') {
        // If rejected, treat as no connection
        connectionStatus = null;
      }
    }

    return NextResponse.json({
      user,
      connectionStatus
    });

  } catch (error) {
    console.error('GET user profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}