import PackageDetail from './PackageDetail';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    'package-elite-tkd', 'package-beginner-boxing', 'package-trial-karate',
    'package-full-fitness', 'trial', 'monthly', 'quarterly', 'semi-annual', 'annual',
    'GnWkEb9ZI3JRnz1cQwnq', 'J18o8Yiwb4J7rcEEI9Ki',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('packages', FALLBACK);
    return ids.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <PackageDetail params={resolvedParams} />;
}
