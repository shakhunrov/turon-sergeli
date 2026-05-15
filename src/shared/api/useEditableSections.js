import { useState, useEffect } from 'react';
import { getPageSections, savePageSection } from './pageSections';
import { useLang } from '../i18n';

/**
 * useEditableSections - Editable sections uchun custom hook
 *
 * @param {string} pageName - Sahifa nomi (home, education, about-vision, etc.)
 * @param {object} defaultSections - Default section ma'lumotlari
 * @returns {object} { sections, handleSaveSection }
 */
export function useEditableSections(pageName, defaultSections) {
    const branchId = localStorage.getItem('globalBranchId');
    const { lang } = useLang(); // Текущий язык из контекста
    const [sections, setSections] = useState(defaultSections);

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await getPageSections({ branch: branchId, page: pageName });
                if (data && data.length > 0) {
                    const loadedSections = {};
                    data.forEach(section => {
                        try {
                            // Получаем контент для текущего языка
                            const contentField = `content_${lang}`;
                            let content = section[contentField];

                            // Если content - строка, парсим JSON
                            if (typeof content === 'string') {
                                content = JSON.parse(content);
                            }

                            if (content && Object.keys(content).length > 0) {
                                loadedSections[section.section_id] = content;

                                // Agar section'da image field alohida bo'lsa, uni qo'shamiz
                                if (section.image) {
                                    loadedSections[section.section_id].image = section.image;
                                }
                            }
                        } catch (e) {
                            console.error(`Section ${section.section_id} parse error:`, e);
                        }
                    });
                    setSections(prev => ({ ...prev, ...loadedSections }));
                }
            } catch (error) {
                console.error('Section ma\'lumotlarini yuklashda xatolik:', error);
            }
        };
        loadSections();
    }, [branchId, pageName, lang]);

    const handleSaveSection = async (sectionId, data) => {
        try {
            const payload = {
                branch: branchId,
                page: pageName,
                section_id: sectionId,
            };

            // Agar data ichida File obyekti bo'lsa, uni alohida yuboramiz
            let hasFile = false;
            const contentData = {};

            Object.keys(data).forEach(key => {
                if (data[key] instanceof File) {
                    // File obyektini to'g'ridan-to'g'ri payload'ga qo'shamiz
                    payload[key] = data[key];
                    hasFile = true;
                } else {
                    contentData[key] = data[key];
                }
            });

            // Content'ni til uchun saqlash
            const contentField = `content_${lang}`;
            payload[contentField] = JSON.stringify(contentData);

            await savePageSection(payload);
            setSections(prev => ({ ...prev, [sectionId]: data }));
            alert('Section muvaffaqiyatli saqlandi!');
        } catch (error) {
            console.error('Section saqlashda xatolik:', error);
            alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    };

    return { sections, handleSaveSection };
}
