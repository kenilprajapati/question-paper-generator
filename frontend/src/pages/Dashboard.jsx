import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import SkeletonLoader from '../components/ui/Skeleton';
import AIChatbot from '../components/AIChatbot';

function Dashboard() {
  const navigate = useNavigate();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/dashboard/stats');
      return response.data.data;
    }
  });

  const statsCards = [
    {
      label: 'QUESTIONS BANK',
      value: statsData?.totalQuestions || 0,
      subtitle: 'Total questions in repository',
      trend: 'neutral',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      color: '#6366f1'
    },
    {
      label: 'TOTAL FACULTY',
      value: statsData?.totalUsers || 0,
      subtitle: 'Verified user accounts',
      trend: 'neutral',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#10b981'
    },
    {
      label: 'ACTIVE SUBJECTS',
      value: statsData?.totalSubjects || 0,
      subtitle: 'Mapped modules',
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

  // Map difficulty stats to chart for now
  const chartData = statsData?.questionsByDifficulty?.map(item => ({
    label: item._id,
    value: item.count,
    color: item._id === 'Easy' ? '#10b981' : item._id === 'Medium' ? '#f59e0b' : '#ef4444',
    percentage: Math.round((item.count / (statsData.totalQuestions || 1)) * 100) + '%'
  })) || [];

  const activities = [
    {
      user: 'System Admin',
      initials: 'SA',
      action: 'connected to real-time engine',
      details: 'Analytics dashboard is now live',
      time: 'Just now',
      color: '#10b981'
    }
  ];

  return (
    <div style={{
      padding: window.innerWidth < 768 ? '1rem' : '2rem',
      maxWidth: '100%',
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg-body)'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: window.innerWidth < 768 ? 'stretch' : 'flex-start',
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        <div>
          <h1 style={{
            fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '0.5rem'
          }}>
            Intelligence Center
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-sub)'
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
            justifyContent: 'center',
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
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {isLoading ? (
          [...Array(3)].map((_, i) => <SkeletonLoader key={i} height={180} />)
        ) : statsCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'var(--bg-card)',
              padding: '1.75rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
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
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border)';
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
                  color: 'var(--text-sub)',
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
                fontSize: window.innerWidth < 768 ? '2rem' : '2.5rem',
                fontWeight: '700',
                color: 'var(--text-main)',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Distribution Chart */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-main)',
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
                    color: 'var(--text-main)'
                  }}>
                    {item.label}
                  </span>
                </div>
                
                {/* Bar Container */}
                <div style={{
                  flex: 1,
                  height: '40px',
                  background: 'var(--bg-body)',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--border)'
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
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-around',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-sub)',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                TOTAL QUESTIONS
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-main)'
              }}>
                {statsData?.totalQuestions || 0}
              </p>
            </div>
            <div style={{
              width: '1px',
              background: 'var(--border)'
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-sub)',
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
                {statsData?.questionsByDifficulty?.[0]?._id || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Stream */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-main)',
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
                      color: 'var(--text-main)',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontWeight: '700' }}>{activity.user}</span> {activity.action}
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-sub)',
                      marginBottom: '0.25rem'
                    }}>
                      {activity.details}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <div style={{
                    height: '1px',
                    background: 'var(--border)',
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
