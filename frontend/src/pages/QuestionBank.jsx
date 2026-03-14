import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATIC_QUESTIONS = [
  { _id: '1', text: 'What is Operating System?', unit: 'OS Basics', type: 'Descriptive', marks: 5, year: 2026 },
  { _id: '2', text: 'Define Deadlock.', unit: 'Process Management', type: 'Short Answer', marks: 3, year: 2025 },
  { _id: '3', text: 'What is Virtual Memory?', unit: 'Memory Management', type: 'MCQ', marks: 2, year: 2026 },
  { _id: '4', text: 'Explain the concept of Paging in Operating Systems.', unit: 'Memory Management', type: 'Descriptive', marks: 7, year: 2026 },
  { _id: '5', text: 'What is a Process Control Block (PCB)?', unit: 'Process Management', type: 'Short Answer', marks: 4, year: 2025 },
  { _id: '6', text: 'Define Thrashing.', unit: 'Memory Management', type: 'Short Answer', marks: 3, year: 2026 },
  { _id: '7', text: 'What are the different CPU scheduling algorithms?', unit: 'Process Management', type: 'Descriptive', marks: 6, year: 2025 },
  { _id: '8', text: 'Explain the difference between Multiprogramming and Multitasking.', unit: 'OS Basics', type: 'Descriptive', marks: 5, year: 2026 },
  { _id: '9', text: 'What is a Semaphore?', unit: 'Process Management', type: 'MCQ', marks: 2, year: 2025 },
  { _id: '10', text: 'Define Page Replacement Algorithm.', unit: 'Memory Management', type: 'Short Answer', marks: 4, year: 2026 },
];

function QuestionBank() {
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('questionBank');
    return saved ? JSON.parse(saved) : STATIC_QUESTIONS;
  });
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [qType, setQType] = useState('MCQ');
  const [formData, setFormData] = useState({
      text: '', unit: 'Unit 01', marks: 2, options: { a: '', b: '', c: '', d: '' }
  });
  const [editFormData, setEditFormData] = useState({
      text: '', unit: '', marks: 2, type: '', options: { a: '', b: '', c: '', d: '' }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('All Units');
  const [filterMarks, setFilterMarks] = useState('Marks (Any)');
  const [filterYear, setFilterYear] = useState('Year (Any)');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    localStorage.setItem('questionBank', JSON.stringify(questions));
    applyFilters();
  }, [questions, searchTerm, filterUnit, filterMarks, filterYear]);

  const applyFilters = () => {
    let filtered = questions;
    if (searchTerm) {
      filtered = filtered.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterUnit !== 'All Units') {
      filtered = filtered.filter(q => q.unit === filterUnit);
    }
    if (filterMarks !== 'Marks (Any)') {
      filtered = filtered.filter(q => q.marks === parseInt(filterMarks));
    }
    if (filterYear !== 'Year (Any)') {
      filtered = filtered.filter(q => q.year === parseInt(filterYear));
    }
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  const fetchQuestions = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/questions');
          if (res.data && res.data.length > 0) {
            setQuestions(res.data);
          }
      } catch (err) {
          console.error('Error fetching questions', err);
      }
  };

  const saveQuestion = async () => {
      if(!formData.text) return alert('Please enter question statement');
      
      const newQuestion = {
          _id: Date.now().toString(),
          text: formData.text,
          type: qType,
          unit: formData.unit,
          marks: formData.marks,
          year: 2026,
          options: qType === 'MCQ' ? formData.options : undefined
      };

      try {
          await axios.post('http://localhost:5000/api/questions', newQuestion);
      } catch (err) {
          console.error(err);
      }
      
      setQuestions([newQuestion, ...questions]);
      setIsModalOpen(false);
      setFormData({ text: '', unit: 'Unit 01', marks: 2, options: { a: '', b: '', c: '', d: '' } });
  };

  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q._id !== id));
    }
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setEditFormData({
      text: question.text,
      unit: question.unit,
      marks: question.marks,
      type: question.type,
      options: question.options || { a: '', b: '', c: '', d: '' }
    });
    setIsEditModalOpen(true);
  };

  const saveEditQuestion = () => {
    if (!editFormData.text) return alert('Please enter question statement');
    
    const updatedQuestions = questions.map(q => 
      q._id === selectedQuestion._id 
        ? { ...q, text: editFormData.text, unit: editFormData.unit, marks: editFormData.marks, type: editFormData.type, options: editFormData.options }
        : q
    );
    
    setQuestions(updatedQuestions);
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
  };

  const openPreviewModal = (question) => {
    setSelectedQuestion(question);
    setIsPreviewModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  return (
    <div className="screen active" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Question Repository</h1>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Insert Question
            </button>
        </div>

        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="btn-sub" 
              style={{ padding: '0.65rem', textAlign: 'left', fontWeight: 400, border: '1px solid var(--border)', gridColumn: 'span 2' }} 
              placeholder="🔍 Search content keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="btn-sub" style={{ fontWeight: 400, padding: '0.65rem' }} value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
              <option>All Units</option>
              <option>OS Basics</option>
              <option>Process Management</option>
              <option>Memory Management</option>
            </select>
            <select className="btn-sub" style={{ fontWeight: 400, padding: '0.65rem' }} value={filterMarks} onChange={(e) => setFilterMarks(e.target.value)}>
              <option>Marks (Any)</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </select>
            <select className="btn-sub" style={{ fontWeight: 400, padding: '0.65rem' }} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option>Year (Any)</option>
              <option>2025</option>
              <option>2026</option>
            </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '2px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>QUESTION CONTENT</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>UNIT</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>TYPE</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>MARKS</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>YEAR</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {currentQuestions.map((q, idx) => (
                        <tr key={q._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafbfc', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'} onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fafbfc'}>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem', color: '#1e293b', maxWidth: '400px' }}>{q.text}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>{q.unit}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span className={`badge ${q.type === 'MCQ' ? 'badge-warning' : q.type === 'Descriptive' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>
                                {q.type}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'center', fontSize: '0.9rem', color: '#6366f1' }}>{String(q.marks).padStart(2, '0')}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748b', textAlign: 'center', fontSize: '0.85rem' }}>{q.year || '2026'}</td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button onClick={() => openEditModal(q)} style={{ padding: '0.35rem 0.65rem', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }} title="Edit">✏️</button>
                                <button onClick={() => deleteQuestion(q._id)} style={{ padding: '0.35rem 0.65rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }} title="Delete">🗑️</button>
                                <button onClick={() => openPreviewModal(q)} style={{ padding: '0.35rem 0.65rem', background: '#f3e8ff', color: '#6b21a8', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }} title="Preview">👁️</button>
                              </div>
                            </td>
                        </tr>
                    ))}
                    {filteredQuestions.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>No questions found. Try adjusting your filters.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              style={{ padding: '0.5rem 1rem', background: currentPage === 1 ? '#f1f5f9' : '#6366f1', color: currentPage === 1 ? '#94a3b8' : '#fff', border: 'none', borderRadius: '0.5rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
            >
              Previous
            </button>
            <span style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#64748b' }}>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              style={{ padding: '0.5rem 1rem', background: currentPage === totalPages ? '#f1f5f9' : '#6366f1', color: currentPage === totalPages ? '#94a3b8' : '#fff', border: 'none', borderRadius: '0.5rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 600 }}
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Add New Question Entry</h2>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className={`btn ${qType === 'MCQ' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setQType('MCQ')}>MCQ</button>
                            <button className={`btn ${qType === 'Descriptive' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setQType('Descriptive')}>Descriptive</button>
                            <button className={`btn ${qType === 'Short Answer' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setQType('Short Answer')}>Short Answer</button>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Statement</label>
                        <textarea className="form-control" style={{ height: '100px', resize: 'none' }} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}></textarea>
                    </div>

                    {qType === 'MCQ' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <input type="text" className="form-control" placeholder="Option A" value={formData.options.a} onChange={e => setFormData({...formData, options: {...formData.options, a: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option B" value={formData.options.b} onChange={e => setFormData({...formData, options: {...formData.options, b: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option C" value={formData.options.c} onChange={e => setFormData({...formData, options: {...formData.options, c: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option D" value={formData.options.d} onChange={e => setFormData({...formData, options: {...formData.options, d: e.target.value}})}/>
                            </div>
                        </div>
                    )}

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Assigned Unit</label>
                            <select className="form-control" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                                <option>OS Basics</option>
                                <option>Process Management</option>
                                <option>Memory Management</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Weightage (Marks)</label>
                            <input type="number" className="form-control" value={formData.marks} onChange={e => setFormData({...formData, marks: parseInt(e.target.value)})} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="btn btn-sub" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={saveQuestion}>Save to Bank</button>
                    </div>
                </div>
            </div>
        )}

        {isEditModalOpen && selectedQuestion && (
            <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Edit Question</h2>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className={`btn ${editFormData.type === 'MCQ' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setEditFormData({...editFormData, type: 'MCQ'})}>MCQ</button>
                            <button className={`btn ${editFormData.type === 'Descriptive' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setEditFormData({...editFormData, type: 'Descriptive'})}>Descriptive</button>
                            <button className={`btn ${editFormData.type === 'Short Answer' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setEditFormData({...editFormData, type: 'Short Answer'})}>Short Answer</button>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Statement</label>
                        <textarea className="form-control" style={{ height: '100px', resize: 'none' }} value={editFormData.text} onChange={e => setEditFormData({...editFormData, text: e.target.value})}></textarea>
                    </div>

                    {editFormData.type === 'MCQ' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <input type="text" className="form-control" placeholder="Option A" value={editFormData.options.a} onChange={e => setEditFormData({...editFormData, options: {...editFormData.options, a: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option B" value={editFormData.options.b} onChange={e => setEditFormData({...editFormData, options: {...editFormData.options, b: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option C" value={editFormData.options.c} onChange={e => setEditFormData({...editFormData, options: {...editFormData.options, c: e.target.value}})}/>
                                <input type="text" className="form-control" placeholder="Option D" value={editFormData.options.d} onChange={e => setEditFormData({...editFormData, options: {...editFormData.options, d: e.target.value}})}/>
                            </div>
                        </div>
                    )}

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Assigned Unit</label>
                            <select className="form-control" value={editFormData.unit} onChange={e => setEditFormData({...editFormData, unit: e.target.value})}>
                                <option>OS Basics</option>
                                <option>Process Management</option>
                                <option>Memory Management</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Weightage (Marks)</label>
                            <input type="number" className="form-control" value={editFormData.marks} onChange={e => setEditFormData({...editFormData, marks: parseInt(e.target.value)})} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="btn btn-sub" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={saveEditQuestion}>Update Question</button>
                    </div>
                </div>
            </div>
        )}

        {isPreviewModalOpen && selectedQuestion && (
            <div className="modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Question Preview</h2>
                        <button onClick={() => setIsPreviewModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span className={`badge ${selectedQuestion.type === 'MCQ' ? 'badge-warning' : selectedQuestion.type === 'Descriptive' ? 'badge-success' : 'badge-danger'}`}>
                                {selectedQuestion.type}
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: '#e0e7ff', color: '#3730a3', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                {selectedQuestion.unit}
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                {selectedQuestion.marks} Marks
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: '#f3e8ff', color: '#6b21a8', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                Year: {selectedQuestion.year}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>Question Statement</label>
                        <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem', lineHeight: '1.6', color: '#1e293b' }}>
                            {selectedQuestion.text}
                        </div>
                    </div>

                    {selectedQuestion.type === 'MCQ' && selectedQuestion.options && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#64748b' }}>Options</label>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {Object.entries(selectedQuestion.options).map(([key, value]) => (
                                    value && (
                                        <div key={key} style={{ padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' }}>{key}.</span>
                                            <span style={{ color: '#475569' }}>{value}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => setIsPreviewModalOpen(false)}>Close Preview</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

export default QuestionBank;
