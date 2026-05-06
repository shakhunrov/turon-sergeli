import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAdminAuth } from '../../shared/admin/adminAuth';
import { logout as reduxLogout } from '../../features/auth';
import {
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
  selectPositions,
  selectPositionsLoading,
  selectPositionsError,
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
  selectApplications,
  selectApplicationsLoading,
  selectApplicationsError,
} from '../../features/careers';
import {
  fetchAdmissions,
  updateAdmissionStatus,
  deleteAdmission,
  selectAdmissions,
  selectAdmissionsLoading,
  selectAdmissionsError,
} from '../../features/admissions';
import {
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
  selectNewsList,
  selectNewsLoading,
  selectNewsError,
} from '../../features/news';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategoriesList,
  selectCategoriesLoading,
} from '../../features/categories';
import {
  Newspaper, Briefcase, UserPlus, Plus, Edit2, Trash2,
  LogOut, Search, CheckCircle, Clock,
  X, Save, Shield, TrendingUp, Globe,
  Upload, Tag, List as ListIcon, FileText,
} from 'lucide-react';
import './AdminDashboard.css';

const TYPE_CHOICES = ['Academic', 'Non-Academic'];
const ADMISSION_STATUSES = ['pending', 'contacted', 'enrolled', 'rejected'];
const PLACEHOLDER = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80';

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const positions = useSelector(selectPositions);
  const positionsLoading = useSelector(selectPositionsLoading);
  const positionsError = useSelector(selectPositionsError);
  
  const applications = useSelector(selectApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const applicationsError = useSelector(selectApplicationsError);
  
  const admissions = useSelector(selectAdmissions);
  const admissionsLoading = useSelector(selectAdmissionsLoading);
  const admissionsError = useSelector(selectAdmissionsError);
  
  const newsList = useSelector(selectNewsList);
  const newsLoading = useSelector(selectNewsLoading);
  const newsError = useSelector(selectNewsError);

  const categoriesList = useSelector(selectCategoriesList);
  const categoriesLoading = useSelector(selectCategoriesLoading);

  // UI state
  const [view, setView] = useState('news-list');
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState('news');
  const branchId = localStorage.getItem("globalBranchId")
  const [statusModal, setStatusModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' });

  const section = view.startsWith('pos') ? 'positions' 
                : view.startsWith('adm') ? 'admissions' 
                : view.startsWith('cat') ? 'categories' 
                : view.startsWith('app') ? 'applications' 
                : 'news';

  // Initial global fetches
  useEffect(() => {
    dispatch(fetchCategories({ branch: branchId }));
  }, [dispatch, branchId]);

  // Section-specific fetches matching API query properties
  useEffect(() => {
    if (view === 'news-list') {
      const params = { branch: branchId };
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (catFilter !== 'All') {
         const cat = categoriesList.find(c => c.name === catFilter);
         if (cat) params.category_id = cat.id;
      }
      dispatch(fetchNews(params));
    }
  }, [dispatch, view, branchId, dateFrom, dateTo, catFilter, categoriesList.length]);

  useEffect(() => {
    if (view === 'pos-list') {
      const params = { branch: branchId };
      if (dateFrom) params.deadline_from = dateFrom;
      if (dateTo) params.deadline_to = dateTo;
      if (typeFilter !== 'All') params.type = typeFilter;
      dispatch(fetchPositions(params));
    }
  }, [dispatch, view, branchId, dateFrom, dateTo, typeFilter]);

  useEffect(() => {
    if (view === 'adm-list') {
      const params = { branch: branchId };
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (statusFilter !== 'All') params.status = statusFilter;
      dispatch(fetchAdmissions(params));
    }
  }, [dispatch, view, branchId, dateFrom, dateTo, statusFilter]);

  useEffect(() => {
    if (view === 'app-list') {
      const params = { branch: branchId };
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (statusFilter !== 'All') params.status = statusFilter;
      dispatch(fetchApplications(params));
    }
  }, [dispatch, view, branchId, dateFrom, dateTo, statusFilter]);

  // Refresh helpers
  const refreshNews = () => dispatch(fetchNews({ branch: branchId }));
  const refreshCategories = () => dispatch(fetchCategories({ branch: branchId }));

  // Filters
  const published = newsList.filter((n) => n.published).length;
  const filteredNews = newsList.filter((n) => {
    const matchSearch = (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (n.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || n.category?.name === catFilter || n.category === catFilter;
    return matchSearch && matchCat;
  });

  const filteredPositions = positions.filter((p) => {
    const matchSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const filteredAdmissions = admissions.filter((a) => {
    const matchSearch = (a.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.phone || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredCategories = categoriesList.filter((c) => 
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredApplications = applications.filter((a) => {
    const matchSearch = (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.phone || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handlers
  const handleDeleteNews = (id) => {
    dispatch(deleteNews(id)).then((res) => { if (!res.error) refreshNews(); });
    setDeleteId(null);
  };
  const handleDeletePosition = (id) => { dispatch(deletePosition(id)); setDeleteId(null); };
  const handleDeleteAdmission = (id) => { dispatch(deleteAdmission(id)); setDeleteId(null); };
  const handleDeleteApplication = (id) => { dispatch(deleteApplication(id)); setDeleteId(null); };
  const handleDeleteCategory = (id) => { 
    dispatch(deleteCategory(id)).then((res) => { if (!res.error) refreshCategories(); });
    setDeleteId(null); 
  };
  
  const handleTogglePublish = (item) => {
    dispatch(updateNews({ 
      id: item.id, published: !item.published, branch: branchId,
      title: item.title, description: item.description, 
      category_id: item.category?.id || item.category_id, date: item.date 
    })).then((res) => { if (!res.error) refreshNews(); });
  };
  
  const handleLogout = () => { logout(); dispatch(reduxLogout()); navigate('/admin'); };

  const statusColor = (s) => {
    switch (s) {
      case 'enrolled': return 'published';
      case 'contacted': return 'draft';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  const renderDateFilters = () => (
    <div className="admin-date-filters" style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 'auto', marginRight: 16 }}>
      <input type="date" className="admin-search" style={{ width: 135 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="Date From" />
      <span style={{ color: '#94a3b8' }}>-</span>
      <input type="date" className="admin-search" style={{ width: 135 }} value={dateTo} onChange={e => setDateTo(e.target.value)} title="Date To" />
      {(dateFrom || dateTo) && (
        <button className="admin-filter-btn" onClick={() => { setDateFrom(''); setDateTo(''); }}>Tozalash</button>
      )}
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo"><Shield size={22} /><span>TIS Boshqaruv</span></div>
        <nav className="sidebar-nav">
          <button className={`sidebar-item ${section === 'news' ? 'active' : ''}`}
            onClick={() => { setView('news-list'); setSearch(''); }}>
            <Newspaper size={18} /> Yangiliklar
          </button>
          <button className={`sidebar-item ${section === 'categories' ? 'active' : ''}`}
            onClick={() => { setView('cat-list'); setSearch(''); }}>
            <ListIcon size={18} /> Kategoriyalar
          </button>
          <button className={`sidebar-item ${section === 'positions' ? 'active' : ''}`}
            onClick={() => { setView('pos-list'); setSearch(''); }}>
            <Briefcase size={18} /> Vakansiyalar
          </button>
          <button className={`sidebar-item ${section === 'applications' ? 'active' : ''}`}
            onClick={() => { setView('app-list'); setSearch(''); }}>
            <FileText size={18} /> Arizalar
          </button>
          <button className={`sidebar-item ${section === 'admissions' ? 'active' : ''}`}
            onClick={() => { setView('adm-list'); setSearch(''); }}>
            <UserPlus size={18} /> Qabullar
          </button>
          <Link to="/" className="sidebar-item" target="_blank" rel="noreferrer">
            <Globe size={18} /> Saytni ko'rish
          </Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}><LogOut size={16} /> Chiqish</button>
      </aside>

      <main className="admin-main">

        {/* ═══════════════════ NEWS LIST ═══════════════════ */}
        {view === 'news-list' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <TrendingUp size={22} style={{ color: '#1a2b6b' }} />
                <div className="stat-info"><div className="stat-val">{newsList.length}</div><div className="stat-label">Jami yangiliklar</div></div>
              </div>
              <div className="admin-stat-card">
                <CheckCircle size={22} style={{ color: '#10b981' }} />
                <div className="stat-info"><div className="stat-val">{published}</div><div className="stat-label">Nashr etilgan</div></div>
              </div>
              <div className="admin-stat-card">
                <Clock size={22} style={{ color: '#c9a535' }} />
                <div className="stat-info"><div className="stat-val">{newsList.length - published}</div><div className="stat-label">Qoralamalar</div></div>
              </div>
              <div className="admin-stat-card">
                <Newspaper size={22} style={{ color: '#2d4090' }} />
                <div className="stat-info"><div className="stat-val">{categoriesList.length}</div><div className="stat-label">Kategoriyalar</div></div>
              </div>
            </div>
            <div className="admin-list-header">
              <div className="admin-search-wrap">
                <Search size={16} className="admin-search-icon" />
                <input className="admin-search" placeholder="Yangilik izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="admin-filters">
                {['All', ...new Set(categoriesList.map(c => c.name))].map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)} className={`admin-filter-btn ${catFilter === c ? 'active' : ''}`}>{c === 'All' ? 'Barchasi' : c}</button>
                ))}
              </div>
              {renderDateFilters()}
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setView('news-create'); }}>
                <Plus size={16} /> Yangi yangilik
              </button>
            </div>
            {newsError && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 20px', borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
                {typeof newsError === 'string' ? newsError : 'Yangiliklarni yuklashda xatolik.'}
              </div>
            )}
            {newsLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} />
                Yangiliklar yuklanmoqda…
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Yangilik</th><th>Kategoriya</th><th>Sana</th><th>Holati</th><th>Harakatlar</th></tr></thead>
                  <tbody>
                    {filteredNews.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Yangiliklar topilmadi.</td></tr>
                    )}
                    {filteredNews.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="post-cell">
                            <div className="post-thumb">
                              <img src={item.image || PLACEHOLDER} alt={item.title} onError={(e) => { e.target.src = PLACEHOLDER; }} />
                            </div>
                            <div>
                              <div className="post-title">{item.title}</div>
                              <div className="post-desc-short">{(item.description || '').slice(0, 65)}…</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="cat-badge">{item.category?.name || item.category || `ID: ${item.category_id}`}</span></td>
                        <td className="date-cell">{item.date}</td>
                        <td>
                          <button onClick={() => handleTogglePublish(item)} className={`status-btn ${item.published ? 'published' : 'draft'}`}>
                            {item.published ? <><CheckCircle size={13} /> Nashr etilgan</> : <><Clock size={13} /> Qoralama</>}
                          </button>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn edit" title="Tahrirlash" onClick={() => { setEditItem(item); setView('news-edit'); }}><Edit2 size={15} /></button>
                            <button className="action-btn delete" title="O'chirish" onClick={() => { setDeleteType('news'); setDeleteId(item.id); }}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ NEWS FORM ═══════════════════ */}
        {(view === 'news-create' || view === 'news-edit') && (
          <NewsForm
            item={editItem}
            loading={newsLoading}
            categories={categoriesList}
            onSave={(data) => {
              if (view === 'news-create') {
                dispatch(createNews({ ...data, branch: branchId })).then((res) => {
                  if (!res.error) { refreshNews(); setView('news-list'); }
                });
              } else {
                dispatch(updateNews({ id: editItem.id, ...data, branch: branchId })).then((res) => {
                  if (!res.error) { refreshNews(); setView('news-list'); }
                });
              }
            }}
            onCancel={() => setView('news-list')}
          />
        )}


        {/* ═══════════════════ CATEGORIES LIST ═══════════════════ */}
        {view === 'cat-list' && (
          <>
            <div className="admin-list-header" style={{ marginTop: 20 }}>
              <div className="admin-search-wrap">
                <Search size={16} className="admin-search-icon" />
                <input className="admin-search" placeholder="Kategoriya izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setView('cat-create'); }}>
                <Plus size={16} /> Yangi kategoriya
              </button>
            </div>

            {categoriesLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} /> Kategoriyalar yuklanmoqda…
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Kategoriya nomi</th><th>Harakatlar</th></tr></thead>
                  <tbody>
                    {filteredCategories.length === 0 && (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Kategoriyalar topilmadi.</td></tr>
                    )}
                    {filteredCategories.map((item) => (
                      <tr key={item.id}>
                        <td style={{ color: '#94a3b8', width: 80 }}>#{item.id}</td>
                        <td><div className="post-title">{item.name}</div></td>
                        <td style={{ width: 120 }}>
                          <div className="action-btns">
                            <button className="action-btn edit" title="Tahrirlash" onClick={() => { setEditItem(item); setView('cat-edit'); }}><Edit2 size={15} /></button>
                            <button className="action-btn delete" title="O'chirish" onClick={() => { setDeleteType('category'); setDeleteId(item.id); }}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ CATEGORY FORM ═══════════════════ */}
        {(view === 'cat-create' || view === 'cat-edit') && (
          <CategoryForm
            item={editItem}
            loading={categoriesLoading}
            onSave={(data) => {
              if (view === 'cat-create') {
                dispatch(createCategory({ ...data, branch: branchId })).then((res) => {
                  if (!res.error) { refreshCategories(); setView('cat-list'); }
                });
              } else {
                dispatch(updateCategory({ id: editItem.id, ...data, branch: branchId })).then((res) => {
                  if (!res.error) { refreshCategories(); setView('cat-list'); }
                });
              }
            }}
            onCancel={() => setView('cat-list')}
          />
        )}

        {/* ═══════════════════ POSITIONS LIST ═══════════════════ */}
        {view === 'pos-list' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <Briefcase size={22} style={{ color: '#4f46e5' }} />
                <div className="stat-info"><div className="stat-val">{positions.length}</div><div className="stat-label">Jami vakansiyalar</div></div>
              </div>
              <div className="admin-stat-card">
                <CheckCircle size={22} style={{ color: '#10b981' }} />
                <div className="stat-info"><div className="stat-val">{positions.filter((p) => p.is_active).length}</div><div className="stat-label">Faol</div></div>
              </div>
              <div className="admin-stat-card">
                <Clock size={22} style={{ color: '#c9a535' }} />
                <div className="stat-info"><div className="stat-val">{positions.filter((p) => !p.is_active).length}</div><div className="stat-label">Nofaol</div></div>
              </div>
              <div className="admin-stat-card">
                <Tag size={22} style={{ color: '#2d4090' }} />
                <div className="stat-info"><div className="stat-val">{TYPE_CHOICES.length}</div><div className="stat-label">Turlar</div></div>
              </div>
            </div>
            <div className="admin-list-header">
              <div className="admin-search-wrap">
                <Search size={16} className="admin-search-icon" />
                <input className="admin-search" placeholder="Vakansiya izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="admin-filters">
                {['All', ...TYPE_CHOICES].map((t) => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`admin-filter-btn ${typeFilter === t ? 'active' : ''}`}>{t === 'All' ? 'Barchasi' : t}</button>
                ))}
              </div>
              {renderDateFilters()}
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setView('pos-create'); }}>
                <Plus size={16} /> Yangi vakansiya
              </button>
            </div>
            {positionsError && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 20px', borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
                {typeof positionsError === 'string' ? positionsError : 'Vakansiyalarni yuklashda xatolik.'}
              </div>
            )}
            {positionsLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} /> Vakansiyalar yuklanmoqda…
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Vakansiya</th><th>Turi</th><th>Bandlik</th><th>Muddat</th><th>Holati</th><th>Harakatlar</th></tr></thead>
                  <tbody>
                    {filteredPositions.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Vakansiyalar topilmadi.</td></tr>
                    )}
                    {filteredPositions.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="post-cell">
                            <div className="post-icon"><Briefcase size={18} style={{ color: '#4f46e5' }} /></div>
                            <div>
                              <div className="post-title">{item.title}</div>
                              <div className="post-desc-short">{item.description?.slice(0, 60)}…</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="cat-badge">{item.type}</span></td>
                        <td className="date-cell">{item.employment_type}</td>
                        <td className="date-cell">{item.deadline || '—'}</td>
                        <td>
                          <span className={`status-btn ${item.is_active ? 'published' : 'draft'}`}>
                            {item.is_active ? <><CheckCircle size={13} /> Active</> : <><Clock size={13} /> Inactive</>}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn edit" title="Edit" onClick={() => { setEditItem(item); setView('pos-edit'); }}><Edit2 size={15} /></button>
                            <button className="action-btn delete" title="Delete" onClick={() => { setDeleteType('position'); setDeleteId(item.id); }}><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ POSITION FORM ═══════════════════ */}
        {(view === 'pos-create' || view === 'pos-edit') && (
          <PositionForm
            item={editItem}
            loading={positionsLoading}
            onSave={(data) => {
              if (view === 'pos-create') {
                dispatch(createPosition({ ...data, branch: branchId })).then((res) => {
                  if (!res.error) setView('pos-list');
                });
              } else {
                dispatch(updatePosition({ id: editItem.id, ...data, branch: branchId })).then((res) => {
                  if (!res.error) setView('pos-list');
                });
              }
            }}
            onCancel={() => setView('pos-list')}
          />
        )}

        {/* ═══════════════════ ADMISSIONS LIST ═══════════════════ */}
        {view === 'adm-list' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <UserPlus size={22} style={{ color: '#4f46e5' }} />
                <div className="stat-info"><div className="stat-val">{admissions.length}</div><div className="stat-label">Jami</div></div>
              </div>
              <div className="admin-stat-card">
                <Clock size={22} style={{ color: '#f59e0b' }} />
                <div className="stat-info"><div className="stat-val">{admissions.filter((a) => a.status === 'pending').length}</div><div className="stat-label">Kutilmoqda</div></div>
              </div>
              <div className="admin-stat-card">
                <CheckCircle size={22} style={{ color: '#10b981' }} />
                <div className="stat-info"><div className="stat-val">{admissions.filter((a) => a.status === 'enrolled').length}</div><div className="stat-label">Qabul qilingan</div></div>
              </div>
              <div className="admin-stat-card">
                <X size={22} style={{ color: '#ef4444' }} />
                <div className="stat-info"><div className="stat-val">{admissions.filter((a) => a.status === 'rejected').length}</div><div className="stat-label">Rad etilgan</div></div>
              </div>
            </div>
            <div className="admin-list-header">
              <div className="admin-search-wrap">
                <Search size={16} className="admin-search-icon" />
                <input className="admin-search" placeholder="Ism yoki raqam bo'yicha izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="admin-filters">
                {['All', ...ADMISSION_STATUSES].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}>
                    {s === 'All' ? 'Barchasi' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              {renderDateFilters()}
            </div>
            {admissionsError && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 20px', borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
                {typeof admissionsError === 'string' ? admissionsError : 'Qabullarni yuklashda xatolik.'}
              </div>
            )}
            {admissionsLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} /> Qabullar yuklanmoqda…
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>O'quvchi</th><th>Telefon</th><th>Sinf</th><th>Holati</th><th>Sana</th><th>Harakatlar</th></tr></thead>
                  <tbody>
                    {filteredAdmissions.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Qabullar topilmadi.</td></tr>
                    )}
                    {filteredAdmissions.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="post-cell">
                            <div className="post-icon"><UserPlus size={18} style={{ color: '#4f46e5' }} /></div>
                            <div>
                              <div className="post-title">{item.student_name}</div>
                              {item.notes && <div className="post-desc-short">{item.notes}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="date-cell">{item.phone}</td>
                        <td><span className="cat-badge">{item.grade}</span></td>
                        <td>
                          <button className={`status-btn ${statusColor(item.status)}`}
                            onClick={() => { setStatusModal(item); setStatusForm({ status: item.status, notes: item.notes || '' }); }}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                          </button>
                        </td>
                        <td className="date-cell">{item.created_at?.slice(0, 10) || '—'}</td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn edit" title="Holatni o'zgartirish"
                              onClick={() => { setStatusModal(item); setStatusForm({ status: item.status, notes: item.notes || '' }); }}>
                              <Edit2 size={15} />
                            </button>
                            <button className="action-btn delete" title="O'chirish"
                              onClick={() => { setDeleteType('admission'); setDeleteId(item.id); }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {/* ═══════════════════ APPLICATIONS LIST ═══════════════════ */}
        {view === 'app-list' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <FileText size={22} style={{ color: '#4f46e5' }} />
                <div className="stat-info"><div className="stat-val">{applications.length}</div><div className="stat-label">Jami yaroqli</div></div>
              </div>
              <div className="admin-stat-card">
                <Clock size={22} style={{ color: '#f59e0b' }} />
                <div className="stat-info"><div className="stat-val">{applications.filter((a) => a.status === 'pending').length}</div><div className="stat-label">Kutilmoqda</div></div>
              </div>
              <div className="admin-stat-card">
                <CheckCircle size={22} style={{ color: '#10b981' }} />
                <div className="stat-info"><div className="stat-val">{applications.filter((a) => a.status === 'contacted').length}</div><div className="stat-label">Bog'lanilgan</div></div>
              </div>
            </div>
            <div className="admin-list-header">
              <div className="admin-search-wrap">
                <Search size={16} className="admin-search-icon" />
                <input className="admin-search" placeholder="Ism, email yoki raqam orqali izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="admin-filters">
                {['All', 'pending', 'contacted', 'rejected'].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}>
                    {s === 'All' ? 'Barchasi' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              {renderDateFilters()}
            </div>
            {applicationsError && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 20px', borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
                {typeof applicationsError === 'string' ? applicationsError : 'Arizalarni yuklashda xatolik.'}
              </div>
            )}
            {applicationsLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} /> Arizalar yuklanmoqda…
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Ism / Vakansiya</th><th>Aloqa</th><th>Holati</th><th>Sana</th><th>CV (Rezyume)</th><th>Harakatlar</th></tr></thead>
                  <tbody>
                    {filteredApplications.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Arizalar topilmadi.</td></tr>
                    )}
                    {filteredApplications.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="post-cell">
                            <div className="post-icon"><FileText size={18} style={{ color: '#4f46e5' }} /></div>
                            <div>
                              <div className="post-title">{item.name}</div>
                              {item.position && <div className="post-desc-short">Vakansiya ID: {item.position}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="post-desc-short">{item.email}</div>
                          <div className="post-desc-short" style={{ marginTop: 2 }}>{item.phone}</div>
                        </td>
                        <td>
                          <button className={`status-btn ${statusColor(item.status)}`}
                            onClick={() => { setStatusModal({ ...item, type: 'application' }); setStatusForm({ status: item.status || 'pending', notes: item.notes || '' }); }}>
                            {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : 'Kutilmoqda'}
                          </button>
                        </td>
                        <td className="date-cell">{item.created_at?.slice(0, 10) || '—'}</td>
                        <td>
                          {item.cv_file ? (
                            <a href={item.cv_file} target="_blank" rel="noreferrer" className="news-cat-badge" style={{ backgroundColor: 'var(--navy)', display: 'inline-block', padding: '6px 12px', fontSize: 11, cursor: 'pointer', textDecoration: 'none' }}>
                             Rezyumeni ko'rish
                            </a>
                          ) : <span className="date-cell">—</span>}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn edit" title="Holatni o'zgartirish"
                              onClick={() => { setStatusModal({ ...item, type: 'application' }); setStatusForm({ status: item.status || 'pending', notes: item.notes || '' }); }}>
                              <Edit2 size={15} />
                            </button>
                            <button className="action-btn delete" title="O'chirish"
                              onClick={() => { setDeleteType('application'); setDeleteId(item.id); }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══ Delete Modal ═══ */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon"><Trash2 size={28} /></div>
            <h3>Siz ushbu {deleteType === 'news' ? "yangilikni" : deleteType === 'category' ? "kategoriyani" : deleteType === 'position' ? "vakansiyani" : deleteType === 'application' ? "arizani" : "qabulni"} o'chirib tashlaysizmi?</h3>
            <p>Bu amalni ortga qaytarib bo'lmaydi.</p>
            <div className="delete-actions">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Bekor qilish</button>
              <button className="btn btn-danger" onClick={() => {
                if (deleteType === 'news') handleDeleteNews(deleteId);
                else if (deleteType === 'category') handleDeleteCategory(deleteId);
                else if (deleteType === 'position') handleDeletePosition(deleteId);
                else if (deleteType === 'application') handleDeleteApplication(deleteId);
                else handleDeleteAdmission(deleteId);
              }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Admission Status Modal ═══ */}
      {statusModal && (
        <div className="modal-overlay" onClick={() => setStatusModal(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 style={{ marginBottom: 4 }}>Holatni yangilash</h3>
            <p style={{ marginBottom: 20 }}>{statusModal.student_name || statusModal.name} — {statusModal.phone}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block' }}>Holati</label>
                <select className="form-input" value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}>
                  {ADMISSION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ marginBottom: 6, display: 'block' }}>Izohlar</label>
                <textarea className="form-input" rows={3} placeholder="Izoh qo'shish…"
                  value={statusForm.notes} onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })} />
              </div>
              <div className="delete-actions" style={{ marginBottom: 0 }}>
                <button className="btn btn-outline" onClick={() => setStatusModal(null)}>Bekor qilish</button>
                <button className="btn btn-primary" disabled={admissionsLoading || applicationsLoading} onClick={() => {
                  if (statusModal.type === 'application') {
                    dispatch(updateApplicationStatus({
                      id: statusModal.id, status: statusForm.status, notes: statusForm.notes,
                    })).then((res) => { if (!res.error) { dispatch(fetchApplications({ branch: branchId })); setStatusModal(null); } });
                  } else {
                    dispatch(updateAdmissionStatus({
                      id: statusModal.id, status: statusForm.status, notes: statusForm.notes,
                    })).then((res) => { if (!res.error) setStatusModal(null); });
                  }
                }}>
                  <Save size={14} /> {(admissionsLoading || applicationsLoading) ? 'Saqlanmoqda…' : 'Saqlash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ─── Category Form ─── */
function CategoryForm({ item, loading, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: item?.name || '',
  });

  return (
    <div className="news-form-wrap" style={{ maxWidth: 450 }}>
      <div className="news-form-header">
        <h2>{item ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo\'shish'}</h2>
        <button className="form-close" onClick={onCancel}><X size={20} /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="news-form">
        <div className="form-group">
          <label className="form-label">Kategoriya nomi *</label>
          <input className="form-input" placeholder="masalan, Tadbirlar" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-actions" style={{ marginTop: 24 }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Bekor qilish</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="al-spinner" /> : <Save size={16} />}
            {' '}{item ? 'Kategoriyani yangilash' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}


/* ─── News Form ─── */
function NewsForm({ item, loading, categories, onSave, onCancel }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: item?.title || '',
    category_id: item?.category?.id || item?.category_id || '',
    date: item?.date || new Date().toISOString().slice(0, 10),
    description: item?.description || item?.desc || '',
    published: item?.published ?? false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [imageTab, setImageTab] = useState('upload');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (imageFile) {
      payload.image = imageFile; // File object → FormData in thunk
    }
    onSave(payload);
  };

  return (
    <div className="news-form-wrap">
      <div className="news-form-header">
        <h2>{item ? 'Yangilikni tahrirlash' : 'Yangi yangilik yaratish'}</h2>
        <button className="form-close" onClick={onCancel}><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Sarlavha *</label>
            <input className="form-input" placeholder="Yangilik sarlavhasi" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Kategoriya *</label>
            <select className="form-input" value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="" disabled>Kategoriya tanlang…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sana</label>
            <input className="form-input" type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Matn *</label>
          <textarea className="form-input" placeholder="Yangilik matnini kiriting…"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
        </div>
        <div className="form-group">
          <label className="form-label">Yangilik rasmi</label>
          <div className="image-section">
            <div className="image-tabs">
              <button type="button" className={`image-tab ${imageTab === 'upload' ? 'active' : ''}`}
                onClick={() => setImageTab('upload')}><Upload size={14} /> Fayl yuklash</button>
            </div>
            <div className="image-upload-zone" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              <Upload size={24} className="upload-icon" />
              <p>{imageFile ? imageFile.name : 'Rasm tanlash uchun bosing'}</p>
              <span>JPG, PNG, WebP — max ~4 MB</span>
            </div>
            {imagePreview && (
              <div className="image-preview-wrap">
                <img src={imagePreview} alt="Preview" className="image-preview"
                  onError={(e) => { e.target.src = PLACEHOLDER; }} />
                <button type="button" className="image-clear"
                  onClick={() => { setImageFile(null); setImagePreview(''); }}><X size={14} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="publish-toggle">
          <label className="publish-label">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="publish-check" />
            <span className="publish-track"><span className="publish-thumb" /></span>
            <span>{form.published ? 'Nashr etilgan' : 'Qoralama sifatida saqlash'}</span>
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>Bekor qilish</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="al-spinner" /> : <Save size={16} />}
            {' '}{item ? 'Yangilikni yangilash' : 'Ommaga e\'lon qilish'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Position Form ─── */
function PositionForm({ item, loading, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: item?.title || '', type: item?.type || TYPE_CHOICES[0],
    employment_type: item?.employment_type || '', description: item?.description || '',
    requirements: item?.requirements ? item.requirements.join(', ') : '',
    posted_date: item?.posted_date || new Date().toISOString().slice(0, 10),
    deadline: item?.deadline || '', is_active: item?.is_active ?? true,
  });

  return (
    <div className="news-form-wrap">
      <div className="news-form-header">
        <h2>{item ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya yaratish'}</h2>
        <button className="form-close" onClick={onCancel}><X size={20} /></button>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, requirements: form.requirements.split(',').map((r) => r.trim()).filter(Boolean) });
      }} className="news-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Sarlavha *</label>
            <input className="form-input" placeholder="Vakansiya sarlavhasi" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Turi *</label>
            <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPE_CHOICES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bandlik turi *</label>
            <input className="form-input" placeholder="masalan, To'liq stavka" value={form.employment_type}
              onChange={(e) => setForm({ ...form, employment_type: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">E'lon qilingan sana</label>
            <input className="form-input" type="date" value={form.posted_date}
              onChange={(e) => setForm({ ...form, posted_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Muddat *</label>
            <input className="form-input" type="date" value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Matn *</label>
          <textarea className="form-input" placeholder="Vakansiya haqida ma'lumot bering…"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
        </div>
        <div className="form-group">
          <label className="form-label">Talablar (vergul bilan ajrating)</label>
          <textarea className="form-input" placeholder="masalan, ingliz tili, rus tili"
            value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={2} />
        </div>
        <div className="publish-toggle">
          <label className="publish-label">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="publish-check" />
            <span className="publish-track"><span className="publish-thumb" /></span>
            <span>{form.is_active ? 'Faol' : 'Nofaol'}</span>
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>Bekor qilish</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="al-spinner" /> : <Save size={16} />}
            {' '}{item ? 'Vakansiyani yangilash' : 'Vakansiya yaratish'}
          </button>
        </div>
      </form>
    </div>
  );
}
