# Page Sections (Live Editing) API Documentation

This API provides endpoints for managing editable sections on the website. It is designed to support the "Live Editing" feature where administrators can update content directly on the page.

## Base URL
All requests should be made to:
`https://school.gennis.uz/api/` (or your local development server)

## Authentication
Most endpoints require a valid JWT token in the header:
`Authorization: Bearer <access_token>`

---

## 1. Get Page Sections
Retrieve all editable sections for a specific page and branch.

**Endpoint:** `GET /page-sections/`

**Query Parameters:**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `branch` | Integer | No | Branch ID (from `globalBranchId`) |
| `page` | String | Yes | Page identifier (e.g., `home`, `education`, `about-campus`) |

**Response (Example):**
```json
[
  {
    "id": 1,
    "branch": 1,
    "page": "home",
    "section_id": "whoWeAre",
    "content": {
      "label": "About Us",
      "title": "Welcome to TIS",
      "text": "..."
    },
    "image": "https://api.domain.com/media/sections/images/school.png",
    "updated_at": "2026-05-12T09:50:00Z"
  }
]
```

---

## 2. Save/Update Page Section (Upsert)
Create a new section or update an existing one. The backend identifies the section by the combination of `branch`, `page`, and `section_id`.

**Endpoint:** `POST /page-sections/`

**Content-Type:** `application/json` or `multipart/form-data` (if uploading an image)

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `branch` | Integer | Yes | Branch ID |
| `page` | String | Yes | Page identifier |
| `section_id` | String | Yes | Section identifier (e.g., `stats`, `hero`) |
| `content` | JSON | Yes | The actual data for the section |
| `image` | File | No | Optional image file |

**Example (JSON):**
```json
{
  "branch": 1,
  "page": "home",
  "section_id": "stats",
  "content": {
    "title": "Our Impact",
    "students": {"val": "1000+", "label": "Students"}
  }
}
```

**Response:**
Returns the saved object with status `200 OK` (update) or `201 Created` (new).

---

## 3. Delete Page Section
Remove a section by its database ID.

**Endpoint:** `DELETE /page-sections/{id}/`

**Response:**
Status `204 No Content`.

---

## Usage in Frontend (Example)

```javascript
// Fetching sections
const loadSections = async (page) => {
    const branchId = localStorage.getItem('globalBranchId');
    const { data } = await api.get('/page-sections/', { 
        params: { branch: branchId, page: page } 
    });
    return data; // Returns array of sections
};

// Saving a section
const handleSave = async (sectionId, content) => {
    const branchId = localStorage.getItem('globalBranchId');
    await api.post('/page-sections/', {
        branch: branchId,
        page: 'home',
        section_id: sectionId,
        content: content
    });
};
```
