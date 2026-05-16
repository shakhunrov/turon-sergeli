import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection, EditableList } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { savePageSection } from '../../shared/api/pageSections';
import directorImg from '../../shared/assets/img/director.png';
import './AboutLeadership.css';

export default function EditableAboutLeadership() {
  const { t, lang } = useLang();
  const l = t.about.leadership;
  const branchId = localStorage.getItem('globalBranchId');
  const [uploading, setUploading] = useState(false);

  const { sections, handleSaveSection } = useEditableSections('about-leadership', {
    hero: {
      label: 'Biz haqimizda',
      title: l.title,
    },
    director: {
      name: l.directorName,
      title: l.directorTitle,
      message: l.directorMessage,
      image: directorImg,
    },
    board: {
      title: l.boardTitle,
      desc: l.boardDesc,
      members: [
        { name: 'Board Member 1', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 2', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 3', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 4', role: 'Academic Advisor', avatar: '👤' },
      ],
    },
  });

  // Board member saqlashda rasmni alohida yuklash
  const handleSaveBoardMembers = async (newMembers) => {
    try {
      setUploading(true);

      // Har bir member'ni tekshiramiz va File bo'lsa yuklaymiz
      const processedMembers = await Promise.all(
        newMembers.map(async (member) => {
          if (member.avatar instanceof File) {
            // Rasmni yuklash
            const formData = new FormData();
            formData.append('branch', branchId);
            formData.append('page', 'about-leadership');
            formData.append('section_id', 'board');
            formData.append('image', member.avatar);

            try {
              const response = await savePageSection(formData, true);
              // Backend'dan URL olish
              const imageUrl = response.image || response.url || response.file;
              return { ...member, avatar: imageUrl };
            } catch (error) {
              console.error('Rasm yuklashda xatolik:', error);
              return { ...member, avatar: '👤' }; // Default avatar
            }
          }
          return member;
        })
      );

      // Barcha rasmlar yuklangandan keyin saqlash
      await handleSaveSection('board', { ...sections.board, members: processedMembers });
      setUploading(false);
    } catch (error) {
      console.error('Board members saqlashda xatolik:', error);
      setUploading(false);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

    console.log(sections, 'seksiya')
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
          {/* Director */}
          <EditableSection
            sectionId="director"
            data={sections.director}
            onSave={(data) => handleSaveSection('director', data)}
          >
            <div className="director-section">
              <div className="director-avatar-area">
                <div className="director-avatar">
                  <img
                    src={typeof sections.director.image === 'string' ? sections.director.image : directorImg}
                    alt={sections.director.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
                <div className="director-badge">
                  <span className="badge badge-cyan">{sections.director.title}</span>
                </div>
                <h2 className="director-name">{sections.director.name}</h2>
              </div>
              <div className="director-message glass-card">
                <div className="quote-mark">"</div>
                <p className="director-text">{sections.director.message}</p>
                <div className="director-sig">— {sections.director.name}</div>
              </div>
            </div>
          </EditableSection>

          {/* Advisory Board */}
          <EditableSection
            sectionId="board"
            data={sections.board}
            onSave={(data) => handleSaveSection('board', data)}
          >
            <div className="board-section">
              <h2 className="section-title">{sections.board.title}</h2>
              <div className="divider" />
              <div className="board-desc glass-card">
                <p>{sections.board.desc}</p>
              </div>

              <div className="board-members">
                <EditableList
                  items={sections.board.members}
                  onSave={handleSaveBoardMembers}
                  renderItem={(member) => (
                    <div className="board-card glass-card">
                      <div className="board-avatar">
                        {typeof member.avatar === 'string' && member.avatar.startsWith('http') ? (
                            <img
                                src={member.avatar}
                                alt={member.name}
                                style={{
                                    width: '50%',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }}
                            />
                        ) : (
                          <div className="board-avatar">{typeof member.avatar === 'string' ? member.avatar : '👤'}</div>
                        )}
                      </div>
                      <div className="board-name">{member.name}</div>
                      <div className="board-role">{member.role}</div>
                    </div>
                  )}
                  defaultItem={{ name: '', role: 'Academic Advisor', avatar: '👤' }}
                  itemName="Kengash a'zosi"
                />
                {uploading && (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                    Rasmlar yuklanmoqda...
                  </div>
                )}
              </div>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
}
