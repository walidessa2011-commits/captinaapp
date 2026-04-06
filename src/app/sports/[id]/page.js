import SportProfile from './SportProfile';

// All known sport IDs — covers initialData seeds + common Firestore slugs
const SPORT_IDS = [
    'taekwondo', 'boxing', 'karate', 'general',
    'kick-boxing', 'kickboxing', 'bodybuilding', 'crossfit',
    'judo', 'wrestling', 'muay-thai', 'muaythai', 'fitness',
    'mma', 'self-defense', 'selfdefense', 'jiu-jitsu', 'jiujitsu',
    'yoga', 'swimming', 'basketball', 'football', 'volleyball',
    'tennis', 'padel', 'running', 'cycling', 'gymnastics',
    // Arabic slugs
    'تايكوندو', 'ملاكمة', 'كاراتيه', 'جودو', 'فيتنس', 'رياضة-عامة',
    '1', '2', '3', '4', '5',
];

export const generateStaticParams = () => SPORT_IDS.map(id => ({ id }));

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <SportProfile params={resolvedParams} />;
}
