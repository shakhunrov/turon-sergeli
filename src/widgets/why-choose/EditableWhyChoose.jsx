import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { EditableList } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './WhyChoose.css';

const icons = ['🌍', '🔬', '👨‍🏫', '❤️', '🎓', '🏫', '💻', '🤖'];

export default function EditableWhyChoose() {
  const { t } = useLang();

  const { sections, handleSaveSection } = useEditableSections('why-choose', {
    main: {
      label: 'TIS afzalliklari',
      title: t.whyChoose.title,
      items: t.whyChoose.items.map((item, i) => ({ text: item, icon: icons[i] })),
    },
  });

  return (
    <EditableSection
      sectionId="main"
      data={sections.main}
      onSave={(data) => handleSaveSection('main', data)}
    >
      <section className="why-choose section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label">{sections.main.label}</span>
            <h2 className="why-choose-title">{sections.main.title}</h2>
            <div className="divider center" />
          </div>

          <div className="why-grid">
            <EditableList
              items={sections.main.items || []}
              onSave={(newItems) => handleSaveSection('main', { ...sections.main, items: newItems })}
              defaultItem={{ text: '', icon: '🌍' }}
              itemName="Card"
              renderItem={(item) => (
                <div className="why-card glass-card">
                  <div className="why-icon">{item.icon}</div>
                  <p className="why-text">{item.text}</p>
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
