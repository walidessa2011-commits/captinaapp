import CategoryVideos from './CategoryVideos';

export const generateStaticParams = async () => {
    // These categories are fetched from Firestore collections to satisfy 'output: export' requirements.
    return [
        { category: 'educational' },
        { category: 'trainees' },
        { category: 'trainers' },
        { category: 'others' },
        { category: 'nutrition' },
        { category: 'combat' },
        { category: 'fitness' },
    ];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <CategoryVideos params={resolvedParams} />;
}
