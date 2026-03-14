import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function Generator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const previewRef = useRef(null);
  const [formData, setFormData] = useState({
    subject: 'CS101 - Operating Systems',
    term: 'Mid-Term',
    units: [],
    questionsPerUnit: 5
  });

  const sampleQuestions = {
    mcq: [
      { q: 'What is an Operating System?', options: ['Hardware', 'Software managing system resources', 'Programming Language', 'Compiler'] },
      { q: 'What is Deadlock?', options: ['Process waiting indefinitely', 'CPU scheduling', 'Memory allocation', 'File system error'] },
      { q: 'Which scheduling algorithm is non-preemptive?', options: ['Round Robin', 'FCFS', 'Priority', 'Multilevel Queue'] },
      { q: 'What is Virtual Memory?', options: ['RAM only', 'Disk storage technique', 'Cache memory', 'ROM'] },
      { q: 'What is a Process Control Block?', options: ['Hardware component', 'Data structure storing process info', 'Memory block', 'CPU register'] },
      { q: 'What is Thrashing?', options: ['Excessive paging activity', 'CPU overload', 'Disk failure', 'Network congestion'] },
      { q: 'What is a Semaphore?', options: ['Synchronization tool', 'Memory unit', 'CPU instruction', 'File type'] },
      { q: 'What is Paging?', options: ['Memory management scheme', 'CPU scheduling', 'File organization', 'I/O operation'] },
      { q: 'What is Context Switching?', options: ['Switching between processes', 'Memory swap', 'Disk operation', 'Network switch'] },
      { q: 'What is RAID?', options: ['Redundant Array of Independent Disks', 'RAM type', 'CPU architecture', 'Network protocol'] }
    ],
    short: [
      'Define Process Scheduling.',
      'Explain the concept of Virtual Memory.',
      'What is the difference between Process and Thread?',
      'Define Critical Section Problem.',
      'Explain Page Replacement Algorithm.'
    ],
    descriptive: [
      'Explain the concept of Paging in Operating Systems with a suitable diagram.',
      'Describe the different CPU scheduling algorithms with examples.',
      'Explain Deadlock prevention and avoidance techniques in detail.'
    ]
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📋' },
    { number: 2, title: 'Unit Selection', icon: '📚' },
    { number: 3, title: 'Logic & Review', icon: '✓' }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !formData.subject) {
      alert('Please select a subject');
      return;
    }
    if (currentStep === 2 && formData.units.length === 0) {
      alert('Please select at least one unit');
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
    setIsGenerating(true);
    setTimeout(() => {
      setShowPreview(true);
      setIsGenerating(false);
      setPreviewGenerated(true);
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1500);
  };

  const exportToPDF = () => {
    const element = previewRef.current;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `paper_${formData.subject.split(' ')[0].toLowerCase()}_${formData.term.toLowerCase().replace('-', '')}_2026.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="screen active" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Paper Generation Wizard</h1>
            <div style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
              🎯 Target Year: 2026
            </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: '#e2e8f0', zIndex: 0 }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #4f46e5)', width: `${((currentStep - 1) / 2) * 100}%`, transition: 'width 0.4s ease' }}></div>
                </div>
                
                {steps.map((step) => (
                  <div key={step.number} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div 
                      onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        background: step.number <= currentStep ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e2e8f0', 
                        color: step.number <= currentStep ? '#fff' : '#94a3b8', 
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
                        border: step.number === currentStep ? '3px solid #fff' : 'none',
                        outline: step.number === currentStep ? '2px solid #6366f1' : 'none'
                      }}
                    >
                      {step.number < currentStep ? '✓' : step.number}
                    </div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: step.number <= currentStep ? '#6366f1' : '#94a3b8', letterSpacing: '0.05em', transition: 'color 0.3s ease' }}>
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
                  <select 
                    className="form-control" 
                    style={{ background: '#f8fafc', padding: '0.75rem', fontSize: '0.9rem' }}
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>CS101 - Operating Systems</option>
                    <option>CS202 - Database Management</option>
                    <option>CS303 - Computer Networks</option>
                    <option>CS404 - Software Engineering</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Examination Term *</label>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>📚 Unit Selection</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#475569' }}>Select Units to Include *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {['OS Basics', 'Process Management', 'Memory Management', 'File Systems', 'I/O Management', 'Security'].map(unit => (
                    <div 
                      key={unit}
                      onClick={() => toggleUnit(unit)}
                      style={{ 
                        padding: '1rem', 
                        background: formData.units.includes(unit) ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f8fafc', 
                        color: formData.units.includes(unit) ? '#fff' : '#475569',
                        border: formData.units.includes(unit) ? '2px solid #6366f1' : '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        boxShadow: formData.units.includes(unit) ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                      }}
                    >
                      {formData.units.includes(unit) && '✓ '}{unit}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Questions per Unit</label>
                <input 
                  type="number" 
                  className="form-control" 
                  style={{ maxWidth: '200px', padding: '0.75rem' }}
                  value={formData.questionsPerUnit}
                  onChange={(e) => setFormData({...formData, questionsPerUnit: parseInt(e.target.value)})}
                  min="1"
                  max="20"
                />
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', border: '1px solid #fde047', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <span><strong>{formData.units.length}</strong> units selected • <strong>{formData.units.length * formData.questionsPerUnit}</strong> total questions will be generated</span>
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="card" style={{ animation: 'fadeSlideIn 0.4s ease', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>✓ Logic & Review</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#475569' }}>Generation Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.75rem', border: '1px solid #bae6fd' }}>
                    <p style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.25rem' }}>SUBJECT</p>
                    <p style={{ fontSize: '0.9rem', color: '#0c4a6e', fontWeight: 700 }}>{formData.subject}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
                    <p style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginBottom: '0.25rem' }}>TERM</p>
                    <p style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700 }}>{formData.term}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.75rem', border: '1px solid #fde047' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a16207', fontWeight: 600, marginBottom: '0.25rem' }}>UNITS</p>
                    <p style={{ fontSize: '0.9rem', color: '#854d0e', fontWeight: 700 }}>{formData.units.length} Selected</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#fae8ff', borderRadius: '0.75rem', border: '1px solid #f0abfc' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a21caf', fontWeight: 600, marginBottom: '0.25rem' }}>QUESTIONS</p>
                    <p style={{ fontSize: '0.9rem', color: '#86198f', fontWeight: 700 }}>{formData.units.length * formData.questionsPerUnit} Total</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#475569' }}>Constraint Engine Logic</h4>
                <div style={{ background: '#fef2f2', border: '2px solid #fecaca', padding: '1.25rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Strict Exclusion Applied</p>
                      <p style={{ fontSize: '0.85rem', color: '#b91c1c', lineHeight: '1.6' }}>
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
                disabled={isGenerating}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
              >
                {isGenerating ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Generating...
                  </>
                ) : (
                  <>🔍 Preview Generation Layout</>
                )}
              </button>
            )}
          </div>
        </div>

        {showPreview && (
            <div style={{ marginTop: '2rem', animation: 'fadeSlideIn 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>📄 Paper Preview</h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                            className="btn btn-sub"
                            onClick={() => setShowPreview(false)}
                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                        >
                            ✕ Close Preview
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={exportToPDF}
                            disabled={!previewGenerated}
                            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', background: previewGenerated ? 'linear-gradient(135deg, #10b981, #059669)' : '#94a3b8', cursor: previewGenerated ? 'pointer' : 'not-allowed' }}
                        >
                            📥 Export PDF
                        </button>
                    </div>
                </div>

                {previewGenerated && (
                    <div style={{ padding: '1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>✅</span>
                            <span><strong>Preview Generated Successfully!</strong> You can now export this paper as a PDF.</span>
                        </p>
                    </div>
                )}

                <div 
                    ref={previewRef}
                    style={{ 
                        background: '#fff', 
                        border: '1px solid #d1d5db', 
                        padding: '3rem 2.5rem', 
                        maxWidth: '210mm',
                        minHeight: '297mm',
                        margin: '0 auto', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                        fontFamily: '"Times New Roman", serif',
                        borderRadius: '0.5rem'
                    }}
                >
                    <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.6rem', fontFamily: '"Times New Roman", serif', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>UNIVERSITY OF TECHNOLOGY</h3>
                        <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 'bold', letterSpacing: '0.03em' }}>FACULTY OF COMPUTER APPLICATIONS</p>
                        <p style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>{formData.term.toUpperCase()} EXAMINATION : 2026</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                        <span>Subject: {formData.subject}</span>
                        <span>Total Marks: 70</span>
                    </div>

                    <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Instructions:</p>
                        <ul style={{ fontSize: '0.85rem', marginLeft: '1.5rem', lineHeight: '1.6' }}>
                            <li>Answer all questions.</li>
                            <li>Write clearly and legibly.</li>
                            <li>All questions carry equal marks unless specified.</li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                            SECTION A: MULTIPLE CHOICE QUESTIONS (1 × 10 = 10 Marks)
                        </p>
                        {sampleQuestions.mcq.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Q{idx + 1}. {item.q}</p>
                                <div style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                                    {item.options.map((opt, i) => (
                                        <p key={i} style={{ margin: '0.25rem 0' }}>({String.fromCharCode(65 + i)}) {opt}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                            SECTION B: SHORT ANSWER QUESTIONS (4 × 5 = 20 Marks)
                        </p>
                        {sampleQuestions.short.map((q, idx) => (
                            <p key={idx} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                Q{idx + 11}. {q}
                            </p>
                        ))}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                            SECTION C: DESCRIPTIVE QUESTIONS (10 × 3 = 30 Marks)
                        </p>
                        {sampleQuestions.descriptive.map((q, idx) => (
                            <p key={idx} style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                                Q{idx + 16}. {q}
                            </p>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', fontStyle: 'italic', borderTop: '2px solid #000', paddingTop: '1.5rem', marginTop: '4rem', fontSize: '0.9rem' }}>
                        *** End of Question Paper ***
                    </p>
                </div>
            </div>
        )}
    </div>
  );
}

export default Generator;
