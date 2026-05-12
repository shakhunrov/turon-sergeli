import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Save, X } from 'lucide-react';
import './EditableSection.css';

/**
 * EditableSection - har bir section'ni edit qilish imkoniyatini beradi
 *
 * @param {string} sectionId - section identifikatori
 * @param {object} data - section ma'lumotlari
 * @param {function} onSave - saqlash callback
 * @param {ReactNode} children - section content
 */
export default function EditableSection({ sectionId, data, onSave, children, buttonStyle, className, buttonClassName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsFocused(true);
        // Body scroll'ni to'xtatmaslik - modal ichida scroll bo'ladi
        // Boshqa section'larni blur qilish uchun event
        window.dispatchEvent(new CustomEvent('section-focus', { detail: { sectionId } }));
    };

    const handleClose = () => {
        setIsEditing(false);
        setIsFocused(false);
        // Body scroll'ni qayta yoqish
        window.dispatchEvent(new CustomEvent('section-blur'));
    };

    // Boshqa section focus bo'lganda blur qilish
    useEffect(() => {
        const handleFocus = (e) => {
            if (e.detail.sectionId !== sectionId) {
                setIsFocused(false);
            }
        };
        const handleBlur = () => {
            setIsFocused(false);
        };

        window.addEventListener('section-focus', handleFocus);
        window.addEventListener('section-blur', handleBlur);

        return () => {
            window.removeEventListener('section-focus', handleFocus);
            window.removeEventListener('section-blur', handleBlur);
        };
    }, [sectionId]);

    return (
        <div
            className={`editable-section ${isFocused ? 'focused' : ''} ${!isFocused && isEditing ? 'blurred' : ''} ${className || ''}`}
            data-section-id={sectionId}
        >
            {/* Edit tugmasi */}
            <button
                className={`edit-section-btn ${buttonClassName || ''}`}
                onClick={handleEdit}
                title="Bu section'ni tahrirlash"
                style={buttonStyle}
            >
                <Edit2 size={16} />
            </button>

            {/* Section content */}
            <div className="section-content">
                {children}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <EditModal
                    sectionId={sectionId}
                    data={data}
                    onSave={(newData) => {
                        onSave(newData);
                        handleClose();
                    }}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}

/**
 * EditModal - section ma'lumotlarini tahrirlash uchun modal
 */
function EditModal({ sectionId, data, onSave, onClose }) {
    const [formData, setFormData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [statsCards, setStatsCards] = useState([]);
    const [tagsCards, setTagsCards] = useState([]);
    const [itemsCards, setItemsCards] = useState([]);
    const [skillsCards, setSkillsCards] = useState([]);
    const [classroomCards, setClassroomCards] = useState([]);
    const [newsCards, setNewsCards] = useState([]);

    // Stats карточкаларни инициализация қилиш
    useEffect(() => {
        if (data.students || data.teachers || data.programs || data.universities) {
            const cards = [];
            const cardKeys = ['students', 'teachers', 'programs', 'universities'];

            cardKeys.forEach(key => {
                const card = data[key];
                if (card && typeof card === 'object') {
                    cards.push({
                        id: key,
                        label: card.label || '',
                        val: card.val || '',
                        icon: card.icon || '',
                        note: card.note || ''
                    });
                }
            });

            setStatsCards(cards);
        }

        // Tags карточкаларни инициализация қилиш
        if (data.tags && Array.isArray(data.tags)) {
            const cards = data.tags.map((tag, index) => {
                if (typeof tag === 'object') {
                    return {
                        id: index,
                        name: tag.name || '',
                        icon: tag.icon || ''
                    };
                } else {
                    return {
                        id: index,
                        name: tag,
                        icon: ''
                    };
                }
            });
            setTagsCards(cards);
        }

        // Items карточкаларни инициализация қилиш (why-choose items или news items)
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            // Проверяем тип items - если есть date, то это news items
            if (data.items[0].hasOwnProperty('date')) {
                const cards = data.items.map((item, index) => ({
                    id: index,
                    date: item.date || '',
                    title: item.title || '',
                    desc: item.desc || '',
                    image: item.image || ''
                }));
                setNewsCards(cards);
            } else {
                // Иначе это why-choose или testimonials items
                const cards = data.items.map((item, index) => ({
                    id: index,
                    text: item.text || '',
                    icon: item.icon || '',
                    name: item.name || '',
                    role: item.role || ''
                }));
                setItemsCards(cards);
            }
        }

        // Skills карточкаларни инициализация қилиш (education skills)
        if (data.skills && Array.isArray(data.skills)) {
            const cards = data.skills.map((skill, index) => ({
                id: index,
                icon: skill.icon || '',
                title: skill.title || '',
                desc: skill.desc || '',
                how: skill.how || ''
            }));
            setSkillsCards(cards);
        }

        // Classroom карточкаларни инициализация қилиш (classroom rows)
        if (data.rows && Array.isArray(data.rows)) {
            const cards = data.rows.map((row, index) => ({
                id: index,
                skill: row.skill || '',
                practice: row.practice || ''
            }));
            setClassroomCards(cards);
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Stats карточкаларни formData'га қўшиш
            if (statsCards.length > 0) {
                const cardKeys = ['students', 'teachers', 'programs', 'universities'];
                const statsData = {};

                statsCards.forEach((card, index) => {
                    const key = cardKeys[index] || `card${index}`;
                    statsData[key] = {
                        label: card.label,
                        val: card.val,
                    };
                    if (card.icon) statsData[key].icon = card.icon;
                    if (card.note) statsData[key].note = card.note;
                });

                await onSave({ ...formData, ...statsData });
            } else if (tagsCards.length > 0) {
                // Tags карточкаларни formData'га қўшиш
                const tags = tagsCards.map(card => ({
                    name: card.name,
                    icon: card.icon
                }));
                await onSave({ ...formData, tags });
            } else if (itemsCards.length > 0) {
                // Items карточкаларни formData'га қўшиш
                const items = itemsCards.map(card => {
                    const item = { text: card.text };
                    if (card.icon) item.icon = card.icon;
                    if (card.name) item.name = card.name;
                    if (card.role) item.role = card.role;
                    return item;
                });
                await onSave({ ...formData, items });
            } else if (skillsCards.length > 0) {
                // Skills карточкаларни formData'га қўшиш
                const skills = skillsCards.map(card => ({
                    icon: card.icon,
                    title: card.title,
                    desc: card.desc,
                    how: card.how
                }));
                await onSave({ ...formData, skills });
            } else if (classroomCards.length > 0) {
                // Classroom карточкаларни formData'га қўшиш
                const rows = classroomCards.map(card => ({
                    skill: card.skill,
                    practice: card.practice
                }));
                await onSave({ ...formData, rows });
            } else if (newsCards.length > 0) {
                // News карточкаларни formData'га қўшиш
                const items = newsCards.map(card => ({
                    date: card.date,
                    title: card.title,
                    desc: card.desc,
                    image: card.image
                }));
                await onSave({ ...formData, items });
            } else {
                await onSave(formData);
            }
        } finally {
            setLoading(false);
        }
    };

    const addStatsCard = () => {
        setStatsCards([...statsCards, {
            id: `card${statsCards.length}`,
            label: '',
            val: '',
            icon: '',
            note: ''
        }]);
    };

    const removeStatsCard = (index) => {
        setStatsCards(statsCards.filter((_, i) => i !== index));
    };

    const updateStatsCard = (index, field, value) => {
        const updated = [...statsCards];
        updated[index][field] = value;
        setStatsCards(updated);
    };

    const addTagsCard = () => {
        setTagsCards([...tagsCards, {
            id: tagsCards.length,
            name: '',
            icon: ''
        }]);
    };

    const removeTagsCard = (index) => {
        setTagsCards(tagsCards.filter((_, i) => i !== index));
    };

    const updateTagsCard = (index, field, value) => {
        const updated = [...tagsCards];
        updated[index][field] = value;
        setTagsCards(updated);
    };

    const addItemsCard = () => {
        setItemsCards([...itemsCards, {
            id: itemsCards.length,
            text: '',
            icon: '',
            name: '',
            role: ''
        }]);
    };

    const removeItemsCard = (index) => {
        setItemsCards(itemsCards.filter((_, i) => i !== index));
    };

    const updateItemsCard = (index, field, value) => {
        const updated = [...itemsCards];
        updated[index][field] = value;
        setItemsCards(updated);
    };

    const addSkillsCard = () => {
        setSkillsCards([...skillsCards, {
            id: skillsCards.length,
            icon: '',
            title: '',
            desc: '',
            how: ''
        }]);
    };

    const removeSkillsCard = (index) => {
        setSkillsCards(skillsCards.filter((_, i) => i !== index));
    };

    const updateSkillsCard = (index, field, value) => {
        const updated = [...skillsCards];
        updated[index][field] = value;
        setSkillsCards(updated);
    };

    const addClassroomCard = () => {
        setClassroomCards([...classroomCards, {
            id: classroomCards.length,
            skill: '',
            practice: ''
        }]);
    };

    const removeClassroomCard = (index) => {
        setClassroomCards(classroomCards.filter((_, i) => i !== index));
    };

    const updateClassroomCard = (index, field, value) => {
        const updated = [...classroomCards];
        updated[index][field] = value;
        setClassroomCards(updated);
    };

    const addNewsCard = () => {
        setNewsCards([...newsCards, {
            id: newsCards.length,
            date: '',
            title: '',
            desc: '',
            image: ''
        }]);
    };

    const removeNewsCard = (index) => {
        setNewsCards(newsCards.filter((_, i) => i !== index));
    };

    const updateNewsCard = (index, field, value) => {
        const updated = [...newsCards];
        updated[index][field] = value;
        setNewsCards(updated);
    };

    const handleNewsImageUpload = (index, file) => {
        if (file && file.size > 2 * 1024 * 1024) {
            alert('Rasm hajmi 2MB dan oshmasligi kerak');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            updateNewsCard(index, 'image', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const renderField = (key, value) => {
        // Stats секция - все карточки в одном textarea
        if (key === 'students' || key === 'teachers' || key === 'programs' || key === 'universities') {
            // Пропускаем отдельные карточки, они будут обработаны ниже
            return null;
        }

        // Если это объект со stats карточками (title + students, teachers, etc.)
        if (typeof value === 'object' && value !== null && !Array.isArray(value) &&
            (value.hasOwnProperty('students') || value.hasOwnProperty('teachers'))) {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">Stats karochkalari</label>
                    <textarea
                        className="form-input"
                        value={formatAllStatsCards(formData)}
                        onChange={(e) => {
                            const parsed = parseAllStatsCards(e.target.value);
                            setFormData({ ...formData, ...parsed });
                        }}
                        rows={6}
                        placeholder="O'quvchilar - 200+ - 👨‍🎓&#10;O'qituvchilar - 30+ - 👩‍🏫 - Cambridge tajribasi&#10;Dasturlar - 15+ - 📚&#10;Universitetlar - 50+ - 🏛️"
                    />
                    <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        Format: nomi - qiymati - emoji - izoh (ixtiyoriy). Har bir qatorda bitta karochka.
                    </small>
                </div>
            );
        }

        // Stats карточки uchun (students, teachers, programs, universities)
        if (typeof value === 'object' && value !== null && !Array.isArray(value) &&
            (value.hasOwnProperty('val') || value.hasOwnProperty('label') || value.hasOwnProperty('icon'))) {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <textarea
                        className="form-input"
                        value={formatStatCard(formData[key])}
                        onChange={(e) => setFormData({ ...formData, [key]: parseStatCard(e.target.value) })}
                        rows={3}
                        placeholder="label - O'quvchilar&#10;val - 200+&#10;icon - 👨‍🎓&#10;note - (ixtiyoriy)"
                    />
                    <small style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        Format: label - nomi, val - qiymati, icon - emoji, note - izoh (ixtiyoriy)
                    </small>
                </div>
            );
        }

        // Rasm uchun
        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('img')) {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFormData({ ...formData, [key]: file });
                            }
                        }}
                    />
                    {typeof value === 'string' && value && (
                        <img
                            src={value}
                            alt="Preview"
                            style={{ marginTop: 8, maxWidth: 200, borderRadius: 8 }}
                        />
                    )}
                </div>
            );
        }

        // Uzun matn uchun
        if (typeof value === 'string' && value.length > 100) {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <textarea
                        className="form-input"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        rows={4}
                    />
                </div>
            );
        }

        // Oddiy matn uchun
        if (typeof value === 'string') {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                </div>
            );
        }

        // Raqam uchun
        if (typeof value === 'number') {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) })}
                    />
                </div>
            );
        }

        // Array uchun (masalan, list items)
        if (Array.isArray(value) && key !== 'items' && key !== 'skills') {
            return (
                <div className="form-group" key={key}>
                    <label className="form-label">{formatLabel(key)}</label>
                    <textarea
                        className="form-input"
                        value={formData[key]?.join('\n') || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value.split('\n') })}
                        rows={4}
                        placeholder="Har bir qatorga bitta element"
                    />
                </div>
            );
        }

        return null;
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, (str) => str.toUpperCase());
    };

    // Barcha stats карточкаларни битта текстга айлантириш
    const formatAllStatsCards = (data) => {
        const lines = [];
        const cardKeys = ['students', 'teachers', 'programs', 'universities'];

        cardKeys.forEach(key => {
            const card = data[key];
            if (card && typeof card === 'object') {
                const parts = [];
                if (card.label) parts.push(card.label);
                if (card.val) parts.push(card.val);
                if (card.icon) parts.push(card.icon);
                if (card.note) parts.push(card.note);
                if (parts.length > 0) {
                    lines.push(parts.join(' - '));
                }
            }
        });

        return lines.join('\n');
    };

    // Текстдан барча stats карточкаларни парслаш
    const parseAllStatsCards = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const result = {};
        const cardKeys = ['students', 'teachers', 'programs', 'universities'];

        lines.forEach((line, index) => {
            const parts = line.split(' - ').map(p => p.trim()).filter(p => p);
            const key = cardKeys[index] || `card${index}`;

            if (parts.length > 0) {
                result[key] = {
                    label: parts[0] || '',
                    val: parts[1] || '',
                };

                // Icon va note ixtiyoriy
                if (parts[2]) result[key].icon = parts[2];
                if (parts[3]) result[key].note = parts[3];
            }
        });

        return result;
    };

    // Stats карточкани текстга айлантириш
    const formatStatCard = (card) => {
        if (!card) return '';
        const lines = [];
        if (card.label) lines.push(`label - ${card.label}`);
        if (card.val) lines.push(`val - ${card.val}`);
        if (card.icon) lines.push(`icon - ${card.icon}`);
        if (card.note) lines.push(`note - ${card.note}`);
        return lines.join('\n');
    };

    // Текстдан stats карточкани парслаш
    const parseStatCard = (text) => {
        const card = {};
        const lines = text.split('\n');
        lines.forEach(line => {
            const match = line.match(/^(\w+)\s*-\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                card[key.trim()] = value.trim();
            }
        });
        return card;
    };

    return createPortal(
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="edit-modal-header">
                    <h3>Section'ni tahrirlash</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="edit-modal-form">
                    <div className="edit-modal-body">
                        {Object.entries(data).map(([key, value]) => {
                            // Title поле
                            if (key === 'title' && typeof value === 'string') {
                                return (
                                    <div className="form-group" key={key}>
                                        <label className="form-label">{formatLabel(key)}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData[key] || ''}
                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        />
                                    </div>
                                );
                            }
                            return renderField(key, value);
                        })}

                        {/* Agar stats карточкалари бор бўлса, уларни битта textarea'да кўрсатиш */}
                        {(data.students || data.teachers || data.programs || data.universities) && (
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '12px' }}>Stats karochkalari</label>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {statsCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Karochka {index + 1}</strong>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Nomi (masalan: O'quvchilar)"
                                                    value={card.label}
                                                    onChange={(e) => updateStatsCard(index, 'label', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Qiymati (masalan: 200+)"
                                                    value={card.val}
                                                    onChange={(e) => updateStatsCard(index, 'val', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Emoji (masalan: 👨‍🎓)"
                                                    value={card.icon}
                                                    onChange={(e) => updateStatsCard(index, 'icon', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Izoh (ixtiyoriy)"
                                                    value={card.note}
                                                    onChange={(e) => updateStatsCard(index, 'note', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agar tags карточкалари бор бўлса */}
                        {data.tags && Array.isArray(data.tags) && (
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Tags karochkalari</label>
                                    <button
                                        type="button"
                                        onClick={addTagsCard}
                                        className="btn btn-outline"
                                        style={{ padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        + Qo'shish
                                    </button>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {tagsCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Tag {index + 1}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTagsCard(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '0 4px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Nomi (masalan: STEAM)"
                                                    value={card.name}
                                                    onChange={(e) => updateTagsCard(index, 'name', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Emoji (masalan: 🔬)"
                                                    value={card.icon}
                                                    onChange={(e) => updateTagsCard(index, 'icon', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agar items карточкалари бор бўлса (why-choose items) */}
                        {data.items && Array.isArray(data.items) && (
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Items karochkalari</label>
                                    <button
                                        type="button"
                                        onClick={addItemsCard}
                                        className="btn btn-outline"
                                        style={{ padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        + Qo'shish
                                    </button>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {itemsCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Item {index + 1}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItemsCard(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '0 4px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Matn (masalan: Zamonaviy ta'lim texnologiyalari)"
                                                    value={card.text}
                                                    onChange={(e) => updateItemsCard(index, 'text', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Emoji (masalan: 🌍)"
                                                    value={card.icon}
                                                    onChange={(e) => updateItemsCard(index, 'icon', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Ism va Familiya (masalan: Aziz Karimov)"
                                                    value={card.name}
                                                    onChange={(e) => updateItemsCard(index, 'name', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Kim (masalan: O'quvchining otasi, 7-B sinf)"
                                                    value={card.role}
                                                    onChange={(e) => updateItemsCard(index, 'role', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agar skills карточкалари бор бўлса (education skills) */}
                        {data.skills && Array.isArray(data.skills) && (
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Skills karochkalari</label>
                                    <button
                                        type="button"
                                        onClick={addSkillsCard}
                                        className="btn btn-outline"
                                        style={{ padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        + Qo'shish
                                    </button>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {skillsCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Skill {index + 1}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkillsCard(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '0 4px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Icon (masalan: 🧠)"
                                                    value={card.icon}
                                                    onChange={(e) => updateSkillsCard(index, 'icon', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Title (masalan: Tanqidiy fikrlash)"
                                                    value={card.title}
                                                    onChange={(e) => updateSkillsCard(index, 'title', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <textarea
                                                    className="form-input"
                                                    placeholder="Desc (masalan: O'quvchilar ma'lumotlarni tahlil qiladi...)"
                                                    value={card.desc}
                                                    onChange={(e) => updateSkillsCard(index, 'desc', e.target.value)}
                                                    rows={2}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <textarea
                                                    className="form-input"
                                                    placeholder="How (masalan: Izlanishga asoslangan o'rganish...)"
                                                    value={card.how}
                                                    onChange={(e) => updateSkillsCard(index, 'how', e.target.value)}
                                                    rows={2}
                                                    style={{ marginBottom: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agar classroom карточкалари бор бўлса (classroom rows) */}
                        {sectionId === 'classroom' && (
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Classroom karochkalari</label>
                                    <button
                                        type="button"
                                        onClick={addClassroomCard}
                                        className="btn btn-outline"
                                        style={{ padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        + Qo'shish
                                    </button>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {classroomCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Row {index + 1}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeClassroomCard(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '0 4px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Ko'nikma (masalan: Tanqidiy fikrlash)"
                                                    value={card.skill}
                                                    onChange={(e) => updateClassroomCard(index, 'skill', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <textarea
                                                    className="form-input"
                                                    placeholder="Sinfda qanday ko'rinadi (masalan: Izlanishga asoslangan o'rganish...)"
                                                    value={card.practice}
                                                    onChange={(e) => updateClassroomCard(index, 'practice', e.target.value)}
                                                    rows={2}
                                                    style={{ marginBottom: 0 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agar news карточкалари бор бўлса (news items) */}
                        {(data.items && Array.isArray(data.items) && data.items.length > 0 && data.items[0] && data.items[0].hasOwnProperty('date')) && (
                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Yangiliklar karochkalari</label>
                                    <button
                                        type="button"
                                        onClick={addNewsCard}
                                        className="btn btn-outline"
                                        style={{ padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        + Qo'shish
                                    </button>
                                </div>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {newsCards.map((card, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '14px' }}>Yangilik {index + 1}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewsCard(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '0 4px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Sana (masalan: 15 Apr 2026)"
                                                    value={card.date}
                                                    onChange={(e) => updateNewsCard(index, 'date', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Sarlavha"
                                                    value={card.title}
                                                    onChange={(e) => updateNewsCard(index, 'title', e.target.value)}
                                                    style={{ marginBottom: 0 }}
                                                />
                                                <textarea
                                                    className="form-input"
                                                    placeholder="Tavsif"
                                                    value={card.desc}
                                                    onChange={(e) => updateNewsCard(index, 'desc', e.target.value)}
                                                    rows={3}
                                                    style={{ marginBottom: 0 }}
                                                />

                                                {/* Image upload with drag & drop */}
                                                <div
                                                    style={{
                                                        border: '2px dashed #ccc',
                                                        borderRadius: '8px',
                                                        padding: '16px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        backgroundColor: '#fafafa'
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.currentTarget.style.borderColor = '#00d4ff';
                                                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#ccc';
                                                        e.currentTarget.style.backgroundColor = '#fafafa';
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        e.currentTarget.style.borderColor = '#ccc';
                                                        e.currentTarget.style.backgroundColor = '#fafafa';
                                                        const file = e.dataTransfer.files[0];
                                                        if (file && file.type.startsWith('image/')) {
                                                            handleNewsImageUpload(index, file);
                                                        }
                                                    }}
                                                    onClick={() => document.getElementById(`news-image-${index}`).click()}
                                                >
                                                    <input
                                                        id={`news-image-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleNewsImageUpload(index, file);
                                                            }
                                                        }}
                                                    />
                                                    {card.image ? (
                                                        <div>
                                                            <img
                                                                src={card.image}
                                                                alt="Preview"
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '200px',
                                                                    borderRadius: '4px',
                                                                    marginBottom: '8px'
                                                                }}
                                                            />
                                                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                                                Rasmni o'zgartirish uchun bosing yoki sudrab tashlang
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 4px 0' }}>
                                                                📷 Rasm yuklash
                                                            </p>
                                                            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                                                                Bosing yoki sudrab tashlang (max 2MB)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="edit-modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="al-spinner" />
                                    Saqlanmoqda...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Saqlash
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
