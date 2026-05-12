# Page Sections API - Backend Implementation Guide

## Django Model

Backend'da quyidagi model yaratilishi kerak:

```python
# models.py
from django.db import models

class PageSection(models.Model):
    """
    Sahifa section'larini saqlash uchun model
    """
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name='page_sections')
    page = models.CharField(max_length=50)  # 'home', 'about', 'education', etc.
    section_id = models.CharField(max_length=100)  # 'whoWeAre', 'stats', 'philosophy', etc.
    content = models.JSONField()  # Section ma'lumotlari JSON formatda
    image = models.ImageField(upload_to='page_sections/', null=True, blank=True)  # Agar rasm bo'lsa
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'page_sections'
        unique_together = ['branch', 'page', 'section_id']
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.page} - {self.section_id}"
```

## Serializer

```python
# serializers.py
from rest_framework import serializers
from .models import PageSection

class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = ['id', 'branch', 'page', 'section_id', 'content', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_content(self, value):
        """Content JSON formatda bo'lishi kerak"""
        if not isinstance(value, (dict, str)):
            raise serializers.ValidationError("Content must be a valid JSON object or string")
        return value
```

## ViewSet

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PageSection
from .serializers import PageSectionSerializer

class PageSectionViewSet(viewsets.ModelViewSet):
    """
    Page Section CRUD operations
    """
    queryset = PageSection.objects.all()
    serializer_class = PageSectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by branch and page"""
        queryset = super().get_queryset()
        branch = self.request.query_params.get('branch')
        page = self.request.query_params.get('page')
        
        if branch:
            queryset = queryset.filter(branch_id=branch)
        if page:
            queryset = queryset.filter(page=page)
        
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create or update section
        Agar section mavjud bo'lsa, yangilaydi
        """
        branch = request.data.get('branch')
        page = request.data.get('page')
        section_id = request.data.get('section_id')

        # Mavjud section'ni topish
        try:
            instance = PageSection.objects.get(
                branch_id=branch,
                page=page,
                section_id=section_id
            )
            # Update existing
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PageSection.DoesNotExist:
            # Create new
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
```

## URLs

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PageSectionViewSet

router = DefaultRouter()
router.register(r'page-sections', PageSectionViewSet, basename='page-section')

urlpatterns = [
    path('', include(router.urls)),
]
```

## Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

## API Endpoints

### 1. Get all sections for a page
```
GET /api/page-sections/?branch=1&page=home
```

Response:
```json
[
  {
    "id": 1,
    "branch": 1,
    "page": "home",
    "section_id": "whoWeAre",
    "content": {
      "label": "Biz haqimizda",
      "title": "Turon International School",
      "text": "...",
      "image": "/media/page_sections/school.png"
    },
    "image": "/media/page_sections/school.png",
    "created_at": "2026-05-12T00:00:00Z",
    "updated_at": "2026-05-12T00:00:00Z"
  }
]
```

### 2. Create or Update section
```
POST /api/page-sections/
Content-Type: application/json

{
  "branch": 1,
  "page": "home",
  "section_id": "whoWeAre",
  "content": "{\"label\":\"Biz haqimizda\",\"title\":\"Yangi sarlavha\"}"
}
```

### 3. Delete section
```
DELETE /api/page-sections/{id}/
```

## Frontend Integration

Frontend'da allaqachon quyidagi fayllar yaratilgan:

1. **EditableSection.jsx** - Section wrapper komponenti
2. **EditableSection.css** - Stillar
3. **EditableHome.jsx** - Home sahifasining editable versiyasi
4. **pageSections.js** - API funksiyalari

## Qo'shimcha sahifalar uchun

Boshqa sahifalar (About, Education, etc.) uchun ham xuddi shunday editable versiyalarini yaratish mumkin:

```jsx
// EditableAbout.jsx
import { EditableSection } from '../../shared/editable';

export default function EditableAbout() {
    // ... xuddi EditableHome.jsx kabi
}
```

## Test qilish

1. Admin sifatida login qiling
2. Dashboard'da "Saytni ko'rish" tugmasini bosing
3. `/editable/` sahifasiga o'tasiz
4. Har bir section'da edit tugmasi ko'rinadi
5. Edit tugmasini bosing va ma'lumotlarni o'zgartiring
6. Saqlang

## Xavfsizlik

- Faqat autentifikatsiya qilingan adminlar edit qila oladi
- `ProtectedAdminRoute` orqali himoyalangan
- Backend'da `IsAuthenticated` permission ishlatiladi
