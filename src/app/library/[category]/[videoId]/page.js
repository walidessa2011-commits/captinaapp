import VideoDetail from './VideoDetail';

export const generateStaticParams = async () => {
    // These IDs are fetched from Firestore collections to satisfy 'output: export' requirements.
    return [
        { category: 'others', videoId: 'JFHOs76CMN8DF8SDn16E' },
        { category: 'educational', videoId: 'TXzavmLqyxgHyxrnsJQ2' },
        { category: 'educational', videoId: 'ihTYwgxdtsykryt09oi2' },
        { category: 'trainers', videoId: 'oo7Y83fod4G25GUJmnY6' },
        { category: 'trainees', videoId: 'vgVodoq5cUrzNrYoWGBG' },
        { category: 'educational', videoId: 'wL5gC07oIK60IkwGOfE2' },
        // Keep placeholders if needed for safety during build
        { category: 'educational', videoId: '1' },
        { category: 'trainees', videoId: '1' },
        { category: 'trainers', videoId: '1' },
    ];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <VideoDetail params={resolvedParams} />;
}
