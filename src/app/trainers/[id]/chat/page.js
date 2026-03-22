import ChatContent from './ChatContent';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "trainer"));
        const querySnapshot = await getDocs(q);
        const params = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        return params.length > 0 ? params : [{ id: '1' }];
    } catch (error) {
        console.error("Error generating static params for trainer chats:", error);
        return [{ id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <ChatContent params={resolvedParams} />;
}
