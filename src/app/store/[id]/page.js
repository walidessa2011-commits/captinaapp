import ProductDetails from './ProductDetails';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    '1eV8EAj9bpFqLwTf6JSf', '7rTMr8RGKOPC5TxkYRyG', 'Med6emfd9nxn9WjbCgEB',
    'MkmN387xmvhfRFRshzvV', 'i3ULWpdF6h9QpUeJwInj', 'mD9ly4jvgSHeGWbmH3vm',
    'q14PGJh2rVuhAsWfBZln', 'protein-powder', 'creatine-monohydrate',
    'shaker-bottle', 'gym-gloves', 'whey-protein', 'resistance-bands',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('products', FALLBACK);
    return ids.map(id => ({ id: String(id) }));
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ProductDetails params={resolvedParams} />;
}
