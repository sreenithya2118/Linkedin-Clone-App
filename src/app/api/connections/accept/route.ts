import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { connections } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_TOKEN' },
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

    // Parse request body
    const body = await request.json();
    const { connectionId } = body;

    // Validate connectionId
    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required', code: 'MISSING_CONNECTION_ID' },
        { status: 400 }
      );
    }

    const parsedConnectionId = parseInt(connectionId);
    if (isNaN(parsedConnectionId)) {
      return NextResponse.json(
        { error: 'Valid connection ID is required', code: 'INVALID_CONNECTION_ID' },
        { status: 400 }
      );
    }

    // Find the connection by ID
    const connectionResult = await db
      .select()
      .from(connections)
      .where(eq(connections.id, parsedConnectionId))
      .limit(1);

    if (connectionResult.length === 0) {
      return NextResponse.json(
        { error: 'Connection not found', code: 'CONNECTION_NOT_FOUND' },
        { status: 404 }
      );
    }

    const connection = connectionResult[0];

    // Verify that the authenticated user is the receiver
    if (connection.connectedUserId !== authenticatedUserId) {
      return NextResponse.json(
        {
          error: 'You are not authorized to accept this connection request',
          code: 'NOT_AUTHORIZED',
        },
        { status: 403 }
      );
    }

    // Verify that the connection status is "pending"
    if (connection.status !== 'pending') {
      return NextResponse.json(
        {
          error: 'Connection request is not pending',
          code: 'CONNECTION_NOT_PENDING',
        },
        { status: 400 }
      );
    }

    // Update the connection status to "accepted"
    const updatedConnection = await db
      .update(connections)
      .set({ status: 'accepted' })
      .where(eq(connections.id, parsedConnectionId))
      .returning();

    if (updatedConnection.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update connection', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Connection request accepted',
        connection: {
          id: updatedConnection[0].id,
          userId: updatedConnection[0].userId,
          connectedUserId: updatedConnection[0].connectedUserId,
          status: updatedConnection[0].status,
          createdAt: updatedConnection[0].createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}