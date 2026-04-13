import VideoDetail from './VideoDetail';
import { fetchLibraryParams } from '@/lib/buildHelpers';

const FALLBACK = [
    { category: 'others', videoId: 'JFHOs76CMN8DF8SDn16E' },
    { category: 'educational', videoId: 'TXzavmLqyxgHyxrnsJQ2' },
    { category: 'educational', videoId: 'ihTYwgxdtsykryt09oi2' },
    { category: 'trainers', videoId: 'oo7Y83fod4G25GUJmnY6' },
    { category: 'trainees', videoId: 'vgVodoq5cUrzNrYoWGBG' },
    { category: 'educational', videoId: 'wL5gC07oIK60IkwGOfE2' },
];

export const dynamicParams = false;

export async function generateStaticParams() {
    return await fetchLibraryParams(FALLBACK);
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <VideoDetail params={resolvedParams} />;
}
