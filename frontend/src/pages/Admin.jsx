import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/faculty');
        setFaculty(res.data);
    } catch (err) {
        console.error('Error fetching faculty', err);
    }
  };

  const handleApproval = async (id, newStatus) => {
    try {
        await axios.put(`http://localhost:5000/api/faculty/${id}/status`, { status: newStatus });
        fetchFaculty(); // refresh
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="screen active">
        <h1>Faculty Access Management</h1>
        <div className="card" style={{ marginTop: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '1rem' }}>FACULTY NAME</th>
                        <th style={{ padding: '1rem' }}>DEPARTMENT</th>
                        <th style={{ padding: '1rem' }}>STATUS</th>
                        <th style={{ padding: '1rem' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {faculty.map(f => (
                        <tr key={f._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem' }}>{f.name}</td>
                            <td style={{ padding: '1rem' }}>{f.department}</td>
                            <td style={{ padding: '1rem' }}>
                                <span className={`badge ${f.status === 'Active' ? 'badge-success' : f.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                                    {f.status}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {f.status === 'Pending' ? (
                                    <button style={{ border: 'none', background: 'none', color: 'var(--success)', cursor: 'pointer', fontWeight: 700 }} onClick={() => handleApproval(f._id, 'Active')}>Approve</button>
                                ) : f.status === 'Active' ? (
                                    <button style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => handleApproval(f._id, 'Revoked')}>Revoke</button>
                                ) : (
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Revoked</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {faculty.length === 0 && (
                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No faculty records found. (Need to run DB seed script)</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default Admin;
