import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  email: string;
}

interface UpdateProfileBody {
  name?: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  company?: string;
  position?: string;
}

export async function PUT(request: NextRequest) {
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
    let decoded: JWTPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Parse request body
    const body: UpdateProfileBody = await request.json();

    // Validate at least one field is provided
    const updateableFields = ['name', 'headline', 'bio', 'avatar', 'location', 'company', 'position'];
    const providedFields = Object.keys(body).filter(key => updateableFields.includes(key));

    if (providedFields.length === 0) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update', code: 'NO_FIELDS_PROVIDED' },
        { status: 400 }
      );
    }

    // Build update object with validation
    const updates: Partial<typeof users.$inferInsert> = {};

    // Validate and process name
    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (trimmedName.length < 1) {
        return NextResponse.json(
          { error: 'Name must be at least 1 character', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    // Validate and process headline
    if (body.headline !== undefined) {
      const trimmedHeadline = body.headline.trim();
      if (trimmedHeadline.length > 120) {
        return NextResponse.json(
          { error: 'Headline must not exceed 120 characters', code: 'INVALID_HEADLINE' },
          { status: 400 }
        );
      }
      updates.headline = trimmedHeadline;
    }

    // Validate and process bio
    if (body.bio !== undefined) {
      const trimmedBio = body.bio.trim();
      if (trimmedBio.length > 2000) {
        return NextResponse.json(
          { error: 'Bio must not exceed 2000 characters', code: 'INVALID_BIO' },
          { status: 400 }
        );
      }
      updates.bio = trimmedBio;
    }

    // Validate and process avatar URL
    if (body.avatar !== undefined) {
      const trimmedAvatar = body.avatar.trim();
      if (trimmedAvatar.length > 0) {
        try {
          new URL(trimmedAvatar);
          updates.avatar = trimmedAvatar;
        } catch (error) {
          return NextResponse.json(
            { error: 'Avatar must be a valid URL', code: 'INVALID_AVATAR_URL' },
            { status: 400 }
          );
        }
      } else {
        updates.avatar = trimmedAvatar;
      }
    }

    // Validate and process location
    if (body.location !== undefined) {
      const trimmedLocation = body.location.trim();
      if (trimmedLocation.length > 100) {
        return NextResponse.json(
          { error: 'Location must not exceed 100 characters', code: 'INVALID_LOCATION' },
          { status: 400 }
        );
      }
      updates.location = trimmedLocation;
    }

    // Validate and process company
    if (body.company !== undefined) {
      const trimmedCompany = body.company.trim();
      if (trimmedCompany.length > 100) {
        return NextResponse.json(
          { error: 'Company must not exceed 100 characters', code: 'INVALID_COMPANY' },
          { status: 400 }
        );
      }
      updates.company = trimmedCompany;
    }

    // Validate and process position
    if (body.position !== undefined) {
      const trimmedPosition = body.position.trim();
      if (trimmedPosition.length > 100) {
        return NextResponse.json(
          { error: 'Position must not exceed 100 characters', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
      updates.position = trimmedPosition;
    }

    // Update user in database
    const updatedUsers = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (updatedUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = updatedUsers[0];

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: userWithoutPassword
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}