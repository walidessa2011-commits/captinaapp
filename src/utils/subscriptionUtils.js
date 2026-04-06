/**
 * Subscription & Session Utilities
 * Handles session count calculation, schedule generation, and auto-attendance logic.
 */

/**
 * Returns the total session count for a subscription/package.
 * Priority: stored totalSessions → calculated from months × sessionsPerWeek × 4.
 *
 * Plan durations (months):
 *   1  → monthly  (e.g. 3 sess/week × 4 weeks = 12)
 *   3  → quarterly (3 × 3 × 4 = 36)
 *   6  → semi-annual (3 × 6 × 4 = 72)
 *   12 → annual (3 × 12 × 4 = 144)
 */
export function getTotalSessions(subscription) {
    if (subscription?.totalSessions && subscription.totalSessions > 0) {
        return Number(subscription.totalSessions);
    }
    const months = Number(subscription?.months || 1);
    const perWeek = Number(subscription?.sessionsPerWeek || 3);
    return perWeek * months * 4;
}

/**
 * Returns human-readable plan duration label.
 * @param {number} months
 * @param {'ar'|'en'} lang
 */
export function getPlanLabel(months, lang = 'ar') {
    const labels = {
        ar: { 0: 'تجريبي', 1: 'شهري', 3: 'ربع سنوي (3 أشهر)', 6: 'نصف سنوي (6 أشهر)', 12: 'سنوي' },
        en: { 0: 'Trial', 1: 'Monthly', 3: 'Quarterly (3 Months)', 6: 'Semi-Annual (6 Months)', 12: 'Annual' },
    };
    return (labels[lang] || labels.ar)[months] || (lang === 'ar' ? `${months} أشهر` : `${months} Months`);
}

/**
 * Converts a Firestore Timestamp, Date, or ISO string to a JS Date.
 */
export function toDate(value) {
    if (!value) return null;
    if (typeof value?.toDate === 'function') return value.toDate();
    if (value instanceof Date) return value;
    return new Date(value);
}

/**
 * Generates an array of Date objects for all scheduled session days.
 *
 * @param {Date|Timestamp} startDate  – subscription start date
 * @param {number} months             – plan duration in months (0 for trial)
 * @param {number} sessionsPerWeek    – number of sessions per week (1-5)
 * @returns {Date[]}
 */
export function generateSessionSchedule(startDate, months, sessionsPerWeek = 3) {
    const start = toDate(startDate);
    if (!start || isNaN(start.getTime())) return [];

    // Use months=1 minimum for trial so we at least show something
    const effectiveMonths = Math.max(1, Number(months) || 1);
    const totalWeeks = effectiveMonths * 4;
    const perWeek = Math.min(7, Math.max(1, Number(sessionsPerWeek) || 3));

    // Spread sessions evenly across the week starting from Monday
    // e.g. 3/week → days [1,3,5] (Mon, Wed, Fri)
    const dayOffsets = getWeeklyDayOffsets(perWeek);

    // Find the first Monday >= startDate
    const firstMonday = getNextMonday(start);

    const sessions = [];
    for (let week = 0; week < totalWeeks; week++) {
        for (const offset of dayOffsets) {
            const d = new Date(firstMonday);
            d.setDate(d.getDate() + week * 7 + offset);
            sessions.push(d);
        }
    }
    return sessions;
}

/**
 * Returns the next Monday >= given date (or the date itself if it's Monday).
 */
function getNextMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    if (day !== 1) {
        const daysUntilMonday = day === 0 ? 1 : 8 - day;
        d.setDate(d.getDate() + daysUntilMonday);
    }
    return d;
}

/**
 * Returns an array of day offsets within a Mon-based week (0=Mon, 6=Sun)
 * spread as evenly as possible for the given number of sessions.
 */
function getWeeklyDayOffsets(sessionsPerWeek) {
    const presets = {
        1: [0],
        2: [0, 3],
        3: [0, 2, 4],
        4: [0, 1, 3, 4],
        5: [0, 1, 2, 3, 4],
        6: [0, 1, 2, 3, 4, 5],
        7: [0, 1, 2, 3, 4, 5, 6],
    };
    return presets[sessionsPerWeek] || presets[3];
}

/**
 * Returns the list of session dates that are in the past and have no
 * corresponding attendance record (by matching date strings).
 *
 * @param {Date[]} schedule          – all session dates from generateSessionSchedule
 * @param {Object[]} attendanceRecords – existing Firestore attendance docs
 * @returns {Date[]} list of missed sessions (past, no record)
 */
export function findMissedSessions(schedule, attendanceRecords) {
    const now = new Date();
    // Build a set of attended-date strings "YYYY-MM-DD"
    const attendedDates = new Set(
        attendanceRecords.map(r => {
            const d = toDate(r.date || r.sessionDate);
            return d ? formatDateKey(d) : null;
        }).filter(Boolean)
    );

    return schedule.filter(sessionDate => {
        // Must be in the past (give 2 hr grace period)
        const cutoff = new Date(sessionDate);
        cutoff.setHours(cutoff.getHours() + 2);
        if (cutoff > now) return false;
        return !attendedDates.has(formatDateKey(sessionDate));
    });
}

/**
 * Format date to "YYYY-MM-DD" key for comparison.
 */
export function formatDateKey(date) {
    const d = toDate(date);
    if (!d) return '';
    return d.toISOString().slice(0, 10);
}

/**
 * Build the subscription metadata that should be stored in Firestore
 * when a subscription is created (called from checkout).
 *
 * @param {Object} pkg     – package object from Firestore/initialData
 * @param {string} startDateISO – ISO date string for subscription start
 */
export function buildSubscriptionData(pkg, startDateISO) {
    const months = Number(pkg?.months ?? 1);
    const sessionsPerWeek = Number(pkg?.sessionsPerWeek ?? 3);
    const totalSessions = pkg?.totalSessions
        ? Number(pkg.totalSessions)
        : sessionsPerWeek * Math.max(1, months) * 4;

    const startDate = new Date(startDateISO || Date.now());
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Math.max(1, months));

    return {
        months,
        sessionsPerWeek,
        totalSessions,
        consumedSessions: 0,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        planLabel: pkg?.name_ar || pkg?.name?.ar || pkg?.name || '',
        sportId: pkg?.sportId || pkg?.sport || '',
        gymId: pkg?.gymId || '',
    };
}
