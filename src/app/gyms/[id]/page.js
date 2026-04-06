import GymDetails from './GymDetails';

export const generateStaticParams = () => {
    // These IDs are fetched from Firestore collections to satisfy 'output: export' requirements.
    return [
        { id: '4g3tv4IvV4YdAppfvP6D' },
        { id: 'CqkGdotfEn5d7mrTbVAN' },
        { id: 'D6BTCCOoiT2B2Agp1vSz' },
        { id: 'HB98NagBnFYiLklGJb7X' },
        { id: 'MX7d6yIgx3dmU6KPcR7u' },
        { id: 'g8JYdLfVqs9eREVKrqMI' },
        { id: '1' },
        { id: 'monsia-branch' },
        { id: 'smart-gym' },
        { id: 'fit-house' },
        { id: 'gold-gym' },
        { id: 'iron-gym' },
        { id: 'platinum-gym' },
    ];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <GymDetails params={resolvedParams} />;
}
