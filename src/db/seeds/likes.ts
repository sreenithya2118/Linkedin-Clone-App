import { db } from '@/db';
import { likes, posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
    // Post ownership mapping (userId who created each post)
    const postOwnership = {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
        9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 6, 15: 7, 16: 8, 17: 1, 18: 2
    };

    const sampleLikes = [
        // Post 1 - Popular (5 likes)
        { userId: 2, postId: 1, createdAt: new Date('2024-01-15T10:30:00').toISOString() },
        { userId: 3, postId: 1, createdAt: new Date('2024-01-15T11:15:00').toISOString() },
        { userId: 4, postId: 1, createdAt: new Date('2024-01-15T14:20:00').toISOString() },
        { userId: 6, postId: 1, createdAt: new Date('2024-01-15T16:45:00').toISOString() },
        { userId: 8, postId: 1, createdAt: new Date('2024-01-16T09:10:00').toISOString() },

        // Post 2 - Popular (6 likes)
        { userId: 1, postId: 2, createdAt: new Date('2024-01-16T11:20:00').toISOString() },
        { userId: 3, postId: 2, createdAt: new Date('2024-01-16T12:30:00').toISOString() },
        { userId: 4, postId: 2, createdAt: new Date('2024-01-16T13:45:00').toISOString() },
        { userId: 5, postId: 2, createdAt: new Date('2024-01-16T15:10:00').toISOString() },
        { userId: 7, postId: 2, createdAt: new Date('2024-01-17T08:25:00').toISOString() },
        { userId: 8, postId: 2, createdAt: new Date('2024-01-17T10:40:00').toISOString() },

        // Post 3 - Popular (5 likes)
        { userId: 1, postId: 3, createdAt: new Date('2024-01-17T12:15:00').toISOString() },
        { userId: 2, postId: 3, createdAt: new Date('2024-01-17T13:30:00').toISOString() },
        { userId: 5, postId: 3, createdAt: new Date('2024-01-17T15:45:00').toISOString() },
        { userId: 6, postId: 3, createdAt: new Date('2024-01-18T09:20:00').toISOString() },
        { userId: 8, postId: 3, createdAt: new Date('2024-01-18T11:35:00').toISOString() },

        // Post 4 - Medium (3 likes)
        { userId: 1, postId: 4, createdAt: new Date('2024-01-18T14:10:00').toISOString() },
        { userId: 3, postId: 4, createdAt: new Date('2024-01-18T16:25:00').toISOString() },
        { userId: 7, postId: 4, createdAt: new Date('2024-01-19T10:40:00').toISOString() },

        // Post 5 - Popular (6 likes)
        { userId: 1, postId: 5, createdAt: new Date('2024-01-19T11:50:00').toISOString() },
        { userId: 2, postId: 5, createdAt: new Date('2024-01-19T13:15:00').toISOString() },
        { userId: 3, postId: 5, createdAt: new Date('2024-01-19T14:30:00').toISOString() },
        { userId: 4, postId: 5, createdAt: new Date('2024-01-19T16:45:00').toISOString() },
        { userId: 6, postId: 5, createdAt: new Date('2024-01-20T09:10:00').toISOString() },
        { userId: 8, postId: 5, createdAt: new Date('2024-01-20T11:25:00').toISOString() },

        // Post 6 - Medium (2 likes)
        { userId: 2, postId: 6, createdAt: new Date('2024-01-20T13:40:00').toISOString() },
        { userId: 5, postId: 6, createdAt: new Date('2024-01-20T15:55:00').toISOString() },

        // Post 7 - Lower (1 like)
        { userId: 3, postId: 7, createdAt: new Date('2024-01-21T10:20:00').toISOString() },

        // Post 8 - Medium (3 likes)
        { userId: 1, postId: 8, createdAt: new Date('2024-01-21T12:35:00').toISOString() },
        { userId: 3, postId: 8, createdAt: new Date('2024-01-21T14:50:00').toISOString() },
        { userId: 6, postId: 8, createdAt: new Date('2024-01-22T09:15:00').toISOString() },

        // Post 9 - Lower (2 likes)
        { userId: 4, postId: 9, createdAt: new Date('2024-01-22T11:30:00').toISOString() },
        { userId: 7, postId: 9, createdAt: new Date('2024-01-22T13:45:00').toISOString() },

        // Post 10 - Medium (2 likes)
        { userId: 1, postId: 10, createdAt: new Date('2024-01-22T15:10:00').toISOString() },
        { userId: 5, postId: 10, createdAt: new Date('2024-01-23T09:25:00').toISOString() },

        // Post 11 - Lower (1 like)
        { userId: 2, postId: 11, createdAt: new Date('2024-01-23T11:40:00').toISOString() },

        // Post 12 - Popular (4 likes)
        { userId: 1, postId: 12, createdAt: new Date('2024-01-23T13:55:00').toISOString() },
        { userId: 3, postId: 12, createdAt: new Date('2024-01-23T16:10:00').toISOString() },
        { userId: 6, postId: 12, createdAt: new Date('2024-01-24T09:30:00').toISOString() },
        { userId: 8, postId: 12, createdAt: new Date('2024-01-24T11:45:00').toISOString() },

        // Post 13 - Lower (0 likes)

        // Post 14 - Medium (3 likes)
        { userId: 1, postId: 14, createdAt: new Date('2024-01-24T14:00:00').toISOString() },
        { userId: 4, postId: 14, createdAt: new Date('2024-01-24T16:15:00').toISOString() },
        { userId: 7, postId: 14, createdAt: new Date('2024-01-25T10:30:00').toISOString() },

        // Post 15 - Lower (1 like)
        { userId: 2, postId: 15, createdAt: new Date('2024-01-25T12:45:00').toISOString() },

        // Post 16 - Popular (5 likes)
        { userId: 1, postId: 16, createdAt: new Date('2024-01-25T15:00:00').toISOString() },
        { userId: 2, postId: 16, createdAt: new Date('2024-01-26T09:20:00').toISOString() },
        { userId: 4, postId: 16, createdAt: new Date('2024-01-26T11:35:00').toISOString() },
        { userId: 5, postId: 16, createdAt: new Date('2024-01-26T13:50:00').toISOString() },
        { userId: 7, postId: 16, createdAt: new Date('2024-01-26T16:05:00').toISOString() },

        // Post 17 - Medium (2 likes)
        { userId: 3, postId: 17, createdAt: new Date('2024-01-27T10:25:00').toISOString() },
        { userId: 6, postId: 17, createdAt: new Date('2024-01-27T12:40:00').toISOString() },

        // Post 18 - Popular (4 likes)
        { userId: 1, postId: 18, createdAt: new Date('2024-01-27T14:55:00').toISOString() },
        { userId: 4, postId: 18, createdAt: new Date('2024-01-27T17:10:00').toISOString() },
        { userId: 6, postId: 18, createdAt: new Date('2024-01-28T09:30:00').toISOString() },
        { userId: 7, postId: 18, createdAt: new Date('2024-01-28T11:45:00').toISOString() },
    ];

    // Insert all likes
    await db.insert(likes).values(sampleLikes);

    // Count likes per post and update posts.likesCount
    const likeCounts = {
        1: 5, 2: 6, 3: 5, 4: 3, 5: 6, 6: 2, 7: 1, 8: 3, 9: 2,
        10: 2, 11: 1, 12: 4, 13: 0, 14: 3, 15: 1, 16: 5, 17: 2, 18: 4
    };

    // Update each post's likesCount
    for (const [postId, count] of Object.entries(likeCounts)) {
        await db.update(posts)
            .set({ likesCount: count })
            .where(eq(posts.id, parseInt(postId)));
    }

    console.log('✅ Likes seeder completed successfully');
    console.log(`   - Inserted ${sampleLikes.length} likes`);
    console.log('   - Updated likesCount for all 18 posts');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});