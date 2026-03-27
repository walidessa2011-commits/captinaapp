import PackageDetail from './PackageDetail';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const generateStaticParams = async () => {
    try {
        const q = query(collection(db, "packages"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const params = snap.docs.map((doc) => ({ id: doc.id }));
        
        if (params.length === 0) {
            return [{ id: 'default' }];
        }
        
        return params;
    } catch (error) {
        console.error("Error generating static params for packages:", error);
        return [{ id: 'default' }];
    }
};

export const dynamicParams = false;

export default async function Page({ params }) {
    const resolvedParams = await params;
    return <PackageDetail params={resolvedParams} />;
}
