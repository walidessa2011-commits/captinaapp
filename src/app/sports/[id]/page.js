import SportProfile from './SportProfile';

// Fallback IDs in case Firestore fetch fails at build time
const FALLBACK_IDS = [
    'taekwondo', 'boxing', 'karate', 'general',
    'kick-boxing', 'kickboxing', 'bodybuilding', 'crossfit',
    'judo', 'wrestling', 'muay-thai', 'muaythai', 'fitness',
    'mma', 'self-defense', 'selfdefense', 'jiu-jitsu', 'jiujitsu',
    'yoga', 'swimming', 'basketball', 'football', 'volleyball',
    'tennis', 'padel', 'running', 'cycling', 'gymnastics',
    'تايكوندو', 'ملاكمة', 'كاراتيه', 'جودو', 'فيتنس', 'رياضة-عامة',
    '1', '2', '3', '4', '5',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    try {
        // Fetch actual Firestore document IDs at build time via REST API
        const PROJECT = 'captina-app-next';
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/sports?pageSize=200`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            const firestoreIds = (json.documents || []).map(d => d.name.split('/').pop());
            const all = Array.from(new Set([...FALLBACK_IDS, ...firestoreIds]));
            return all.map(id => ({ id: String(id) }));
        }
    } catch (_) { /* fall through to hardcoded list */ }
    return FALLBACK_IDS.map(id => ({ id }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <SportProfile params={resolvedParams} />;
}
