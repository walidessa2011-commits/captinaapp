import CategoryVideos from './CategoryVideos';

export const dynamicParams = false;

export async function generateStaticParams() {
    return [
        { category: 'educational' },
        { category: 'trainees' },
        { category: 'trainers' },
        { category: 'others' },
        { category: 'nutrition' },
        { category: 'combat' },
        { category: 'fitness' },
    ];
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <CategoryVideos params={resolvedParams} />;
}
