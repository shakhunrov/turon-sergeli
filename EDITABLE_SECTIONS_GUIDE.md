# Editable Page Sections - Foydalanish Qo'llanmasi

## Umumiy ma'lumot

Bu funksiya admin foydalanuvchilarga sayt sahifalarini to'g'ridan-to'g'ri brauzerda tahrirlash imkonini beradi. Har bir sahifa section'larga bo'lingan va har bir section'ni alohida tahrirlash mumkin.

## Asosiy xususiyatlar

✅ **Admin uchun maxsus rejim** - `/editable/*` route'lari orqali
✅ **Har bir section'da edit tugmasi** - o'ng tomonda qalamcha ikoni
✅ **Focus/Blur effekti** - Edit bosilganda faqat o'sha section focus, qolganlari blur
✅ **Modal oyna** - Section ma'lumotlarini tahrirlash uchun
✅ **Rasm yuklash** - Section'larda rasm bo'lsa, uni ham o'zgartirish mumkin
✅ **Real-time saqlash** - Ma'lumotlar darhol backend'ga saqlanadi

## Qanday ishlaydi?

### 1. Admin Dashboard'dan kirish

```
Admin Dashboard → "Saytni ko'rish" tugmasi → /editable/ sahifasiga o'tadi
```

### 2. Section'ni tahrirlash

1. Sahifada har bir section ustiga hover qiling
2. O'ng tomonda **edit tugmasi** (qalamcha ikoni) paydo bo'ladi
3. Edit tugmasini bosing
4. Modal oyna ochiladi va section ma'lumotlari ko'rsatiladi
5. Ma'lumotlarni o'zgartiring
6. **"Saqlash"** tugmasini bosing

### 3. Focus/Blur effekti

- Edit tugmasi bosilganda:
  - O'sha section **focus** bo'ladi (outline ko'rinadi)
  - Boshqa section'lar **blur** bo'ladi (xira ko'rinadi)
  - Faqat edit qilinayotgan section bilan ishlash mumkin

## Fayl strukturasi

```
src/
├── shared/
│   └── editable/
│       ├── EditableSection.jsx      # Asosiy wrapper komponenti
│       ├── EditableSection.css      # Stillar
│       └── index.js                 # Export
│
├── pages/
│   └── home/
│       ├── Home.jsx                 # Oddiy sahifa
│       └── EditableHome.jsx         # Editable versiya
│
└── shared/
    └── api/
        └── pageSections.js          # API funksiyalari
```

## Yangi sahifa qo'shish

Boshqa sahifalar uchun ham editable versiya yaratish:

```jsx
// EditableAbout.jsx
import { useState, useEffect } from 'react';
import { EditableSection } from '../../shared/editable';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';

export default function EditableAbout() {
    const branchId = localStorage.getItem('globalBranchId');
    
    const [sections, setSections] = useState({
        vision: {
            title: 'Bizning viziyamiz',
            text: '...',
        },
        mission: {
            title: 'Missiyamiz',
            text: '...',
        },
    });

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await getPageSections({ branch: branchId, page: 'about' });
                if (data && data.length > 0) {
                    const loadedSections = {};
                    data.forEach(section => {
                        loadedSections[section.section_id] = JSON.parse(section.content);
                    });
                    setSections(prev => ({ ...prev, ...loadedSections }));
                }
            } catch (error) {
                console.error('Xatolik:', error);
            }
        };
        loadSections();
    }, [branchId]);

    const handleSaveSection = async (sectionId, data) => {
        try {
            await savePageSection({
                branch: branchId,
                page: 'about',
                section_id: sectionId,
                content: JSON.stringify(data),
            });
            setSections(prev => ({ ...prev, [sectionId]: data }));
            alert('Saqlandi!');
        } catch (error) {
            console.error('Xatolik:', error);
            alert('Xatolik yuz berdi!');
        }
    };

    return (
        <div className="page">
            <EditableSection
                sectionId="vision"
                data={sections.vision}
                onSave={(data) => handleSaveSection('vision', data)}
            >
                <section className="section">
                    <h2>{sections.vision.title}</h2>
                    <p>{sections.vision.text}</p>
                </section>
            </EditableSection>

            <EditableSection
                sectionId="mission"
                data={sections.mission}
                onSave={(data) => handleSaveSection('mission', data)}
            >
                <section className="section">
                    <h2>{sections.mission.title}</h2>
                    <p>{sections.mission.text}</p>
                </section>
            </EditableSection>
        </div>
    );
}
```

## Route qo'shish

App.jsx fayliga yangi route qo'shing:

```jsx
import EditableAbout from '../pages/about/EditableAbout';

// ...

<Route path="/editable/about" element={<EditableAbout />} />
```

## Ma'lumot turlari

EditableSection avtomatik ravishda turli xil ma'lumot turlarini aniqlaydi:

- **String (qisqa)** → Input field
- **String (uzun)** → Textarea
- **Number** → Number input
- **Array** → Textarea (har bir qatorga bitta element)
- **Image** → File upload + preview

## Xavfsizlik

- Faqat **autentifikatsiya qilingan adminlar** edit qila oladi
- `/editable/*` route'lari `ProtectedAdminRoute` bilan himoyalangan
- Backend'da `IsAuthenticated` permission talab qilinadi

## Texnologiyalar

- **React** - Frontend framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Ikonlar
- **Django REST Framework** - Backend API (tavsiya etiladi)

## Muammolarni hal qilish

### Edit tugmasi ko'rinmayapti
- Sahifa `/editable/*` route'ida ekanligini tekshiring
- Admin sifatida login qilganingizni tekshiring

### Ma'lumotlar saqlanmayapti
- Backend API ishlab turganini tekshiring
- Browser console'da xatolarni ko'ring
- Network tab'da API so'rovlarini tekshiring

### Rasm yuklanmayapti
- Backend'da `MEDIA_ROOT` va `MEDIA_URL` sozlanganini tekshiring
- File upload uchun `multipart/form-data` ishlatilganini tekshiring

## Kelajakda qo'shilishi mumkin

- [ ] Drag & drop orqali section'larni qayta tartiblash
- [ ] Undo/Redo funksiyasi
- [ ] Version history
- [ ] Preview rejimi (o'zgarishlarni ko'rish, lekin saqlamasdan)
- [ ] Bulk edit (bir nechta section'ni birga tahrirlash)
- [ ] Rich text editor (WYSIWYG)
- [ ] Image cropper
- [ ] Multi-language support (har bir til uchun alohida content)

## Yordam

Agar savollar bo'lsa yoki yordam kerak bo'lsa, backend va frontend kodlarini tekshiring yoki development jamoasiga murojaat qiling.
