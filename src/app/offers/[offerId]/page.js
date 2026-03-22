import OfferDetail from './OfferDetail';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "offers"));
        const params = querySnapshot.docs.map((doc) => ({
            offerId: doc.id,
        }));
        return params.length > 0 ? params : [{ offerId: '1' }];
    } catch (error) {
        console.error("Error generating static params for offers:", error);
        return [{ offerId: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const { offerId } = await params;
    return <OfferDetail offerId={offerId} />;
}
