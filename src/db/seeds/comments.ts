import { db } from '@/db';
import { comments, posts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
    const sampleComments = [
        // Post 1 comments (4 comments - popular post)
        {
            userId: 2,
            postId: 1,
            content: 'Congratulations on this achievement! Well deserved! 🎉',
            createdAt: new Date('2024-01-16T10:30:00').toISOString(),
        },
        {
            userId: 3,
            postId: 1,
            content: 'This is inspiring! What was your favorite session at the conference?',
            createdAt: new Date('2024-01-16T14:20:00').toISOString(),
        },
        {
            userId: 5,
            postId: 1,
            content: 'Great insights! Would love to connect and learn more about your experience.',
            createdAt: new Date('2024-01-16T16:45:00').toISOString(),
        },
        {
            userId: 1,
            postId: 1,
            content: 'Thanks everyone! The keynote on AI ethics was definitely the highlight for me.',
            createdAt: new Date('2024-01-16T18:00:00').toISOString(),
        },

        // Post 2 comments (5 comments - popular post)
        {
            userId: 1,
            postId: 2,
            content: 'Congratulations Sarah! This is a huge milestone! 🚀',
            createdAt: new Date('2024-01-17T09:15:00').toISOString(),
        },
        {
            userId: 4,
            postId: 2,
            content: 'Well deserved! Your dedication to the team has been exceptional.',
            createdAt: new Date('2024-01-17T11:30:00').toISOString(),
        },
        {
            userId: 6,
            postId: 2,
            content: 'Amazing news! What are you most excited about in your new role?',
            createdAt: new Date('2024-01-17T13:45:00').toISOString(),
        },
        {
            userId: 8,
            postId: 2,
            content: 'Congrats Sarah! Lets catch up soon to celebrate!',
            createdAt: new Date('2024-01-17T15:20:00').toISOString(),
        },
        {
            userId: 2,
            postId: 2,
            content: 'Thank you all! Most excited about mentoring the new team members!',
            createdAt: new Date('2024-01-17T17:00:00').toISOString(),
        },

        // Post 3 comments (4 comments - popular post)
        {
            userId: 2,
            postId: 3,
            content: 'This resonates with me! The burnout struggle is real in our industry.',
            createdAt: new Date('2024-01-18T10:00:00').toISOString(),
        },
        {
            userId: 5,
            postId: 3,
            content: 'Great advice! I would also add setting clear work-life boundaries.',
            createdAt: new Date('2024-01-18T12:30:00').toISOString(),
        },
        {
            userId: 7,
            postId: 3,
            content: 'Taking regular breaks has been a game-changer for me. Thanks for sharing!',
            createdAt: new Date('2024-01-18T14:15:00').toISOString(),
        },
        {
            userId: 3,
            postId: 3,
            content: 'Appreciate these tips! Mental health in tech needs more conversations like this.',
            createdAt: new Date('2024-01-18T16:45:00').toISOString(),
        },

        // Post 4 comments (2 comments - medium post)
        {
            userId: 3,
            postId: 4,
            content: 'Looking forward to reading it! Always interested in your perspectives.',
            createdAt: new Date('2024-01-19T11:00:00').toISOString(),
        },
        {
            userId: 6,
            postId: 4,
            content: 'Will definitely check this out! Thanks for sharing your knowledge.',
            createdAt: new Date('2024-01-19T15:30:00').toISOString(),
        },

        // Post 5 comments (5 comments - popular post)
        {
            userId: 1,
            postId: 5,
            content: 'This is so helpful! How long did it take you to prepare this guide?',
            createdAt: new Date('2024-01-20T09:30:00').toISOString(),
        },
        {
            userId: 4,
            postId: 5,
            content: 'Bookmarked! This is exactly what our team needs right now.',
            createdAt: new Date('2024-01-20T11:45:00').toISOString(),
        },
        {
            userId: 7,
            postId: 5,
            content: 'Outstanding resource! Would you consider doing a workshop on this?',
            createdAt: new Date('2024-01-20T13:20:00').toISOString(),
        },
        {
            userId: 8,
            postId: 5,
            content: 'The code examples are super clear. Thank you for this!',
            createdAt: new Date('2024-01-20T15:00:00').toISOString(),
        },
        {
            userId: 5,
            postId: 5,
            content: 'Thanks all! Took about 2 weeks to compile everything. Workshop sounds great!',
            createdAt: new Date('2024-01-20T17:30:00').toISOString(),
        },

        // Post 6 comments (1 comment - medium post)
        {
            userId: 5,
            postId: 6,
            content: 'Congratulations Lisa! Excited to see what you build next! 🎉',
            createdAt: new Date('2024-01-21T10:15:00').toISOString(),
        },

        // Post 8 comments (2 comments - medium post)
        {
            userId: 2,
            postId: 8,
            content: 'These strategies are gold! Especially the async communication tips.',
            createdAt: new Date('2024-01-23T11:30:00').toISOString(),
        },
        {
            userId: 6,
            postId: 8,
            content: 'We implemented some of these and team productivity increased significantly!',
            createdAt: new Date('2024-01-23T14:45:00').toISOString(),
        },

        // Post 10 comments (1 comment - medium post)
        {
            userId: 4,
            postId: 10,
            content: 'Amazing milestone! Your dedication to open source is inspiring!',
            createdAt: new Date('2024-01-25T13:00:00').toISOString(),
        },

        // Post 12 comments (3 comments - popular post)
        {
            userId: 1,
            postId: 12,
            content: 'This is brilliant! The accessibility examples are particularly helpful.',
            createdAt: new Date('2024-01-27T10:45:00').toISOString(),
        },
        {
            userId: 5,
            postId: 12,
            content: 'Shared with my team! These best practices should be industry standard.',
            createdAt: new Date('2024-01-27T13:30:00').toISOString(),
        },
        {
            userId: 7,
            postId: 12,
            content: 'Great resource! Would love to collaborate on expanding this further.',
            createdAt: new Date('2024-01-27T16:00:00').toISOString(),
        },

        // Post 14 comments (2 comments - medium post)
        {
            userId: 3,
            postId: 14,
            content: 'So proud of you Alex! This recognition is well earned! 🏆',
            createdAt: new Date('2024-01-29T11:15:00').toISOString(),
        },
        {
            userId: 8,
            postId: 14,
            content: 'Congratulations! Your mentorship has made such a positive impact!',
            createdAt: new Date('2024-01-29T14:30:00').toISOString(),
        },

        // Post 16 comments (4 comments - popular post)
        {
            userId: 2,
            postId: 16,
            content: 'Congratulations Rachel! This is such an exciting opportunity!',
            createdAt: new Date('2024-01-31T10:00:00').toISOString(),
        },
        {
            userId: 4,
            postId: 16,
            content: 'Well deserved! Looking forward to seeing your impact at the new company!',
            createdAt: new Date('2024-01-31T12:45:00').toISOString(),
        },
        {
            userId: 6,
            postId: 16,
            content: 'Wishing you all the best in your new role! Stay in touch!',
            createdAt: new Date('2024-01-31T15:20:00').toISOString(),
        },
        {
            userId: 8,
            postId: 16,
            content: 'Amazing news! Your expertise will be invaluable to them!',
            createdAt: new Date('2024-01-31T17:00:00').toISOString(),
        },

        // Post 17 comments (1 comment - medium post)
        {
            userId: 1,
            postId: 17,
            content: 'The automation examples are fantastic! Definitely implementing these.',
            createdAt: new Date('2024-02-01T11:30:00').toISOString(),
        },

        // Post 18 comments (3 comments - popular post)
        {
            userId: 3,
            postId: 18,
            content: 'This is incredibly valuable! Thank you for documenting your journey.',
            createdAt: new Date('2024-02-02T10:15:00').toISOString(),
        },
        {
            userId: 5,
            postId: 18,
            content: 'Saved for future reference! The lessons learned section is pure gold.',
            createdAt: new Date('2024-02-02T13:45:00').toISOString(),
        },
        {
            userId: 7,
            postId: 18,
            content: 'Would love to hear more about the technical challenges you faced!',
            createdAt: new Date('2024-02-02T16:30:00').toISOString(),
        },
    ];

    await db.insert(comments).values(sampleComments);

    // Update posts.commentsCount based on actual comments
    const commentCounts = [
        { postId: 1, count: 4 },
        { postId: 2, count: 5 },
        { postId: 3, count: 4 },
        { postId: 4, count: 2 },
        { postId: 5, count: 5 },
        { postId: 6, count: 1 },
        { postId: 8, count: 2 },
        { postId: 10, count: 1 },
        { postId: 12, count: 3 },
        { postId: 14, count: 2 },
        { postId: 16, count: 4 },
        { postId: 17, count: 1 },
        { postId: 18, count: 3 },
    ];

    for (const { postId, count } of commentCounts) {
        await db.update(posts)
            .set({ commentsCount: count })
            .where(eq(posts.id, postId));
    }

    console.log('✅ Comments seeder completed successfully');
    console.log(`📊 Total comments inserted: ${sampleComments.length}`);
    console.log(`📝 Updated comment counts for ${commentCounts.length} posts`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});