import EditUserContent from './EditUserContent';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const params = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        return params.length > 0 ? params : [{ id: '1' }];
    } catch (error) {
        console.error("Error generating static params for admin users:", error);
        return [{ id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EditUserContent params={resolvedParams} />;
}
