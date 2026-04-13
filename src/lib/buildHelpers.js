/**
 * Fetch all document IDs from a Firestore collection via REST API at build time.
 * Used inside generateStaticParams() to ensure all dynamic routes are pre-rendered.
 */
const PROJECT = 'captina-app-next';

export async function fetchFirestoreIds(collection, fallbackIds = []) {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${collection}?pageSize=500`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            const ids = (json.documents || []).map(d => d.name.split('/').pop());
            return Array.from(new Set([...fallbackIds, ...ids]));
        }
    } catch (_) { /* network unavailable at build time — use fallbacks */ }
    return fallbackIds;
}

/**
 * Fetch library videos with their categories for nested [category]/[videoId] routes.
 * Returns array of { category, videoId } pairs.
 */
export async function fetchLibraryParams(fallback = []) {
    const KNOWN_CATEGORIES = ['educational', 'trainees', 'trainers', 'others', 'nutrition', 'combat', 'fitness'];
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/library?pageSize=500`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            const pairs = (json.documents || []).map(d => {
                const videoId = d.name.split('/').pop();
                // Extract category field from Firestore document fields
                const category = d.fields?.category?.stringValue || 'others';
                return { category, videoId };
            });
            // Merge with fallback, deduplicating by videoId
            const seen = new Set(pairs.map(p => p.videoId));
            const merged = [...pairs];
            for (const f of fallback) {
                if (!seen.has(f.videoId)) { merged.push(f); seen.add(f.videoId); }
            }
            return merged;
        }
    } catch (_) { /* network unavailable at build time — use fallbacks */ }
    return fallback;
}
