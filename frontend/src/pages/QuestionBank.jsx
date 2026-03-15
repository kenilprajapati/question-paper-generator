import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import SkeletonLoader from '../components/ui/Skeleton';

function QuestionBank() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const [formData, setFormData] = useState({
    text: '', unit: '1', marks: 2, type: 'MCQ', subjectId: '', options: { a: '', b: '', c: '', d: '' }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('All Units');
  const [filterType, setFilterType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Questions
  const { data: questionsResponse, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', searchTerm, filterUnit, filterType],
    queryFn: async () => {
      let url = '/questions?';
      if (searchTerm) url += `text[regex]=${searchTerm}&text[options]=i&`;
      if (filterUnit !== 'All Units') url += `unit=${filterUnit}&`;
      if (filterType !== 'All Types') url += `type=${filterType}&`;
      
      const response = await axiosInstance.get(url);
      return response.data.data.questions;
    }
  });

  // Fetch Subjects for Modal
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await axiosInstance.get('/subjects');
      return response.data.data.subjects;
    }
  });

  // Create Question Mutation
  const createMutation = useMutation({
    mutationFn: (newQuestion) => axiosInstance.post('/questions', newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
      setIsModalOpen(false);
      toast.success('Question added to bank');
      setFormData({ text: '', unit: '1', marks: 2, type: 'MCQ', subjectId: '', options: { a: '', b: '', c: '', d: '' } });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add question')
  });

  // Update Question Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => axiosInstance.patch(`/questions/${data.id}`, data.update),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
      setIsEditModalOpen(false);
      toast.success('Question updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update question')
  });

  // Delete Question Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
      toast.success('Question deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete')
  });

  const handleCreate = () => {
    if (!formData.text || !formData.subjectId) return toast.error('Please fill all required fields');
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!selectedQuestion) return;
    updateMutation.mutate({
      id: selectedQuestion._id,
      update: formData
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (q) => {
    setSelectedQuestion(q);
    setFormData({
      text: q.text,
      unit: q.unit,
      marks: q.marks,
      type: q.type,
      subjectId: q.subject?._id || q.subject || '',
      options: q.options || { a: '', b: '', c: '', d: '' }
    });
    setIsEditModalOpen(true);
  };

  const openPreviewModal = (q) => {
    setSelectedQuestion(q);
    setIsPreviewModalOpen(true);
  };

  const questions = questionsResponse || [];
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const currentQuestions = questions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="screen active" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Question Repository</h1>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Insert Question
            </button>
        </div>

        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
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
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <select className="btn-sub" style={{ fontWeight: 400, padding: '0.65rem' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option>All Types</option>
              <option>MCQ</option>
              <option>Short Answer</option>
              <option>Descriptive</option>
            </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead style={{ background: 'var(--bg-body)', borderBottom: '2px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>QUESTION CONTENT</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>UNIT</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>TYPE</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>MARKS</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>YEAR</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-sub)' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoadingQuestions ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="6" style={{ padding: '1rem' }}><SkeletonLoader height={30} /></td>
                        </tr>
                      ))
                    ) : currentQuestions.length > 0 ? (
                      currentQuestions.map((q, idx) => (
                        <tr key={q._id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem', color: 'var(--text-main)', maxWidth: '400px' }}>{q.text}</td>
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-sub)' }}>Unit {q.unit}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span className={`badge ${q.type === 'MCQ' ? 'badge-warning' : q.type === 'Descriptive' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                                {q.type}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary)' }}>{String(q.marks).padStart(2, '0')}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-sub)', textAlign: 'center', fontSize: '0.85rem' }}>{q.year || '2026'}</td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button onClick={() => openEditModal(q)} className="btn-icon">✏️</button>
                                <button onClick={() => handleDelete(q._id)} className="btn-icon danger">🗑️</button>
                                <button onClick={() => openPreviewModal(q)} className="btn-icon info">👁️</button>
                              </div>
                            </td>
                        </tr>
                      ))
                    ) : (
                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-sub)' }}>No questions found.</td></tr>
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
            <span style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--text-sub)' }}>Page {currentPage} of {totalPages}</span>
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
                        <label>Subject *</label>
                        <select className="form-control" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                            <option value="">Select Subject</option>
                            {subjectsData?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className={`btn ${formData.type === 'MCQ' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'MCQ'})}>MCQ</button>
                            <button className={`btn ${formData.type === 'Descriptive' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'Descriptive'})}>Descriptive</button>
                            <button className={`btn ${formData.type === 'Short Answer' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'Short Answer'})}>Short</button>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Statement</label>
                        <textarea className="form-control" style={{ height: '100px', resize: 'none' }} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}></textarea>
                    </div>

                    {formData.type === 'MCQ' && (
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
                                <option value="1">Unit 1</option>
                                <option value="2">Unit 2</option>
                                <option value="3">Unit 3</option>
                                <option value="4">Unit 4</option>
                                <option value="5">Unit 5</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Weightage (Marks)</label>
                            <input type="number" className="form-control" value={formData.marks} onChange={e => setFormData({...formData, marks: parseInt(e.target.value)})} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="btn btn-sub" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreate} disabled={createMutation.isPending}>
                          {createMutation.isPending ? 'Saving...' : 'Save to Bank'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {isEditModalOpen && selectedQuestion && (
            <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Edit Question</h2>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Subject *</label>
                        <select className="form-control" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                            <option value="">Select Subject</option>
                            {subjectsData?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className={`btn ${formData.type === 'MCQ' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'MCQ'})}>MCQ</button>
                            <button className={`btn ${formData.type === 'Descriptive' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'Descriptive'})}>Descriptive</button>
                            <button className={`btn ${formData.type === 'Short Answer' ? 'btn-primary' : 'btn-sub'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'Short Answer'})}>Short</button>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Question Statement</label>
                        <textarea className="form-control" style={{ height: '100px', resize: 'none' }} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}></textarea>
                    </div>

                    {formData.type === 'MCQ' && (
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
                                <option value="1">Unit 1</option>
                                <option value="2">Unit 2</option>
                                <option value="3">Unit 3</option>
                                <option value="4">Unit 4</option>
                                <option value="5">Unit 5</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Weightage (Marks)</label>
                            <input type="number" className="form-control" value={formData.marks} onChange={e => setFormData({...formData, marks: parseInt(e.target.value)})} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="btn btn-sub" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleUpdate} disabled={updateMutation.isPending}>
                          {updateMutation.isPending ? 'Updating...' : 'Update Question'}
                        </button>
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
                    
                    <div style={{ background: 'var(--bg-body)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span className={`badge ${selectedQuestion.type === 'MCQ' ? 'badge-warning' : selectedQuestion.type === 'Descriptive' ? 'badge-success' : 'badge-danger'}`}>
                                {selectedQuestion.type}
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                {selectedQuestion.unit}
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                {selectedQuestion.marks} Marks
                            </span>
                            <span style={{ padding: '0.3rem 0.75rem', background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                Year: {selectedQuestion.year}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-sub)' }}>Question Statement</label>
                        <div style={{ padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                            {selectedQuestion.text}
                        </div>
                    </div>

                    {selectedQuestion.type === 'MCQ' && selectedQuestion.options && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-sub)' }}>Options</label>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {Object.entries(selectedQuestion.options).map(([key, value]) => (
                                    value && (
                                        <div key={key} style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{key}.</span>
                                            <span style={{ color: 'var(--text-sub)' }}>{value}</span>
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
