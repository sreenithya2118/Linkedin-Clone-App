import { db } from '@/db';
import { posts } from '@/db/schema';

async function main() {
    const samplePosts = [
        {
            userId: 1,
            content: 'Excited to announce that I\'ve joined TechCorp as a Senior Software Engineer! Looking forward to working with an amazing team on cutting-edge projects. 🚀',
            imageUrl: 'https://picsum.photos/800/600?random=1',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-15T09:30:00').toISOString(),
        },
        {
            userId: 2,
            content: 'Just finished reading "Clean Code" by Robert C. Martin. It\'s a must-read for every developer who wants to write maintainable and elegant code. Highly recommended!',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-16T14:20:00').toISOString(),
        },
        {
            userId: 3,
            content: 'Had an incredible time speaking at React Summit 2024! Thank you to everyone who attended my talk on "Building Scalable React Applications". The energy was amazing! 🎤',
            imageUrl: 'https://picsum.photos/800/600?random=2',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-17T16:45:00').toISOString(),
        },
        {
            userId: 4,
            content: 'Does anyone have experience with Kubernetes in production? We\'re planning to migrate our infrastructure and would love to hear about best practices and potential pitfalls.',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-18T10:15:00').toISOString(),
        },
        {
            userId: 5,
            content: 'Celebrating 5 years at Google today! Time flies when you\'re working on products that impact billions of users. Grateful for the journey and the incredible people I\'ve met along the way. 🎉',
            imageUrl: 'https://picsum.photos/800/600?random=3',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-19T08:00:00').toISOString(),
        },
        {
            userId: 1,
            content: 'Quick tip: Always write tests for your critical business logic. It might seem like extra work now, but it saves countless hours of debugging later. Your future self will thank you!',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-20T13:30:00').toISOString(),
        },
        {
            userId: 2,
            content: 'Our team just launched a new feature that reduces API response time by 40%! This is what happens when you combine smart caching strategies with efficient database queries. 📊',
            imageUrl: 'https://picsum.photos/800/600?random=4',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-21T11:20:00').toISOString(),
        },
        {
            userId: 3,
            content: 'Looking for recommendations on project management tools for remote teams. Currently using Jira but wondering if there are better alternatives out there. What do you use?',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-22T15:40:00').toISOString(),
        },
        {
            userId: 4,
            content: 'Just open-sourced our internal design system library! Check it out on GitHub. We\'ve been using it for 2 years across 20+ projects. Feedback and contributions welcome! 💙',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-23T09:10:00').toISOString(),
        },
        {
            userId: 5,
            content: 'Attending the AI & Machine Learning Conference next week. Anyone else going? Would love to connect and discuss the latest trends in ML engineering. Drop a comment if you\'ll be there!',
            imageUrl: 'https://picsum.photos/800/600?random=5',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-24T12:25:00').toISOString(),
        },
        {
            userId: 1,
            content: 'Reminder: Code reviews aren\'t just about finding bugs. They\'re opportunities to share knowledge, mentor junior developers, and ensure code quality across the team. Make them count!',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-25T10:50:00').toISOString(),
        },
        {
            userId: 2,
            content: 'Proud to share that our startup just hit 100,000 users! Thank you to everyone who believed in our vision. This is just the beginning. 🚀🎊',
            imageUrl: 'https://picsum.photos/800/600?random=6',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-26T14:35:00').toISOString(),
        },
        {
            userId: 3,
            content: 'Interesting debate today: TypeScript vs JavaScript for large-scale applications. What\'s your take? I\'m firmly in the TypeScript camp for any project with more than 3 developers.',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-27T16:15:00').toISOString(),
        },
        {
            userId: 4,
            content: 'Finally completed my AWS Solutions Architect certification! The preparation was intense but totally worth it. Happy to answer any questions for those preparing for it. 📜',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-28T11:00:00').toISOString(),
        },
        {
            userId: 5,
            content: 'Working from our new office space today! Check out this amazing view. Sometimes a change of scenery is all you need to boost productivity. 🏢☀️',
            imageUrl: 'https://picsum.photos/800/600?random=7',
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-29T08:45:00').toISOString(),
        },
        {
            userId: 1,
            content: 'PSA: Remember to take breaks and avoid burnout. Your mental health is more important than any deadline. I learned this the hard way, don\'t make the same mistake.',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-30T13:20:00').toISOString(),
        },
        {
            userId: 2,
            content: 'We\'re hiring! Looking for a Senior Frontend Developer to join our team. Must have strong React experience and a passion for creating delightful user experiences. DM me for details!',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-01-31T15:30:00').toISOString(),
        },
        {
            userId: 3,
            content: 'Just deployed our application to production using GitHub Actions and AWS ECS. The entire CI/CD pipeline is now automated. Sharing our setup in a blog post next week! 🔧',
            imageUrl: null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date('2024-02-01T10:40:00').toISOString(),
        },
    ];

    await db.insert(posts).values(samplePosts);
    
    console.log('✅ Posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});