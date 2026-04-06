import ClientDetailsContent from './ClientDetailsContent';

export const generateStaticParams = () => {
    // Placeholder ID for static export. Real client IDs
    // from Firestore will be rendered client-side at runtime.
    return [{ id: 'placeholder' }];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ClientDetailsContent params={resolvedParams} />;
}
