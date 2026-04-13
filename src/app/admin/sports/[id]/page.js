import AdminSportEdit from './AdminSportEdit';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    'new',
    'taekwondo', 'boxing', 'karate', 'general',
    'kick-boxing', 'kickboxing', 'bodybuilding', 'crossfit',
    'judo', 'wrestling', 'muay-thai', 'muaythai', 'fitness',
    'mma', 'self-defense', 'selfdefense', 'jiu-jitsu', 'jiujitsu',
    'yoga', 'swimming', 'basketball', 'football', 'volleyball',
    'tennis', 'padel', 'running', 'cycling', 'gymnastics',
    'teakwondow', '-fitness-tarining',
    '1', '2', '3', '4', '5',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('sports', FALLBACK);
    // Always include 'new' for create-new route
    const all = Array.from(new Set(['new', ...ids]));
    return all.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <AdminSportEdit params={resolvedParams} />;
}
