import React, { useState, useEffect } from 'react';
import { Github, Mail, MapPin, Star, GitFork, ExternalLink, Users, Code, Loader, Folder } from 'lucide-react';
import './App.css';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/portfolio');
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API returned HTML instead of JSON - check if Flask is running on port 5000');
      }

      const data = await response.json();
      setPortfolio(data);
    } catch (err) {
      setError(err.message);
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader className="loading-spinner" />
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchPortfolio} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-content">
            {/* Profile Section */}
            <div className="profile-section">
              {portfolio?.avatar_url && (
                <img
                  src={portfolio.avatar_url}
                  alt={portfolio.name}
                  className="profile-avatar"
                />
              )}
              <h1 className="profile-name">
                {portfolio?.name || 'Adi Pardeshi'}
              </h1>
              {portfolio?.title && (
                <p className="profile-title">{portfolio.title}</p>
              )}
              {portfolio?.bio && (
                <p className="profile-bio">{portfolio.bio}</p>
              )}
            </div>

            {/* Contact Links */}
            <div className="contact-section">
              {portfolio?.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <Github className="contact-icon" />
                  <span>GitHub Profile</span>
                </a>
              )}
              {portfolio?.email && (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="contact-link"
                >
                  <Mail className="contact-icon" />
                  <span>Send Email</span>
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-info">
                  <Code className="stat-icon" />
                  <span className="stat-label">Repositories</span>
                </div>
                <span className="stat-value">
                  {portfolio?.public_repos || 0}
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <Star className="stat-icon" />
                  <span className="stat-label">Stars</span>
                </div>
                <span className="stat-value">
                  {portfolio?.total_stars || 0}
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <Users className="stat-icon" />
                  <span className="stat-label">Followers</span>
                </div>
                <span className="stat-value">
                  {portfolio?.followers || 0}
                </span>
              </div>
            </div>

            {/* Skills */}
            {portfolio?.skills && (
              <div className="skills-section">
                <h3>Skills</h3>
                <div className="skills-grid">
                  {portfolio.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            {portfolio?.location && (
              <div className="location-info">
                <MapPin className="location-icon" />
                <span>{portfolio.location}</span>
              </div>
            )}
            <p className="footer-text">
              Built with React & Flask
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Projects Section */}
          <div className="projects-header">
            <Folder className="projects-icon" />
            <h2 className="projects-title">Projects</h2>
            {portfolio?.projects && (
              <span className="projects-count">
                {portfolio.projects.length}
              </span>
            )}
          </div>

          {!portfolio?.projects || portfolio.projects.length === 0 ? (
            <div className="empty-state">
              <Folder className="empty-icon" />
              <h3 className="empty-title">No Projects Yet</h3>
              <p className="empty-description">
                Projects will appear here once they're available from the API.
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-header">
                    <h3 className="project-title">{project.name}</h3>
                    <div className="project-links">
                      {project.html_url && (
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <Github className="project-link-icon" />
                        </a>
                      )}
                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <ExternalLink className="project-link-icon" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="project-description">
                    {project.description || 'No description available'}
                  </p>

                  <div className="project-stats">
                    {project.language && (
                      <span className="project-stat">
                        <Code className="project-stat-icon" />
                        <span>{project.language}</span>
                      </span>
                    )}
                    <span className="project-stat">
                      <Star className="project-stat-icon" />
                      <span>{project.stars || 0}</span>
                    </span>
                    <span className="project-stat">
                      <GitFork className="project-stat-icon" />
                      <span>{project.forks || 0}</span>
                    </span>
                  </div>

                  {project.topics && project.topics.length > 0 && (
                    <div className="project-topics">
                      {project.topics.slice(0, 4).map((topic, i) => (
                        <span key={i} className="topic-tag">
                          {topic}
                        </span>
                      ))}
                      {project.topics.length > 4 && (
                        <span className="topic-tag more-topics">
                          +{project.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}