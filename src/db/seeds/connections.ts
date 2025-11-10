import { db } from '@/db';
import { connections } from '@/db/schema';

async function main() {
    const sampleConnections = [
        // ACCEPTED CONNECTIONS - User 1 connections
        {
            userId: 1,
            connectedUserId: 2,
            status: 'accepted',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 1,
            connectedUserId: 3,
            status: 'accepted',
            createdAt: new Date('2024-01-22').toISOString(),
        },
        
        // ACCEPTED CONNECTIONS - User 2 connections
        {
            userId: 4,
            connectedUserId: 2,
            status: 'accepted',
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            userId: 2,
            connectedUserId: 7,
            status: 'accepted',
            createdAt: new Date('2024-02-10').toISOString(),
        },
        
        // ACCEPTED CONNECTIONS - User 3 connections
        {
            userId: 5,
            connectedUserId: 3,
            status: 'accepted',
            createdAt: new Date('2024-01-28').toISOString(),
        },
        
        // ACCEPTED CONNECTIONS - User 4 connections
        {
            userId: 4,
            connectedUserId: 6,
            status: 'accepted',
            createdAt: new Date('2024-02-05').toISOString(),
        },
        
        // ACCEPTED CONNECTIONS - User 5 connections
        {
            userId: 5,
            connectedUserId: 7,
            status: 'accepted',
            createdAt: new Date('2024-02-12').toISOString(),
        },
        
        // ACCEPTED CONNECTIONS - User 6 connections
        {
            userId: 6,
            connectedUserId: 8,
            status: 'accepted',
            createdAt: new Date('2024-02-18').toISOString(),
        },
        
        // Additional accepted connection for network depth
        {
            userId: 3,
            connectedUserId: 4,
            status: 'accepted',
            createdAt: new Date('2024-02-20').toISOString(),
        },
        {
            userId: 1,
            connectedUserId: 5,
            status: 'accepted',
            createdAt: new Date('2024-02-25').toISOString(),
        },
        
        // PENDING CONNECTIONS
        {
            userId: 3,
            connectedUserId: 6,
            status: 'pending',
            createdAt: new Date('2024-03-01').toISOString(),
        },
        {
            userId: 7,
            connectedUserId: 1,
            status: 'pending',
            createdAt: new Date('2024-03-05').toISOString(),
        },
        {
            userId: 8,
            connectedUserId: 4,
            status: 'pending',
            createdAt: new Date('2024-03-08').toISOString(),
        },
        
        // REJECTED CONNECTION
        {
            userId: 5,
            connectedUserId: 8,
            status: 'rejected',
            createdAt: new Date('2024-02-28').toISOString(),
        },
    ];

    await db.insert(connections).values(sampleConnections);
    
    console.log('✅ Connections seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});