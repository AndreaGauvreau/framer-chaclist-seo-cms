import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, ChevronDown, ChevronRight, CheckCircle2, Circle, Trash2, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

// Types
interface ChecklistItem {
  id: string;
  text: string;
  importance: number;
  note?: string;
}

interface ProjectCheckState {
  [itemId: string]: boolean;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  checkStates: ProjectCheckState;
  progress: number;
}

interface ChecklistSection {
  [sectionName: string]: ChecklistItem[];
}

// Données de la checklist
const checklistData: ChecklistSection = {
  "📋 Page Liste des Articles": [
    { id: "pla-1", text: "URL propre et descriptive (/blog, /articles)", importance: 8, note: "Utiliser la fonction URL personnalisée de Framer" },
    { id: "pla-2", text: "Pagination avec query parameters (?page=1, ?page=2)", importance: 9, note: "Google recommande les query parameters" },
    { id: "pla-3", text: "Canonical auto-référentiel pour chaque page paginée", importance: 10, note: "Éviter le duplicate content" },
    { id: "pla-4", text: "Navigation numérotée claire (1, 2, 3... + Suivant/Précédent)", importance: 8, note: "Utiliser des balises <a href>" },
    { id: "pla-5", text: "Éviter les fragment identifiers (#) pour pagination", importance: 9, note: "Google ignore les fragments" },
    { id: "pla-6", text: "Title tag optimisé (50-60 caractères)", importance: 10, note: "Utiliser variables CMS de Framer" },
    { id: "pla-7", text: "Title tag unique pour chaque page paginée", importance: 9, note: "Ajouter numéro de page" },
    { id: "pla-8", text: "Meta description attractive (150-160 caractères)", importance: 8, note: "Site Settings > SEO" },
    { id: "pla-9", text: "Meta robots (index, follow)", importance: 9, note: "Framer gère automatiquement" },
    { id: "pla-10", text: "Balises Open Graph", importance: 7, note: "Page Settings > Social Media Preview" },
    { id: "pla-11", text: "H1 unique et descriptif", importance: 10, note: "Text component avec style H1" },
    { id: "pla-12", text: "Contenu people-first", importance: 10, note: "Core Update 2025 priorité" },
    { id: "pla-13", text: "Aperçus d'articles avec extrait et auteur", importance: 8, note: "Card component avec CMS fields" },
    { id: "pla-14", text: "Images d'aperçu avec alt text", importance: 8, note: "Remplir Alt Text avec variable CMS" },
    { id: "pla-15", text: "Breadcrumb navigation structuré", importance: 7, note: "Avec Schema BreadcrumbList" },
    { id: "pla-16", text: "Core Web Vitals - LCP < 2.5s", importance: 10, note: "Optimiser images avec Framer" },
    { id: "pla-17", text: "Core Web Vitals - INP < 200ms", importance: 10, note: "INP remplace FID depuis 2024" },
    { id: "pla-18", text: "Core Web Vitals - CLS < 0.1", importance: 10, note: "Définir dimensions fixes" },
    { id: "pla-19", text: "Images optimisées WebP/AVIF", importance: 8, note: "Framer convertit automatiquement" },
    { id: "pla-20", text: "Version mobile responsive", importance: 10, note: "Utiliser breakpoints Framer" },
    { id: "pla-21", text: "Schema.org CollectionPage", importance: 8, note: "JSON-LD via Custom Code" },
    { id: "pla-22", text: "Liens internes vers pages importantes", importance: 8, note: "Link components vers piliers" },
    { id: "pla-23", text: "Liens contextuels vers articles connexes", importance: 9, note: "Topical authority 2025" },
  ],
  "📄 Page Article Individuel": [
    { id: "pai-1", text: "URL descriptive avec mot-clé (/blog/titre-article)", importance: 10, note: "Configurer slug field CMS" },
    { id: "pai-2", text: "Structure d'URL cohérente", importance: 9, note: "Utiliser /blog/[slug]" },
    { id: "pai-3", text: "Breadcrumb avec Schema", importance: 8, note: "Accueil > Blog > Article" },
    { id: "pai-4", text: "Title tag optimisé (50-60 car)", importance: 10, note: "Variables CMS: {title} | {siteName}" },
    { id: "pai-5", text: "Meta description unique", importance: 9, note: "Utiliser {excerpt}" },
    { id: "pai-6", text: "E-E-A-T: Experience réelle", importance: 10, note: "Cas pratiques, exemples vécus" },
    { id: "pai-7", text: "E-E-A-T: Expertise démontrée", importance: 10, note: "Citer sources et études" },
    { id: "pai-8", text: "E-E-A-T: Authority (backlinks)", importance: 9, note: "Contenu linkable" },
    { id: "pai-9", text: "E-E-A-T: Trust et transparence", importance: 10, note: "Plus important des E-E-A-T" },
    { id: "pai-10", text: "H1 unique avec mot-clé", importance: 10, note: "Un seul H1 par page" },
    { id: "pai-11", text: "Structure headings logique", importance: 9, note: "H1 > H2 > H3" },
    { id: "pai-12", text: "Contenu people-first (1500+ mots)", importance: 10, note: "Articles approfondis" },
    { id: "pai-13", text: "Date de publication visible", importance: 8, note: "Date field CMS" },
    { id: "pai-14", text: "Date de modification", importance: 9, note: "Freshness signal" },
    { id: "pai-15", text: "Auteur avec bio détaillée", importance: 9, note: "Page auteur dédiée" },
    { id: "pai-16", text: "Credentials auteur visibles", importance: 10, note: "Formation, certifications" },
    { id: "pai-17", text: "Images avec alt text optimisé", importance: 9, note: "Alt text unique et descriptif" },
    { id: "pai-18", text: "Schema Article/BlogPosting", importance: 9, note: "JSON-LD BlogPosting" },
    { id: "pai-19", text: "Schema Author détaillé", importance: 8, note: "Person schema complet" },
    { id: "pai-20", text: "FAQ Schema si applicable", importance: 8, note: "Pour AI Overviews" },
    { id: "pai-21", text: "Liens internes contextuels", importance: 10, note: "3-5 liens minimum" },
    { id: "pai-22", text: "Liens externes autoritaires", importance: 9, note: "Sources fiables E-E-A-T" },
    { id: "pai-23", text: "Articles suggérés pertinents", importance: 8, note: "Section À lire aussi" },
    { id: "pai-24", text: "INP < 200ms toutes interactions", importance: 10, note: "Mesure globale réactivité" },
    { id: "pai-25", text: "Optimisation AI Overviews", importance: 9, note: "Questions spécifiques" },
    { id: "pai-26", text: "Citations vérifiables", importance: 9, note: "Fact-checking crucial" },
  ]
};

// Styles CSS
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #030712;
    color: #f3f4f6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Scrollbar Styles */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  *::-webkit-scrollbar-track {
    background: #111827;
  }
  
  *::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 4px;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }
  
  /* Container Styles */
  .app-container {
    min-height: 100vh;
    background-color: #030712;
    color: #f3f4f6;
  }
  
  .header {
    background-color: #111827;
    border-bottom: 1px solid #1f2937;
    padding: 16px 24px;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: #f3f4f6;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #2563eb;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #1d4ed8;
  }
  
  .main-layout {
    display: flex;
    height: calc(100vh - 73px);
  }
  
  /* Sidebar Styles */
  .sidebar {
    width: 256px;
    background-color: #111827;
    border-right: 1px solid #1f2937;
    padding: 16px;
    overflow-y: auto;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .sidebar-title {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .sidebar-count {
    font-size: 12px;
    color: #6b7280;
  }
  
  .empty-projects {
    color: #6b7280;
    font-size: 14px;
    text-align: center;
    padding: 32px 0;
  }
  
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .project-item {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  
  .project-item:hover {
    background-color: rgba(31, 41, 55, 0.5);
  }
  
  .project-item.active {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .project-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .project-name {
    font-weight: 500;
    font-size: 14px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .btn-delete {
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    margin-left: 8px;
    transition: color 0.2s;
  }
  
  .btn-delete:hover {
    color: #ef4444;
  }
  
  .project-progress {
    margin-top: 8px;
  }
  
  .progress-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
  }
  
  .progress-bar {
    margin-top: 4px;
    background-color: #374151;
    border-radius: 9999px;
    height: 6px;
    overflow: hidden;
  }
  
  .progress-fill {
    background-color: #10b981;
    height: 100%;
    transition: width 0.3s;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    overflow-y: auto;
  }
  
  .content-wrapper {
    padding: 24px;
  }
  
  .project-title {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .project-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #9ca3af;
    margin-bottom: 24px;
  }
  
  .project-meta-separator {
    color: #4b5563;
  }
  
  .project-completion {
    color: #10b981;
  }
  
  .btn-toggle-notes {
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Urbanist', sans-serif;
    transition: color 0.2s;
  }
  
  .btn-toggle-notes:hover {
    color: #60a5fa;
  }
  
  /* Section Styles */
  .section {
    margin-bottom: 32px;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    color: #f3f4f6;
    padding: 0;
    transition: color 0.2s;
  }
  
  .section-header:hover {
    color: #d1d5db;
  }
  
  .checklist-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .checklist-item {
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #374151;
    transition: all 0.2s;
  }
  
  .checklist-item.unchecked {
    background-color: rgba(31, 41, 55, 0.5);
  }
  
  .checklist-item.unchecked:hover {
    background-color: #1f2937;
  }
  
  .checklist-item.checked {
    background-color: rgba(16, 185, 129, 0.1);
    border-color: #047857;
  }
  
  .item-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .checkbox-btn {
    margin-top: 2px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .item-text {
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .item-text.checked {
    color: #10b981;
    text-decoration: line-through;
  }
  
  .importance-badge {
    font-size: 12px;
    font-weight: 700;
  }
  
  .importance-high {
    color: #f87171;
  }
  
  .importance-medium {
    color: #fb923c;
  }
  
  .importance-low {
    color: #fbbf24;
  }
  
  .item-note {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  /* Empty State */
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .empty-state-content {
    text-align: center;
  }
  
  .empty-state-icon {
    width: 64px;
    height: 64px;
    color: #4b5563;
    margin: 0 auto 16px;
  }
  
  .empty-state-text {
    color: #6b7280;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 50;
  }
  
  .modal-content {
    background-color: #111827;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    max-width: 448px;
    border: 1px solid #1f2937;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .modal-title {
    font-size: 20px;
    font-weight: 600;
  }
  
  .btn-close {
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
  }
  
  .btn-close:hover {
    color: #d1d5db;
  }
  
  .input {
    width: 100%;
    padding: 8px 16px;
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    color: #f3f4f6;
    font-family: 'Urbanist', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .input:focus {
    border-color: #2563eb;
  }
  
  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }
  
  .btn-secondary {
    flex: 1;
    background-color: #1f2937;
    color: #f3f4f6;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-secondary:hover {
    background-color: #374151;
  }
`;

// Composant principal
export default function SEOChecklistApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showNotes, setShowNotes] = useState(true);

  // Charger les projets depuis localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('seo-checklist-projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setProjects(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
      if (parsed.length > 0 && !activeProjectId) {
        setActiveProjectId(parsed[0].id);
      }
    }
  }, []);

  // Sauvegarder les projets dans localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('seo-checklist-projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Initialiser les sections expandées
  useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    Object.keys(checklistData).forEach(section => {
      initialExpanded[section] = true;
    });
    setExpandedSections(initialExpanded);
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const createProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      createdAt: new Date(),
      checkStates: {},
      progress: 0
    };

    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
    setNewProjectName('');
    setShowNewProjectModal(false);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(projects.find(p => p.id !== projectId)?.id || null);
    }
  };

  const toggleCheck = useCallback((itemId: string, e: React.MouseEvent) => {
    if (!activeProject) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newCheckStates = {
      ...activeProject.checkStates,
      [itemId]: !activeProject.checkStates[itemId]
    };

    // Animation confetti si on coche
    if (!activeProject.checkStates[itemId]) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight
        },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.8,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true
      });
    }

    // Calculer le progress
    const totalItems = Object.values(checklistData).flat().length;
    const checkedItems = Object.values(newCheckStates).filter(Boolean).length;
    const progress = Math.round((checkedItems / totalItems) * 100);

    setProjects(projects.map(p => 
      p.id === activeProject.id 
        ? { ...p, checkStates: newCheckStates, progress }
        : p
    ));
  }, [activeProject, projects]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getImportanceClass = (importance: number) => {
    if (importance >= 9) return 'importance-high';
    if (importance >= 7) return 'importance-medium';
    return 'importance-low';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">
              <FileText style={{ width: 24, height: 24, color: '#3b82f6' }} />
              SEO Checklist Manager
            </h1>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="btn-primary"
            >
              <Plus style={{ width: 16, height: 16 }} />
              Nouveau Projet
            </button>
          </div>
        </div>

        <div className="main-layout">
          {/* Sidebar - Projets */}
          <div className="sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Projets</h2>
              <span className="sidebar-count">{projects.length}</span>
            </div>
            
            {projects.length === 0 ? (
              <p className="empty-projects">Aucun projet créé</p>
            ) : (
              <div className="project-list">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className={`project-item ${activeProjectId === project.id ? 'active' : ''}`}
                    onClick={() => setActiveProjectId(project.id)}
                  >
                    <div className="project-header">
                      <h3 className="project-name">{project.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Supprimer ce projet ?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="btn-delete"
                      >
                        <Trash2 style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                    <div className="project-progress">
                      <div className="progress-info">
                        <span>{project.progress}% complété</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="main-content">
            {activeProject ? (
              <div className="content-wrapper">
                <h2 className="project-title">{activeProject.name}</h2>
                <div className="project-meta">
                  <span>Créé le {activeProject.createdAt.toLocaleDateString()}</span>
                  <span className="project-meta-separator">•</span>
                  <span className="project-completion">{activeProject.progress}% complété</span>
                  <span className="project-meta-separator">•</span>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="btn-toggle-notes"
                  >
                    {showNotes ? 'Masquer' : 'Afficher'} les notes
                  </button>
                </div>

                {Object.entries(checklistData).map(([section, items]) => (
                  <div key={section} className="section">
                    <button
                      onClick={() => toggleSection(section)}
                      className="section-header"
                    >
                      {expandedSections[section] ? 
                        <ChevronDown style={{ width: 20, height: 20 }} /> : 
                        <ChevronRight style={{ width: 20, height: 20 }} />
                      }
                      {section}
                    </button>
                    
                    {expandedSections[section] && (
                      <div className="checklist-items">
                        {items.map(item => {
                          const isChecked = activeProject.checkStates[item.id] || false;
                          return (
                            <div
                              key={item.id}
                              className={`checklist-item ${isChecked ? 'checked' : 'unchecked'}`}
                            >
                              <div className="item-content">
                                <button
                                  onClick={(e) => toggleCheck(item.id, e)}
                                  className="checkbox-btn"
                                >
                                  {isChecked ? (
                                    <CheckCircle2 style={{ width: 20, height: 20, color: '#10b981' }} />
                                  ) : (
                                    <Circle style={{ width: 20, height: 20, color: '#6b7280' }} />
                                  )}
                                </button>
                                
                                <div className="item-details">
                                  <div className="item-header">
                                    <p className={`item-text ${isChecked ? 'checked' : ''}`}>
                                      {item.text}
                                    </p>
                                    <span className={`importance-badge ${getImportanceClass(item.importance)}`}>
                                      {item.importance}/10
                                    </span>
                                  </div>
                                  {showNotes && item.note && (
                                    <p className="item-note">{item.note}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FileText className="empty-state-icon" />
                  <p className="empty-state-text">Sélectionnez un projet ou créez-en un nouveau</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Nouveau Projet */}
        {showNewProjectModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Nouveau Projet</h3>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="btn-close"
                >
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>
              
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createProject()}
                placeholder="Nom du projet"
                className="input"
                autoFocus
              />
              
              <div className="modal-actions">
                <button
                  onClick={createProject}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Créer
                </button>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}