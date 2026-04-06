import PackageDetail from './PackageDetail';

export const dynamicParams = false;

export const generateStaticParams = () => {
    // Synchronized with real Firestore IDs and stable seed IDs
    return [
        { id: 'package-elite-tkd' },
        { id: 'package-beginner-boxing' },
        { id: 'package-trial-karate' },
        { id: 'package-full-fitness' },
        // Legacy/User-specific IDs
        { id: 'GnWkEb9ZI3JRnz1cQwnq' },
        { id: 'J18o8Yiwb4J7rcEEI9Ki' }
    ];
};

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <PackageDetail params={resolvedParams} />;
}
