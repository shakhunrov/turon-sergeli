# Page Sections API Documentation

This API provides endpoints for managing editable sections on the website, including support for multiple images.

## Base URL
`https://school.gennis.uz/api/`

## Authentication
`Authorization: Bearer <access_token>`

---

## 1. Get Page Sections
Retrieve all editable sections for a specific page and branch.

**Endpoint:** `GET /page-sections/`

**Query Parameters:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `branch` | Integer | No | Branch ID |
| `page` | String | Yes | Page identifier (e.g., `home`, `about-campus`) |

**Response (Example):**
```json
[
  {
    "id": 1,
    "branch": 1,
    "page": "home",
    "section_id": "whoWeAre",
    "content_uz": { "title": "Xush kelibsiz", "text": "..." },
    "content_en": { "title": "Welcome", "text": "..." },
    "content_ru": { "title": "Добро пожаловать", "text": "..." },
    "image": "https://api.domain.com/media/sections/images/main.png",
    "images": [
      {
        "id": 10,
        "image": "https://api.domain.com/media/sections/images/gallery1.png",
        "order": 0
      },
      {
        "id": 11,
        "image": "https://api.domain.com/media/sections/images/gallery2.png",
        "order": 1
      }
    ],
    "updated_at": "2026-05-12T09:50:00Z"
  }
]
```

---

## 2. Save/Update Page Section (Upsert)
Create a new section or update an existing one (identifies by `branch`, `page`, and `section_id`). This endpoint handles the main image and JSON content.

**Endpoint:** `POST /page-sections/`
**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `branch` | Integer | Yes | Branch ID |
| `page` | String | Yes | Page identifier |
| `section_id` | String | Yes | Section identifier |
| `content_uz` | JSON String | No | Content in Uzbek |
| `content_en` | JSON String | No | Content in English |
| `content_ru` | JSON String | No | Content in Russian |
| `image` | File | No | Main image file |

---

## 3. Upload Multiple Images
Add one or more images to an existing PageSection.

**Endpoint:** `POST /page-sections/{id}/upload-images/`
**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `images` | Files[] | Yes | One or more image files (multiple parts with same name) |

**Response:** Returns the updated PageSection object.

---

## 4. Delete Specific Image
Remove a secondary image from a section.

**Endpoint:** `DELETE /page-sections/images/{id}/`

**Response:** `204 No Content`
