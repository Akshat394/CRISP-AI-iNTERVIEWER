import React, { useState } from 'react';
import { Layout, Typography, Table, Button, Space, Card, Modal, Tag, Input, Statistic, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, LogoutOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signOut } from '../store/authSlice';
import { CandidateProfile, InterviewSession } from '../types';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const IntervieweePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { user } = useAppSelector((state) => state.auth);
  const { profiles } = useAppSelector((state) => state.candidates);
  
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to sign out');
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchText.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return 'score-badge';
    if (score >= 80) return 'score-badge score-excellent';
    if (score >= 60) return 'score-badge score-good';
    if (score >= 40) return 'score-badge score-average';
    return 'score-badge score-poor';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CandidateProfile, b: CandidateProfile) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Sessions',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      sorter: (a: CandidateProfile, b: CandidateProfile) => a.totalSessions - b.totalSessions,
      render: (sessions: number) => (
        <Tag color="blue">{sessions}</Tag>
      ),
    },
    {
      title: 'Average Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      sorter: (a: CandidateProfile, b: CandidateProfile) => (a.averageScore || 0) - (b.averageScore || 0),
      render: (score?: number) => (
        score ? (
          <span className={getScoreBadgeClass(score)}>
            {score.toFixed(1)}/100
          </span>
        ) : '-'
      ),
    },
    {
      title: 'Last Interview',
      dataIndex: 'lastInterviewDate',
      key: 'lastInterviewDate',
      sorter: (a: CandidateProfile, b: CandidateProfile) => (a.lastInterviewDate || 0) - (b.lastInterviewDate || 0),
      render: (date?: number) => (
        date ? dayjs(date).format('MMM DD, YYYY') : '-'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CandidateProfile) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => setSelectedCandidate(record)}
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  const sessionColumns = [
    {
      title: 'Date',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date: number, record: InterviewSession) => 
        dayjs(date || record.createdAt).format('MMM DD, YYYY HH:mm'),
    },
    {
      title: 'Score',
      dataIndex: 'totalScore',
      key: 'totalScore',
      render: (score?: number) => (
        score ? (
          <span className={getScoreBadgeClass(score)}>
            {score}/100
          </span>
        ) : 'Incomplete'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      render: (completed: boolean) => (
        <Tag color={completed ? 'green' : 'orange'}>
          {completed ? 'Completed' : 'Incomplete'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InterviewSession) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => setSelectedSession(record)}
          size="small"
        >
          View Session
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'white', 
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Crisp AI - Interviewer Dashboard
        </Title>
        
        <Space>
          <Button icon={<UserOutlined />} onClick={() => navigate('/interviewee')}>
            Candidate View
          </Button>
          <Button icon={<LogoutOutlined />} onClick={handleSignOut}>
            Sign Out
          </Button>
        </Space>
      </Header>

      <Content className="main-content">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Enhanced Page Header */}
          <div className="page-header">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <TrophyOutlined style={{ fontSize: '3rem', color: '#667eea', marginRight: 'var(--spacing-md)' }} />
                <Title className="page-title" level={1} style={{ margin: 0 }}>
                  Interviewer Dashboard
                </Title>
              </Space>
              <Text className="page-subtitle" style={{ 
                fontSize: 'var(--font-size-xl)', 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                Review candidate interviews, performance metrics, and detailed analytics
              </Text>
            </Space>
          </div>

          {/* Enhanced Statistics */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <Statistic
                  title={<span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total Candidates</span>}
                  value={profiles.length}
                  prefix={<UserOutlined style={{ fontSize: '1.5rem', color: '#667eea' }} />}
                  valueStyle={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <Statistic
                  title={<span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total Interviews</span>}
                  value={profiles.reduce((sum, profile) => sum + profile.totalSessions, 0)}
                  prefix={<TrophyOutlined style={{ fontSize: '1.5rem', color: '#52c41a' }} />}
                  valueStyle={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <Statistic
                  title={<span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Average Score</span>}
                  value={profiles.length > 0 ? 
                    (profiles.reduce((sum, profile) => sum + (profile.averageScore || 0), 0) / profiles.length).toFixed(1) : 0
                  }
                  suffix="/100"
                  valueStyle={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <Statistic
                  title={<span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Completed</span>}
                  value={profiles.reduce((sum, profile) => 
                    sum + profile.sessions.filter(s => s.isCompleted).length, 0
                  )}
                  valueStyle={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Enhanced Search and Table */}
          <Card className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <Title level={3} style={{ 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  📊 Candidate Management
                </Title>
                <Text style={{ 
                  fontSize: 'var(--font-size-lg)', 
                  color: 'var(--text-secondary)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Search and review candidate performance data
                </Text>
              </div>
              <Search
                placeholder="Search candidates by name or email..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ 
                  fontSize: '1.1rem',
                  height: '56px'
                }}
              />
              
              <div className="candidate-table">
                <Table
                  columns={columns}
                  dataSource={filteredProfiles}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} of ${total} candidates`,
                  }}
                  scroll={{ x: 800 }}
                />
              </div>
            </Space>
          </Card>
        </Space>
      </Content>

      {/* Candidate Details Modal */}
      <Modal
        title={`Candidate Details - ${selectedCandidate?.name}`}
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Name"
                    value={selectedCandidate.name}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Email"
                    value={selectedCandidate.email}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Total Sessions"
                    value={selectedCandidate.totalSessions}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Average Score"
                    value={selectedCandidate.averageScore?.toFixed(1) || 0}
                    suffix="/100"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Last Interview"
                    value={selectedCandidate.lastInterviewDate ? 
                      dayjs(selectedCandidate.lastInterviewDate).format('MMM DD') : '-'
                    }
                  />
                </Card>
              </Col>
            </Row>

            <Title level={4}>Interview Sessions</Title>
            <Table
              columns={sessionColumns}
              dataSource={selectedCandidate.sessions}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Space>
        )}
      </Modal>

      {/* Session Details Modal */}
      <Modal
        title="Interview Session Details"
        open={!!selectedSession}
        onCancel={() => setSelectedSession(null)}
        footer={null}
        width={1000}
      >
        {selectedSession && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Total Score"
                    value={selectedSession.totalScore || 0}
                    suffix="/100"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Questions Answered"
                    value={`${selectedSession.answers.length}/${selectedSession.questions.length}`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Status"
                    value={selectedSession.isCompleted ? 'Completed' : 'Incomplete'}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Duration"
                    value={selectedSession.completedAt ? 
                      `${Math.round((selectedSession.completedAt - selectedSession.createdAt) / 60000)} min` : '-'
                    }
                  />
                </Card>
              </Col>
            </Row>

            {selectedSession.summary && (
              <Card size="small">
                <Title level={5}>Summary</Title>
                <Text>{selectedSession.summary}</Text>
              </Card>
            )}

            <Title level={5}>Questions & Answers</Title>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {selectedSession.questions.map((question, index) => {
                const answer = selectedSession.answers[index];
                return (
                  <Card key={question.id} size="small">
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <div>
                        <Text strong>Question {index + 1}:</Text>
                        <Tag color={
                          question.difficulty === 'easy' ? 'green' :
                          question.difficulty === 'medium' ? 'orange' : 'red'
                        } style={{ marginLeft: 8 }}>
                          {question.difficulty.toUpperCase()}
                        </Tag>
                      </div>
                      <Text>{question.text}</Text>
                      
                      {answer && (
                        <>
                          <div>
                            <Text strong>Answer:</Text>
                            {answer.score && (
                              <Tag color="blue" style={{ marginLeft: 8 }}>
                                Score: {answer.score}/10
                              </Tag>
                            )}
                          </div>
                          <Text>{answer.text}</Text>
                          {answer.feedback && (
                            <>
                              <div>
                                <Text strong>Feedback:</Text>
                              </div>
                              <Text type="secondary">{answer.feedback}</Text>
                            </>
                          )}
                        </>
                      )}
                    </Space>
                  </Card>
                );
              })}
            </Space>
          </Space>
        )}
      </Modal>
    </Layout>
  );
};

export default IntervieweePage;
