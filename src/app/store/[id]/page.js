import ProductDetails from './ProductDetails';

export const generateStaticParams = async () => {
    // These IDs are fetched from Firestore collections to satisfy 'output: export' requirements.
    return [
        { id: '1eV8EAj9bpFqLwTf6JSf' },
        { id: '7rTMr8RGKOPC5TxkYRyG' },
        { id: 'Med6emfd9nxn9WjbCgEB' },
        { id: 'MkmN387xmvhfRFRshzvV' },
        { id: 'i3ULWpdF6h9QpUeJwInj' },
        { id: 'mD9ly4jvgSHeGWbmH3vm' },
        { id: 'q14PGJh2rVuhAsWfBZln' },
        { id: 'protein-powder' },
        { id: 'creatine-monohydrate' },
        { id: 'shaker-bottle' },
        { id: 'gym-gloves' },
        { id: 'whey-protein' },
        { id: 'resistance-bands' },
    ];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ProductDetails params={resolvedParams} />;
}
