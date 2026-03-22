import AdminSportEdit from './AdminSportEdit';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "sports"));
        const params = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        params.push({ id: 'new' });
        return params;
    } catch (error) {
        console.error("Error generating static params for admin sports:", error);
        return [{ id: 'new' }, { id: '1' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <AdminSportEdit params={resolvedParams} />;
} 
