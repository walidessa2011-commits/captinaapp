import AdminSportEdit from './AdminSportEdit';

const SPORT_IDS = [
    'new',
    'taekwondo', 'boxing', 'karate', 'general',
    'kick-boxing', 'kickboxing', 'bodybuilding', 'crossfit',
    'judo', 'wrestling', 'muay-thai', 'muaythai', 'fitness',
    'mma', 'self-defense', 'selfdefense', 'jiu-jitsu', 'jiujitsu',
    'yoga', 'swimming', 'basketball', 'football', 'volleyball',
    'tennis', 'padel', 'running', 'cycling', 'gymnastics',
    // Legacy / mis-typed IDs already in Firestore
    'teakwondow', '-fitness-tarining',
    '1', '2', '3', '4', '5',
];

export const generateStaticParams = () => SPORT_IDS.map(id => ({ id }));

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <AdminSportEdit params={resolvedParams} />;
}
