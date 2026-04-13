import OfferDetail from './OfferDetail';
import { fetchFirestoreIds } from '@/lib/buildHelpers';

const FALLBACK = [
    'offer-ramadan-2025', 'offer-first-trial', 'trial', 'offer-trial-free',
    'BqmbcNuyAYe5hJ9ICONg', 'JiBzAKyPob7wRWAincXb',
];

export const dynamicParams = false;

export async function generateStaticParams() {
    const ids = await fetchFirestoreIds('offers', FALLBACK);
    return ids.map(id => ({ offerId: String(id) }));
}

export default async function Page({ params }) {
    const { offerId } = await params;
    return <OfferDetail offerId={offerId} />;
}
