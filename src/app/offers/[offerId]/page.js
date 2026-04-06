import OfferDetail from './OfferDetail';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    // Synchronized with real Firestore IDs and stable seed IDs
    return [
        { offerId: 'offer-ramadan-2025' },
        { offerId: 'offer-first-trial' },
        { offerId: 'trial' },
        { offerId: 'offer-trial-free' },
        // Legacy IDs
        { offerId: 'BqmbcNuyAYe5hJ9ICONg' },
        { offerId: ' JiBzAKyPob7wRWAincXb' }
    ];
};

export default async function Page({ params }) {
    const { offerId } = await params;
    return <OfferDetail offerId={offerId} />;
}
