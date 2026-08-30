import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // MANUAL FIX: Initialize state from localStorage instead of an empty array
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('realEstateLeads');
    return savedLeads ? JSON.parse(savedLeads) : [];
  });

  // MANUAL FIX: Save to localStorage whenever 'leads' state changes
  useEffect(() => {
    localStorage.setItem('realEstateLeads', JSON.stringify(leads));
  }, [leads]);
  const [formData, setFormData] = useState({ name: '', contact: '', status: 'Warm' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const name = formData.name.trim();
    const contact = formData.contact.trim();
    
    if (!name || name.length <= 2) {
      setError('Name must be more than 2 characters long.');
      return;
    }
    
    if (!contact) {
      setError('Contact information is required.');
      return;
    }

    const newLead = {
      id: crypto.randomUUID(),
      name,
      contact,
      status: formData.status
    };

    setLeads([newLead, ...leads]);
    setFormData({ name: '', contact: '', status: 'Warm' }); // Reset form
  };

  const handleDelete = (id) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-red"></div>
        <div className="blob blob-blue"></div>
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Real Estate Lead Manager</h1>
          <p>Organize and track your property prospects efficiently.</p>
        </header>

        <section className="glass-panel form-section">
          <h2>Add New Lead</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="name">Lead Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="contact">Contact Info</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="jane@example.com / 555-0100"
              />
            </div>

            <div className="input-group">
              <label htmlFor="status">Lead Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">☀️ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn">Add Lead</button>
          </form>
        </section>

        <section className="leads-section">
          <h2>Current Leads ({leads.length})</h2>
          {leads.length === 0 ? (
            <div className="empty-state">No leads found. Add one above!</div>
          ) : (
            <div className="leads-grid">
              {leads.map(lead => (
                <div key={lead.id} className="glass-panel lead-card">
                  <div className="lead-header">
                    <h3>{lead.name}</h3>
                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="lead-contact">{lead.contact}</p>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(lead.id)}
                    aria-label={`Delete ${lead.name}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
