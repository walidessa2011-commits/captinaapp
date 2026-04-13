import ClientDetailsContent from './ClientDetailsContent';

export const dynamicParams = false;

export async function generateStaticParams() {
    // Client IDs are trainer-specific and rendered client-side.
    // 'placeholder' satisfies static export; real IDs are loaded at runtime.
    return [{ id: 'placeholder' }];
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ClientDetailsContent params={resolvedParams} />;
}
