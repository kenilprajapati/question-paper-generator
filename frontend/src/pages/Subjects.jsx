import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import SkeletonLoader from '../components/ui/Skeleton';

function Subjects() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', department: '', semester: 1
  });

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await axiosInstance.get('/subjects');
      return response.data.data.subjects;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newSubject) => axiosInstance.post('/subjects', newSubject),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      setIsModalOpen(false);
      toast.success('Subject added successfully');
      setFormData({ name: '', code: '', department: '', semester: 1 });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add subject')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.department) {
      return toast.error('Please fill all required fields');
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="screen active">
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div>
                <h1>Subject & Syllabus Mapping</h1>
                <p style={{ color: 'var(--text-sub)' }}>Configure subjects and their academic mapping</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}> + Add New Subject</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-body)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Active Subject List</h3>
                </div>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                          <SkeletonLoader height={24} />
                        </div>
                      ))
                    ) : subjects?.length > 0 ? (
                      subjects.map(sub => (
                        <div 
                          key={sub._id} 
                          onClick={() => setSelectedSubject(sub)}
                          style={{ 
                            padding: '1.25rem', 
                            borderBottom: '1px solid var(--border)', 
                            cursor: 'pointer',
                            background: selectedSubject?._id === sub._id ? 'var(--bg-body)' : 'transparent',
                            borderLeft: selectedSubject?._id === sub._id ? '4px solid var(--primary)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                            <div className="flex-between">
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.code} - {sub.name}</span>
                                <span className="badge badge-success">Sem {sub.semester}</span>
                            </div>
                            <small style={{ color: 'var(--text-sub)' }}>{sub.department}</small>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-sub)' }}>No subjects found.</div>
                    )}
                </div>
            </div>

            <div className="card">
                {selectedSubject ? (
                  <>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--text-main)' }}>Subject Details: {selectedSubject.name}</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="detail-row">
                          <label style={{ fontWeight: 600, color: 'var(--text-sub)', fontSize: '0.85rem' }}>COLLEGE CODE</label>
                          <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700 }}>{selectedSubject.code}</p>
                        </div>
                        <div className="detail-row">
                          <label style={{ fontWeight: 600, color: 'var(--text-sub)', fontSize: '0.85rem' }}>DEPARTMENT</label>
                          <p>{selectedSubject.department}</p>
                        </div>
                        <div className="detail-row">
                          <label style={{ fontWeight: 600, color: 'var(--text-sub)', fontSize: '0.85rem' }}>SEMESTER</label>
                          <p style={{ color: 'var(--text-main)' }}>{selectedSubject.semester}</p>
                        </div>
                    </div>
                  </>
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sub)', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '3rem' }}>📚</div>
                    <p>Select a subject from the list to view mapping</p>
                  </div>
                )}
            </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h2>Add New Subject</h2>
              <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Subject Name *</label>
                  <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Operating Systems" />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Subject Code *</label>
                  <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. CS101" />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Department *</label>
                  <input type="text" className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Computer Science" />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Semester *</label>
                  <input type="number" className="form-control" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} min="1" max="8" />
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn btn-sub" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Adding...' : 'Add Subject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

export default Subjects;
