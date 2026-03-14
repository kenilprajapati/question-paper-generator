import React, { useState } from 'react';

function Subjects() {
  return (
    <div className="screen active">
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div>
                <h1>Subject & Syllabus Mapping</h1>
                <p style={{ color: 'var(--text-sub)' }}>Configure subjects and their constituent pedagogical units</p>
            </div>
            <button className="btn btn-primary"> + Add New Subject</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Active Subject List</h3>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: '#eef2ff', borderLeft: '4px solid var(--primary)' }}>
                        <div className="flex-between">
                            <span style={{ fontWeight: 700 }}>CS101 - Operating Systems</span>
                            <span className="badge badge-success">05 Units</span>
                        </div>
                    </div>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <div className="flex-between">
                            <span style={{ fontWeight: 600 }}>CS202 - Database Systems</span>
                            <span className="badge badge-success">06 Units</span>
                        </div>
                    </div>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <div className="flex-between">
                            <span style={{ fontWeight: 600 }}>CS301 - Computer Networks</span>
                            <span className="badge badge-success">05 Units</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3>Units: Operating Systems</h3>
                    <button className="btn btn-sub" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add Unit</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>1</div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Introduction to Kernel & CLI</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>2</div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>CPU Scheduling Algorithms</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>3</div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Memory Management & Paging</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Subjects;
