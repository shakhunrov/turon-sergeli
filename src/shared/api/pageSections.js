import api from './axiosInstance';

/**
 * Page Sections API
 * Sahifa section'larini boshqarish uchun
 */

// Section'larni olish
export const getPageSections = async (params) => {
    const response = await api.get('/website-sources/page-sections/', { params });
    return response.data;
};

// Section yaratish yoki yangilash
export const savePageSection = async (data) => {
    const formData = new FormData();

    // Har bir key'ni tekshiramiz
    Object.keys(data).forEach(key => {
        const value = data[key];

        // Agar File obyekti bo'lsa (rasm)
        if (value instanceof File) {
            formData.append(key, value);
        }
        // Agar content_uz, content_ru, content_en bo'lsa
        else if (key.startsWith('content_')) {
            if (typeof value === 'string') {
                formData.append(key, value);
            } else if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            }
        }
        // Agar oddiy qiymat bo'lsa
        else {
            formData.append(key, value);
        }
    });

    const response = await api.post('/website-sources/page-sections/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Section o'chirish
export const deletePageSection = async (id) => {
    const response = await api.delete(`/website-sources/page-sections/${id}/`);
    return response.data;
};

// Bitta section'ni olish
export const getPageSection = async (id) => {
    const response = await api.get(`/website-sources/page-sections/${id}/`);
    return response.data;
};

// Ko'p rasmlar yuklash
export const uploadSectionImages = async (sectionId, imageFiles) => {
    const formData = new FormData();

    // Har bir rasmni qo'shamiz
    imageFiles.forEach(file => {
        formData.append('images', file);
    });

    const response = await api.post(`/website-sources/page-sections/${sectionId}/upload-images/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Bitta rasmni o'chirish
export const deleteSectionImage = async (imageId) => {
    const response = await api.delete(`/website-sources/page-sections/images/${imageId}/`);
    return response.data;
};

export default {
    getPageSections,
    savePageSection,
    deletePageSection,
    getPageSection,
    uploadSectionImages,
    deleteSectionImage,
};
