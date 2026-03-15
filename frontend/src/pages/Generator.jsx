import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axiosInstance from '../api/axiosInstance';
import QuestionPaperPDF from '../components/QuestionPaperPDF';
import SkeletonLoader from '../components/ui/Skeleton';

function Generator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    term: 'Mid-Term',
    units: [],
    totalMarks: 70
  });

  // Fetch subjects for the dropdown
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await axiosInstance.get('/subjects');
      return response.data.data.subjects;
    }
  });

  const mutation = useMutation({
    mutationFn: async (config) => {
      const response = await axiosInstance.post('/generator/generate', config);
      return response.data.data;
    },
    onSuccess: (data) => {
      setGeneratedPaper(data);
      setShowPreview(true);
      toast.success('Question paper generated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Generation failed');
    }
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📋' },
    { number: 2, title: 'Unit Selection', icon: '📚' },
    { number: 3, title: 'Logic & Review', icon: '✓' }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !formData.subjectId) {
      toast.error('Please select a subject');
      return;
    }
    if (currentStep === 2 && formData.units.length === 0) {
      toast.error('Please select at least one unit');
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleUnit = (unit) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.includes(unit) 
        ? prev.units.filter(u => u !== unit)
        : [...prev.units, unit]
    }));
  };

  const generatePreview = () => {
    mutation.mutate({
      subjectId: formData.subjectId,
      totalMarks: formData.totalMarks,
      units: formData.units
    });
  };

  return (
    <div className="screen active" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Paper Generation Wizard</h1>
            <div style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
              🎯 Target Year: 2026
            </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: 'var(--border)', zIndex: 0 }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #4f46e5)', width: `${((currentStep - 1) / 2) * 100}%`, transition: 'width 0.4s ease' }}></div>
                </div>
                
                {steps.map((step) => (
                  <div key={step.number} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div 
                      onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        background: step.number <= currentStep ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--border)', 
                        color: step.number <= currentStep ? '#fff' : 'var(--text-sub)', 
                        borderRadius: '50%', 
                        margin: '0 auto 0.75rem auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: step.number <= currentStep ? 'pointer' : 'default',
                        boxShadow: step.number === currentStep ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                        transition: 'all 0.3s ease',
                        border: step.number === currentStep ? '3px solid var(--bg-card)' : 'none',
                        outline: step.number === currentStep ? '2px solid var(--primary)' : 'none'
                      }}
                    >
                      {step.number < currentStep ? '✓' : step.number}
                    </div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: step.number <= currentStep ? 'var(--primary)' : 'var(--text-sub)', letterSpacing: '0.05em', transition: 'color 0.3s ease' }}>
                      {step.title.toUpperCase()}
                    </p>
                  </div>
                ))}
            </div>
        </div>

        <div style={{ minHeight: '400px' }}>
          {currentStep === 1 && (
            <div className="card" style={{ animation: 'fadeSlideIn 0.4s ease', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>📋 Basic Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Select Subject *</label>
                  {isLoadingSubjects ? (
                    <SkeletonLoader height={40} />
                  ) : (
                    <select 
                      className="form-control" 
                      style={{ background: 'var(--bg-input)', padding: '0.75rem', fontSize: '0.9rem' }}
                      value={formData.subjectId}
                      onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    >
                      <option value="">Select a subject</option>
                      {subjectsData?.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.code} - {sub.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-sub)' }}>Examination Term *</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className={`btn ${formData.term === 'Mid-Term' ? 'btn-primary' : 'btn-sub'}`} 
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                      onClick={() => setFormData({...formData, term: 'Mid-Term'})}
                    >
                      Mid-Term
                    </button>
                    <button 
                      className={`btn ${formData.term === 'Final-Term' ? 'btn-primary' : 'btn-sub'}`} 
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                      onClick={() => setFormData({...formData, term: 'Final-Term'})}
                    >
                      Final-Term
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                  <span style={{ fontSize: '1.25rem' }}>💡</span>
                  <div>
                    <p style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Quick Tip</p>
                    <p style={{ fontSize: '0.8rem', color: '#075985', lineHeight: '1.5' }}>
                      Select the subject and term carefully. This will determine the question pool and paper format.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="card" style={{ animation: 'fadeSlideIn 0.4s ease', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>📚 Unit Selection</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-sub)' }}>Select Units to Include *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                  {['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'].map(unit => (
                    <div 
                      key={unit}
                      onClick={() => toggleUnit(unit.split(' ')[1])}
                      style={{ 
                        padding: '1rem', 
                        background: formData.units.includes(unit.split(' ')[1]) ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--bg-body)', 
                        color: formData.units.includes(unit.split(' ')[1]) ? '#fff' : 'var(--text-sub)',
                        border: formData.units.includes(unit.split(' ')[1]) ? '2px solid var(--primary)' : '2px solid var(--border)',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        boxShadow: formData.units.includes(unit.split(' ')[1]) ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                      }}
                    >
                      {formData.units.includes(unit.split(' ')[1]) && '✓ '}{unit}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-sub)' }}>Total Marks</label>
                <input 
                  type="number" 
                  className="form-control" 
                  style={{ maxWidth: '200px', padding: '0.75rem' }}
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                  min="10"
                  max="100"
                />
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', border: '1px solid #fde047', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <span><strong>{formData.units.length}</strong> units selected • Target <strong>{formData.totalMarks}</strong> marks</span>
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
           <div className="card" style={{ animation: 'fadeSlideIn 0.4s ease', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>✓ Logic & Review</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-sub)' }}>Generation Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>SUBJECT</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {subjectsData?.find(s => s._id === formData.subjectId)?.name || 'Not Selected'}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>TERM</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{formData.term}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.25rem' }}>UNITS</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{formData.units.length} Selected</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '0.25rem' }}>QUESTIONS</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>{formData.totalMarks} Marks</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-sub)' }}>Constraint Engine Logic</h4>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #fca5a5', padding: '1.25rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Strict Exclusion Applied</p>
                      <p style={{ fontSize: '0.85rem', color: '#f87171', lineHeight: '1.6' }}>
                        Questions appearing in <strong>Academic Year 2025</strong> are auto-blocked for this generation cycle to maintain set uniqueness and prevent repetition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {currentStep > 1 && (
              <button 
                className="btn btn-sub" 
                onClick={handleBack}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                ← Back
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentStep === 3 && (
              <button 
                className="btn btn-sub" 
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                💾 Save Draft
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                className="btn btn-primary" 
                onClick={handleNext}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
              >
                Next →
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={generatePreview}
                disabled={mutation.isPending}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', background: mutation.isPending ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', cursor: mutation.isPending ? 'not-allowed' : 'pointer' }}
              >
                {mutation.isPending ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Generating...
                  </>
                ) : (
                  <>🔍 Generate Paper</>
                )}
              </button>
            )}
          </div>
        </div>

        {generatedPaper && (
            <div style={{ marginTop: '2rem', animation: 'fadeSlideIn 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>📄 Paper Preview</h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            className="btn btn-sub"
                            onClick={() => setGeneratedPaper(null)} // Close button now clears generatedPaper
                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                          >
                            ✕ Close
                          </button>
                          
                          <PDFDownloadLink
                            document={
                              <QuestionPaperPDF 
                                data={generatedPaper} 
                                subject={subjectsData?.find(s => s._id === formData.subjectId)?.name} 
                                term={formData.term} 
                              />
                            }
                            fileName={`paper_${formData.term.toLowerCase()}.pdf`}
                          >
                            {({ loading }) => (
                              <button 
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                              >
                                {loading ? 'Preparing PDF...' : '📥 Export PDF'}
                              </button>
                            )}
                          </PDFDownloadLink>
                    </div>
                </div>

                {generatedPaper && ( // Use generatedPaper for this message
                    <div style={{ padding: '1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>✅</span>
                            <span><strong>Preview Generated Successfully!</strong> You can now export this paper as a PDF.</span>
                        </p>
                    </div>
                )}

                {generatedPaper && ( // Use generatedPaper for PDFViewer visibility
                    <div 
                        style={{ 
                            background: '#fff', 
                            border: '1px solid var(--border)', 
                            padding: '1rem',
                            height: '600px',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
                           <QuestionPaperPDF 
                              data={generatedPaper} 
                              subject={subjectsData?.find(s => s._id === formData.subjectId)?.name} 
                              term={formData.term} 
                            />
                        </PDFViewer>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}

export default Generator;
