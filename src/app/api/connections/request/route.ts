import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { connections, users } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'MISSING_TOKEN' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: JWTPayload;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN' 
      }, { status: 401 });
    }

    const userId = decoded.userId;

    // Parse and validate request body
    const body = await request.json();
    const { connectedUserId } = body;

    // Validate connectedUserId is provided
    if (!connectedUserId) {
      return NextResponse.json({ 
        error: 'connectedUserId is required',
        code: 'MISSING_CONNECTED_USER_ID' 
      }, { status: 400 });
    }

    // Validate connectedUserId is valid integer
    const connectedUserIdInt = parseInt(connectedUserId);
    if (isNaN(connectedUserIdInt)) {
      return NextResponse.json({ 
        error: 'connectedUserId must be a valid integer',
        code: 'INVALID_CONNECTED_USER_ID' 
      }, { status: 400 });
    }

    // Check that user is not trying to connect to themselves
    if (userId === connectedUserIdInt) {
      return NextResponse.json({ 
        error: 'Cannot send connection request to yourself',
        code: 'SELF_CONNECTION_NOT_ALLOWED' 
      }, { status: 400 });
    }

    // Verify target user exists
    const targetUser = await db.select()
      .from(users)
      .where(eq(users.id, connectedUserIdInt))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json({ 
        error: 'Target user not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Check if connection already exists (in either direction)
    const existingConnection = await db.select()
      .from(connections)
      .where(
        or(
          and(
            eq(connections.userId, userId),
            eq(connections.connectedUserId, connectedUserIdInt)
          ),
          and(
            eq(connections.userId, connectedUserIdInt),
            eq(connections.connectedUserId, userId)
          )
        )
      )
      .limit(1);

    if (existingConnection.length > 0) {
      const connection = existingConnection[0];
      
      if (connection.status === 'pending') {
        return NextResponse.json({ 
          error: 'Connection request already pending',
          code: 'CONNECTION_PENDING' 
        }, { status: 400 });
      }
      
      if (connection.status === 'accepted') {
        return NextResponse.json({ 
          error: 'Already connected',
          code: 'ALREADY_CONNECTED' 
        }, { status: 400 });
      }
      
      // If status is 'rejected', allow creating new request (continue to insert)
    }

    // Create new connection request
    const newConnection = await db.insert(connections)
      .values({
        userId: userId,
        connectedUserId: connectedUserIdInt,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      message: 'Connection request sent successfully',
      connection: {
        id: newConnection[0].id,
        userId: newConnection[0].userId,
        connectedUserId: newConnection[0].connectedUserId,
        status: newConnection[0].status,
        createdAt: newConnection[0].createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}