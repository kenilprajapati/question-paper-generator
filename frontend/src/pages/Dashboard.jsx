import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatbot from '../components/AIChatbot';

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'QUESTIONS BANK',
      value: '4,281',
      subtitle: '+12% this month',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      color: '#6366f1'
    },
    {
      label: 'PAPERS CREATED',
      value: '156',
      subtitle: 'Total verified sets',
      trend: 'neutral',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      color: '#10b981'
    },
    {
      label: 'ACTIVE SUBJECTS',
      value: '24',
      subtitle: 'Across 4 branches',
      trend: 'neutral',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      color: '#f59e0b'
    },
  ];

  const chartData = [
    { label: 'MCQ', value: 120, color: '#6366f1', percentage: '45%' },
    { label: 'Descriptive', value: 80, color: '#8b5cf6', percentage: '30%' },
    { label: 'True/False', value: 40, color: '#ec4899', percentage: '25%' }
  ];

  const activities = [
    {
      user: 'John Smith',
      initials: 'JS',
      action: 'generated Mid-Term',
      details: 'Subject: OS Fundamentals',
      time: '2m ago',
      color: '#6366f1'
    },
    {
      user: 'Anna Miller',
      initials: 'AM',
      action: 'approved 15 new questions',
      details: 'Applied to Database Systems',
      time: '1h ago',
      color: '#10b981'
    },
    {
      user: 'Robert Chen',
      initials: 'RC',
      action: 'created new subject',
      details: 'Machine Learning Basics',
      time: '3h ago',
      color: '#f59e0b'
    },
    {
      user: 'Sarah Johnson',
      initials: 'SJ',
      action: 'updated question bank',
      details: 'Added 25 questions to Networks',
      time: '5h ago',
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '100%',
      width: '100%',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>
            Intelligence Center
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748b'
          }}>
            Overview of paper generation metrics
          </p>
        </div>
        
        {/* Generate Paper Button */}
        <button
          onClick={() => navigate('/app/generator')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Generate Paper
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              padding: '1.75rem',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.borderColor = stat.color;
              const overlay = e.currentTarget.querySelector('.card-overlay');
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              const overlay = e.currentTarget.querySelector('.card-overlay');
              if (overlay) overlay.style.opacity = '0';
            }}
          >
            {/* Gradient Overlay */}
            <div 
              className="card-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}03 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#64748b',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </p>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  transition: 'all 0.3s ease'
                }}>
                  {stat.icon}
                </div>
              </div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.5rem',
                lineHeight: '1'
              }}>
                {stat.value}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {stat.trend === 'up' && (
                  <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>↑</span>
                )}
                {stat.trend === 'down' && (
                  <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '600' }}>↓</span>
                )}
                <p style={{
                  fontSize: '0.875rem',
                  color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#64748b',
                  fontWeight: stat.trend !== 'neutral' ? '600' : '400'
                }}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Distribution Chart */}
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1.5rem'
          }}>
            Distribution by Type
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            paddingTop: '1rem'
          }}>
            {chartData.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                {/* Label */}
                <div style={{
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: item.color
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {item.label}
                  </span>
                </div>
                
                {/* Bar Container */}
                <div style={{
                  flex: 1,
                  height: '40px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Animated Bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${(item.value / 120) * 100}%`,
                      background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      borderRadius: '8px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '1rem',
                      position: 'relative',
                      boxShadow: `0 2px 8px ${item.color}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.85';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#fff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      {item.value}
                    </span>
                  </div>
                </div>
                
                {/* Percentage */}
                <div style={{
                  minWidth: '60px',
                  textAlign: 'right'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: item.color
                  }}>
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-around',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                TOTAL QUESTIONS
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                240
              </p>
            </div>
            <div style={{
              width: '1px',
              background: '#e2e8f0'
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                MOST USED
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#6366f1'
              }}>
                MCQ
              </p>
            </div>
          </div>
        </div>

        {/* Activity Stream */}
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1.5rem'
          }}>
            Activity Stream
          </h3>
          
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {activities.map((activity, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem 0'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `${activity.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: activity.color,
                    flexShrink: 0
                  }}>
                    {activity.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontWeight: '700' }}>{activity.user}</span> {activity.action}
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      marginBottom: '0.25rem'
                    }}>
                      {activity.details}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8'
                    }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <div style={{
                    height: '1px',
                    background: '#e2e8f0',
                    margin: '0.5rem 0'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}

export default Dashboard;
