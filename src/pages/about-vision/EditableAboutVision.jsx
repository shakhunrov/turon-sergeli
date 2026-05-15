import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';
import './AboutVision.css';

export default function EditableAboutVision() {
    const { t, lang } = useLang();
    const v = t.about.vision;
    const branchId = localStorage.getItem('globalBranchId');

    const [sections, setSections] = useState({
        hero: {
            label: 'Biz haqimizda',
            title: v.title,
        },
        vision: {
            icon: '🌟',
            title: v.vision,
            text: v.visionText,
        },
        values: {
            title: v.valuesTitle,
            values: v.values,
        },
        outcomes: {
            title: v.outcomesTitle,
            outcomes: v.outcomes,
        },
    });

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await getPageSections({ branch: branchId, page: 'about-vision' });
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
    }, [branchId, lang]);

    const handleSaveSection = async (sectionId, data) => {
        try {
            const payload = {
                branch: branchId,
                page: 'about-vision',
                section_id: sectionId,
            };

            // Agar data ichida File obyekti bo'lsa, uni alohida yuboramiz
            const contentData = {};

            Object.keys(data).forEach(key => {
                if (data[key] instanceof File) {
                    // File obyektini to'g'ridan-to'g'ri payload'ga qo'shamiz
                    payload[key] = data[key];
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

    return (
        <div className="page">
            <EditableSection
                sectionId="hero"
                data={sections.hero}
                onSave={(data) => handleSaveSection('hero', data)}
            >
                <div className="page-hero">
                    <div className="container">
                        <span className="section-label">{sections.hero.label}</span>
                        <h1 className="section-title">{sections.hero.title}</h1>
                        <div className="divider" />
                    </div>
                </div>
            </EditableSection>

            <section className="section">
                <div className="container">
                    {/* Vision */}
                    <EditableSection
                        sectionId="vision"
                        data={sections.vision}
                        onSave={(data) => handleSaveSection('vision', data)}
                    >
                        <div className="vision-block glass-card">
                            <div className="vision-icon">{sections.vision.icon}</div>
                            <h2 className="vision-block-title">{sections.vision.title}</h2>
                            <p className="vision-text">{sections.vision.text}</p>
                        </div>
                    </EditableSection>

                    {/* Values */}
                    <EditableSection
                        sectionId="values"
                        data={sections.values}
                        onSave={(data) => handleSaveSection('values', data)}
                    >
                        <div className="vision-values-section">
                            <h2 className="section-title">{sections.values.title}</h2>
                            <div className="divider" />
                            <div className="values-grid">
                                {sections.values.values.map((val, i) => (
                                    <div key={i} className="value-tag glass-card">
                                        <span className="value-dot" />
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </EditableSection>

                    {/* Student Outcomes */}
                    <EditableSection
                        sectionId="outcomes"
                        data={sections.outcomes}
                        onSave={(data) => handleSaveSection('outcomes', data)}
                    >
                        <div className="outcomes-section">
                            <h2 className="section-title">{sections.outcomes.title}</h2>
                            <div className="divider" />
                            <div className="outcomes-list">
                                {sections.outcomes.outcomes.map((o, i) => (
                                    <div key={i} className="outcome-item glass-card">
                                        <span className="outcome-num">{String(i + 1).padStart(2, '0')}</span>
                                        <p>{o}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </EditableSection>
                </div>
            </section>
        </div>
    );
}
