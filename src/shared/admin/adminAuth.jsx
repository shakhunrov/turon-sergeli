import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

const ADMIN_CREDS = { username: 'admin', password: 'tis2026' };
const AUTH_KEY = 'tis_admin_auth';

const host = window.location.hostname;

let branchId;

if (host.includes('chorvoq')) branchId = 6;
if (host.includes('sergeli')) branchId = 9;
if (host.includes("chirchiq")) branchId = 8;

localStorage.setItem("globalBranchId", branchId);

// Default seed news data — with real image URLs
const DEFAULT_NEWS = [
    {
        id: 1,
        category: 'Announcements',
        date: '2026-04-15',
        title: 'Admissions Open for 2026-27',
        desc: 'Enrollment for the 2026–2027 academic year is now open. Apply early to secure your child\'s place and take advantage of early admission benefits.',
        published: true,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    },
    {
        id: 2,
        category: 'Achievements',
        date: '2026-04-10',
        title: 'Grade 10-11 Abituriyent Program Launch',
        desc: 'Specialized foundation program for Grade 10–11 students preparing for international university admission. Covering SAT, IELTS, and subject preparation.',
        published: true,
        image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
    },
    {
        id: 3,
        category: 'Events',
        date: '2026-04-05',
        title: 'Turon Inter-School Spartakiad',
        desc: 'Our students represented TIS Chirchiq with excellence at the annual inter-school sports games, winning medals across several disciplines.',
        published: true,
        image: 'https://images.unsplash.com/photo-1547892518-4cd6f4aea32e?w=600&q=80',
    },
    {
        id: 4,
        category: 'Awards',
        date: '2026-03-28',
        title: 'TIS Wins Regional Science Olympiad',
        desc: 'Three TIS Chirchiq students claimed top prizes at the regional Science Olympiad, competing against over 200 students from 30 schools.',
        published: true,
        image: 'https://images.unsplash.com/photo-1532094349884-543559244a1b?w=600&q=80',
    },
    {
        id: 5,
        category: 'Events',
        date: '2026-03-20',
        title: 'Cambridge IGCSE Prep Workshop',
        desc: 'A two-day intensive workshop helping Grade 9–10 students prepare for Cambridge IGCSE assessments with expert coaches.',
        published: false,
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
    },
    {
        id: 6,
        category: 'Press',
        date: '2026-03-12',
        title: 'TIS Featured in Education Today',
        desc: 'Our pioneering use of AI in the classroom was featured in the March issue of Education Today, Uzbekistan\'s leading education publication.',
        published: true,
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
    },
];

const NEWS_KEY = 'tis_admin_news';

// News storage helpers
export function getStoredNews() {
    try {
        const raw = localStorage.getItem(NEWS_KEY);
        return raw ? JSON.parse(raw) : DEFAULT_NEWS;
    } catch {
        return DEFAULT_NEWS;
    }
}

export function saveNews(items) {
    localStorage.setItem(NEWS_KEY, JSON.stringify(items));
}

// Auth provider
export function AdminAuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)) ?? false; }
        catch { return false; }
    });

    const login = (username, password) => {
        if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(true));
            setAuth(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        setAuth(false);
    };

    return (
        <AdminAuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
