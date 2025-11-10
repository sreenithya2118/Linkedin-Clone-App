import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const sampleUsers = [
        {
            name: 'Sarah Chen',
            email: 'sarah.chen@techcorp.com',
            password: hashedPassword,
            headline: 'Senior Software Engineer at Google',
            bio: 'Passionate about building scalable systems and mentoring junior developers. Specialized in distributed systems and cloud architecture with 8+ years of experience in tech.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
            location: 'San Francisco, CA',
            company: 'Google',
            position: 'Senior Software Engineer',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Michael Rodriguez',
            email: 'michael.rodriguez@startup.io',
            password: hashedPassword,
            headline: 'Product Manager | Building the future of fintech',
            bio: 'Product leader with a track record of launching successful B2B and B2C products. Currently revolutionizing digital payments and financial services for underserved communities.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelRodriguez',
            location: 'New York, NY',
            company: 'Stripe',
            position: 'Senior Product Manager',
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            name: 'Emily Johnson',
            email: 'emily.johnson@design.co',
            password: hashedPassword,
            headline: 'Lead UX Designer | Creating delightful user experiences',
            bio: 'Award-winning designer focused on accessibility and inclusive design. Love collaborating with cross-functional teams to solve complex user problems through research-driven design.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyJohnson',
            location: 'Seattle, WA',
            company: 'Microsoft',
            position: 'Lead UX Designer',
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'David Park',
            email: 'david.park@datatech.com',
            password: hashedPassword,
            headline: 'Data Scientist | ML Engineer | AI Enthusiast',
            bio: 'Transforming raw data into actionable insights using machine learning and statistical modeling. Previously at Meta, now building AI-powered solutions for healthcare and education.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidPark',
            location: 'Austin, TX',
            company: 'Tesla',
            position: 'Senior Data Scientist',
            createdAt: new Date('2024-01-22').toISOString(),
        },
        {
            name: 'Jessica Martinez',
            email: 'jessica.martinez@marketing.agency',
            password: hashedPassword,
            headline: 'Digital Marketing Director | Growth Strategist',
            bio: 'Helping brands scale through data-driven marketing strategies and creative storytelling. Expert in SEO, content marketing, and performance advertising with proven ROI results.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JessicaMartinez',
            location: 'Los Angeles, CA',
            company: 'HubSpot',
            position: 'Director of Digital Marketing',
            createdAt: new Date('2024-01-25').toISOString(),
        },
        {
            name: 'Alex Thompson',
            email: 'alex.thompson@devops.io',
            password: hashedPassword,
            headline: 'DevOps Engineer | Cloud Infrastructure Specialist',
            bio: 'Building reliable, scalable infrastructure using Kubernetes, AWS, and modern DevOps practices. Passionate about automation, monitoring, and helping teams ship code faster and safer.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexThompson',
            location: 'Boston, MA',
            company: 'Amazon Web Services',
            position: 'Senior DevOps Engineer',
            createdAt: new Date('2024-01-28').toISOString(),
        },
        {
            name: 'Rachel Kim',
            email: 'rachel.kim@consulting.com',
            password: hashedPassword,
            headline: 'Management Consultant | Digital Transformation Leader',
            bio: 'Advising Fortune 500 companies on technology strategy and organizational change. Specialized in digital transformation, agile methodologies, and helping enterprises innovate at scale.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RachelKim',
            location: 'Chicago, IL',
            company: 'McKinsey & Company',
            position: 'Senior Consultant',
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            name: 'James Wilson',
            email: 'james.wilson@security.tech',
            password: hashedPassword,
            headline: 'Cybersecurity Architect | Protecting digital assets',
            bio: 'Designing secure systems and leading incident response teams to protect against evolving cyber threats. CISSP certified with expertise in zero-trust architecture and threat intelligence.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesWilson',
            location: 'Denver, CO',
            company: 'Cloudflare',
            position: 'Principal Security Architect',
            createdAt: new Date('2024-02-03').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});