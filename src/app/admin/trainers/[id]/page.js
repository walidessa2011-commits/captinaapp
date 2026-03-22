import EditTrainerContent from "./EditTrainerContent";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "trainer"));
        const querySnapshot = await getDocs(q);
        const params = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        params.push({ id: 'new' });
        return params;
    } catch (error) {
        console.error("Error generating static params for admin trainers:", error);
        return [{ id: 'new' }, { id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EditTrainerContent params={resolvedParams} />;
}
