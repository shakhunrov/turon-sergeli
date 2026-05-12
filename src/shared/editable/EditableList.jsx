import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import './EditableList.css';

/**
 * EditableList - Array elementlarini (cardlar, list items) edit/create/delete qilish uchun
 * Har bir card'da alohida edit tugmasi
 */
export default function EditableList({ items = [], onSave, renderItem, defaultItem = {}, itemName = "Item" }) {
    const location = useLocation();
    const isEditableMode = location.pathname.startsWith('/editable');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({});

    const handleEdit = (index, e) => {
        e.stopPropagation();
        setEditingIndex(index);
        setFormData(items[index]);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingIndex(null);
        setFormData(defaultItem);
    };

    const handleDelete = (index, e) => {
        e.stopPropagation();
        if (confirm(`${itemName}ni o'chirmoqchimisiz?`)) {
            const newItems = items.filter((_, i) => i !== index);
            onSave(newItems);
        }
    };

    const handleSaveItem = () => {
        let newItems;
        if (isCreating) {
            newItems = [...items, formData];
        } else {
            newItems = items.map((item, i) => (i === editingIndex ? formData : item));
        }
        onSave(newItems);
        handleClose();
    };

    const handleClose = () => {
        setEditingIndex(null);
        setIsCreating(false);
        setFormData({});
    };

    const renderField = (key, value) => {
        // Rasm uchun
        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('avatar')) {
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
        if (typeof value === 'string' || value === undefined) {
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

        return null;
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, (str) => str.toUpperCase());
    };

    return (
        <>
            {/* List items - har birida edit/delete tugmalari */}
            {items.map((item, index) => (
                <div key={index} className="editable-list-item">
                    {/* Item content */}
                    <div className="editable-list-item-content">
                        {renderItem(item, index)}
                    </div>

                    {/* Edit/Delete buttons - faqat editable rejimda */}
                    {isEditableMode && (
                        <div className="editable-list-item-actions">
                            <button
                                className="editable-list-action-btn edit"
                                onClick={(e) => handleEdit(index, e)}
                                title="Tahrirlash"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                className="editable-list-action-btn delete"
                                onClick={(e) => handleDelete(index, e)}
                                title="O'chirish"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Create tugmasi - faqat editable rejimda */}
            {isEditableMode && (
                <button className="editable-list-create-btn" onClick={handleCreate} title={`Yangi ${itemName} qo'shish`}>
                    <Plus size={16} />
                    <span>Yangi {itemName}</span>
                </button>
            )}

            {/* Edit/Create Modal */}
            {(editingIndex !== null || isCreating) && createPortal(
                <div className="edit-modal-overlay" onClick={handleClose}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h3>{isCreating ? `Yangi ${itemName}` : `${itemName}ni tahrirlash`}</h3>
                            <button className="modal-close-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="edit-modal-body">
                            {Object.keys(isCreating ? defaultItem : items[editingIndex] || {}).map((key) =>
                                renderField(key, formData[key])
                            )}
                        </div>

                        <div className="edit-modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleClose}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveItem}
                            >
                                <Save size={16} />
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
