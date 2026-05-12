import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection, EditableList } from '../../shared/editable';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';
import './Education.css';

export default function EditableEducation() {
    const { t, lang } = useLang();
    const e = t.education;
    const branchId = localStorage.getItem('globalBranchId');

    const [sections, setSections] = useState({
        hero: {
            label: 'Ta\'lim',
            title: e.title,
        },
        truth: {
            num: '01',
            title: e.truthTitle,
            text: e.truthText,
        },
        approach: {
            title: e.approachTitle,
            text: e.approachText,
        },
        skills: {
            title: e.skillsTitle,
            skills: e.skills,
        },
        classroom: {
            title: e.classroomTitle || 'Ko\'nikmalar → Sinf amaliyoti',
            skillLabel: e.classroomSkillLabel || 'Ko\'nikma',
            practiceLabel: e.classroomPracticeLabel || 'Sinfda qanday ko\'rinadi',
            rows: e.skills?.map(skill => ({
                skill: skill.title,
                practice: skill.how
            })) || [],
        },
        assessment: {
            title: e.assessTitle,
            text: e.assessText,
        },
        curriculum: {
            title: e.curriculumTitle,
            curricula: e.curricula,
        },
        closing: {
            title: e.closingTitle,
            text: e.closingText,
        },
    });

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await getPageSections({ branch: branchId, page: 'education' });
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
            // Отправляем в поле для текущего языка
            const contentField = `content_${lang}`;
            await savePageSection({
                branch: branchId,
                page: 'education',
                section_id: sectionId,
                [contentField]: JSON.stringify(data),
            });
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
                <div className="page-hero-simple">
                    <div className="container">
                        <span className="section-label">{sections.hero.label}</span>
                        <h1 className="section-title">{sections.hero.title}</h1>
                        <div className="divider" />
                    </div>
                </div>
            </EditableSection>

            <section className="section">
                <div className="container">
                    {/* Truth about education */}
                    <EditableSection
                        sectionId="truth"
                        data={sections.truth}
                        onSave={(data) => handleSaveSection('truth', data)}
                    >
                        <div className="edu-truth glass-card">
                            <div className="edu-truth-num">{sections.truth.num}</div>
                            <div>
                                <h2 className="edu-truth-title">{sections.truth.title}</h2>
                                <p className="edu-truth-text">{sections.truth.text}</p>
                            </div>
                        </div>
                    </EditableSection>

                    {/* Educational Approach */}
                    <EditableSection
                        sectionId="approach"
                        data={sections.approach}
                        onSave={(data) => handleSaveSection('approach', data)}
                    >
                        <div className="edu-approach">
                            <h2 className="section-title">{sections.approach.title}</h2>
                            <div className="divider" />
                            <p className="section-subtitle">{sections.approach.text}</p>
                        </div>
                    </EditableSection>

                    {/* Future Skills */}
                    <EditableSection
                        sectionId="skills"
                        data={sections.skills}
                        onSave={(data) => handleSaveSection('skills', data)}
                    >
                        <div className="skills-section">
                            <h2 className="section-title">{sections.skills.title}</h2>
                            <div className="divider" />
                            <div className="skills-grid">
                                <EditableList
                                    items={sections.skills.skills}
                                    onSave={(newSkills) => {
                                        handleSaveSection('skills', { ...sections.skills, skills: newSkills });
                                    }}
                                    renderItem={(skill) => (
                                        <div className="skill-card glass-card">
                                            <div className="skill-icon">{skill.icon}</div>
                                            <h3 className="skill-title">{skill.title}</h3>
                                            <p className="skill-desc">{skill.desc}</p>
                                            <div className="skill-how">
                                                <span className="skill-how-label">How:</span> {skill.how}
                                            </div>
                                        </div>
                                    )}
                                    defaultItem={{ icon: '🎯', title: '', desc: '', how: '' }}
                                    itemName="Ko'nikma"
                                />
                            </div>
                        </div>
                    </EditableSection>

                    {/* Skills → Classroom table */}
                    <EditableSection
                        sectionId="classroom"
                        data={sections.classroom}
                        onSave={(data) => handleSaveSection('classroom', data)}
                    >
                        <div className="classroom-section">
                            <h2 className="section-title">{sections.classroom.title}</h2>
                            <div className="divider" />
                            <div className="classroom-table glass-card">
                                <div className="classroom-header">
                                    <span>{sections.classroom.skillLabel}</span>
                                    <span>{sections.classroom.practiceLabel}</span>
                                </div>
                                <EditableList
                                    items={sections.classroom.rows || []}
                                    onSave={(newRows) => {
                                        handleSaveSection('classroom', { ...sections.classroom, rows: newRows });
                                    }}
                                    renderItem={(row) => (
                                        <div className="classroom-row">
                                            <span className="classroom-skill">{row.skill}</span>
                                            <span className="classroom-practice">{row.practice}</span>
                                        </div>
                                    )}
                                    defaultItem={{ skill: '', practice: '' }}
                                    itemName="Qator"
                                />
                            </div>
                        </div>
                    </EditableSection>

                    {/* Assessment */}
                    <EditableSection
                        sectionId="assessment"
                        data={sections.assessment}
                        onSave={(data) => handleSaveSection('assessment', data)}
                    >
                        <div className="assess-section glass-card">
                            <h2 className="assess-title">{sections.assessment.title}</h2>
                            <p className="assess-text">{sections.assessment.text}</p>
                        </div>
                    </EditableSection>

                    {/* Curriculum */}
                    <EditableSection
                        sectionId="curriculum"
                        data={sections.curriculum}
                        onSave={(data) => handleSaveSection('curriculum', data)}
                    >
                        <div className="curriculum-section">
                            <h2 className="section-title">{sections.curriculum.title}</h2>
                            <div className="divider" />
                            <div className="curriculum-grid">
                                <EditableList
                                    items={sections.curriculum.curricula.map(c => ({ name: c }))}
                                    onSave={(newCurricula) => {
                                        handleSaveSection('curriculum', {
                                            ...sections.curriculum,
                                            curricula: newCurricula.map(c => c.name)
                                        });
                                    }}
                                    renderItem={(curriculum) => (
                                        <div className="curriculum-card glass-card">
                                            <span className="curriculum-icon">📋</span>
                                            <span className="curriculum-name">{curriculum.name}</span>
                                        </div>
                                    )}
                                    defaultItem={{ name: '' }}
                                    itemName="Dastur"
                                />
                            </div>
                        </div>
                    </EditableSection>

                    {/* Closing */}
                    <EditableSection
                        sectionId="closing"
                        data={sections.closing}
                        onSave={(data) => handleSaveSection('closing', data)}
                    >
                        <div className="edu-closing glass-card">
                            <h2 className="edu-closing-title">{sections.closing.title}</h2>
                            <p className="edu-closing-text">{sections.closing.text}</p>
                        </div>
                    </EditableSection>
                </div>
            </section>
        </div>
    );
}
