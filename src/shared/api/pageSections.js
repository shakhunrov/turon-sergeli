import api from './axiosInstance';

/**
 * Page Sections API
 * Sahifa section'larini boshqarish uchun
 */

// Section'larni olish
export const getPageSections = async (params) => {
    const response = await api.get('/page-sections/', { params });
    return response.data;
};

// Section yaratish yoki yangilash
export const savePageSection = async (data) => {
    // Vsegda используем FormData для совместимости с backend
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'content' && typeof data[key] === 'string') {
            // content уже JSON string
            formData.append(key, data[key]);
        } else if (key === 'content' && typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
        } else {
            formData.append(key, data[key]);
        }
    });

    const response = await api.post('/page-sections/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Section o'chirish
export const deletePageSection = async (id) => {
    const response = await api.delete(`/page-sections/${id}/`);
    return response.data;
};

// Bitta section'ni olish
export const getPageSection = async (id) => {
    const response = await api.get(`/page-sections/${id}/`);
    return response.data;
};

export default {
    getPageSections,
    savePageSection,
    deletePageSection,
    getPageSection,
};
