import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
// import upvoteIcon from '../images/upvote.png';
// import downvoteIcon from '../images/downvote.png';
import down_2 from '../images/down_2.svg';
import up_2 from '../images/up_2.svg';
import '../css/MemeGallery.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [votingStates, setVotingStates] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const socketRef = useRef(null); 

  const fetchMemes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/memes/all`);
      setMemes(res.data);
    } catch (err) {
      console.error('Error fetching memes:', err);
    }
  };

  useEffect(() => {
    fetchMemes();

    socketRef.current = io(`${API_URL}`);

    socketRef.current.on('vote-update', ({ memeId, upvotes }) => {
      setMemes(prev =>
        prev.map(m =>
          m.id === parseInt(memeId) 
            ? { ...m, upvotes: upvotes } 
            : m
        )
      );
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleVote = async (id, type) => {
    if (votingStates[id]) return;
    
    setVotingStates(prev => ({ ...prev, [id]: true }));

    try {
      const increment = type === 'up' ? 1 : -1;
      setMemes(prev =>
        prev.map(meme => {
          if (meme.id === id) {
            return {
              ...meme,
              upvotes: (meme.upvotes || 0) + increment
            };
          }
          return meme;
        })
      );
      const response = await axios.post(`${API_URL}/api/memes/${id}/vote`, { type });

      if (response.data && response.data.data && response.data.data.upvotes !== undefined) {
        setMemes(prev =>
          prev.map(meme =>
            meme.id === parseInt(id)
              ? { ...meme, upvotes: response.data.data.upvotes }
              : meme
          )
        );
      }

    } catch (err) {
      console.error('Voting error:', err);
      
      const rollbackIncrement = type === 'up' ? -1 : 1;
      setMemes(prev =>
        prev.map(meme => {
          if (meme.id === id) {
            return {
              ...meme,
              upvotes: (meme.upvotes || 0) + rollbackIncrement
            };
          }
          return meme;
        })
      );

      alert('Failed to register vote. Please try again.');
    } finally {
      setVotingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const getVoteDisplay = (upvotes) => {
    const score = upvotes || 0;
    if (score > 0) return `+${score}`;
    return score.toString();
  };

  const getVoteColor = (upvotes) => {
    const score = upvotes || 0;
    if (score > 0) return '#10b981';
    if (score < 0) return '#ef4444'; 
    return '#6b7280';
  };

  return (
    <div className="meme-gallery-container">
      <div className="gallery-header">
        <h1 className="meme-gallery-title">Meme Gallery</h1>
        <button 
          className="leaderboard-toggle"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          {showLeaderboard ? 'Show All Memes' : 'Show Leaderboard'}
        </button>
      </div>
      
      {showLeaderboard ? (
        <Leaderboard memes={memes} />
      ) : (
        <div className="meme-grid">
          {memes.map((meme) => (
            <div key={meme.id} className="meme-card">
              <img src={meme.image} alt={meme.title} className="meme-image" />
              <div className="meme-title">{meme.title}</div>

              {meme.tags && (
                <div className="meme-tags">
                  Tags: {meme.tags.split(',').map((tag, i) => (
                    <span key={i} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              )}

              {meme.caption && (
                <div className="meme-caption">"{meme.caption}"</div>
              )}

              {meme.vibe && (
                <div className="meme-vibe">
                  Vibe: <strong>{meme.vibe}</strong>
                </div>
              )}

              <div className="vote-controls">
                <img
                  // src={upvoteIcon}
                  src={up_2}
                  alt="Upvote"
                  onClick={() => handleVote(meme.id, 'up')}
                  className={`vote-btn ${votingStates[meme.id] ? 'voting' : ''}`}
                  style={{ 
                    opacity: votingStates[meme.id] ? 0.6 : 1,
                    cursor: votingStates[meme.id] ? 'not-allowed' : 'pointer',
                    pointerEvents: votingStates[meme.id] ? 'none' : 'auto'
                  }}
                />
                
                <span 
                  className="vote-count"
                  style={{ 
                    color: getVoteColor(meme.upvotes),
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    minWidth: '60px',
                    textAlign: 'center',
                    textShadow: '0 0 8px currentColor'
                  }}
                >
                  {getVoteDisplay(meme.upvotes)}
                </span>
                
                <img
                  // src={downvoteIcon}
                  src ={down_2}
                  alt="Downvote"
                  onClick={() => handleVote(meme.id, 'down')}
                  className={`vote-btn ${votingStates[meme.id] ? 'voting' : ''}`}
                  style={{ 
                    opacity: votingStates[meme.id] ? 0.6 : 1,
                    cursor: votingStates[meme.id] ? 'not-allowed' : 'pointer',
                    pointerEvents: votingStates[meme.id] ? 'none' : 'auto'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Leaderboard = ({ memes }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/memes/leaderboard?top=10`);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sortedMemes = [...memes]
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 10);
    setLeaderboardData(sortedMemes);
  }, [memes]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'regular';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <h2>🏆 Meme Leaderboard 🏆</h2>
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h2>🏆 Meme Leaderboard 🏆</h2>
      
      <div className="podium">
        {leaderboardData.slice(0, 3).map((meme, index) => {
          const rank = index + 1;
          return (
            <div key={meme.id} className={`podium-item ${getRankClass(rank)}`}>
              <div className="rank-icon">{getRankIcon(rank)}</div>
              <img src={meme.image} alt={meme.title} className="podium-image" />
              <div className="podium-title">{meme.title}</div>
              <div className="podium-score">{meme.upvotes || 0} votes</div>
            </div>
          );
        })}
      </div>

      <div className="rankings-list">
        <h3>Full Rankings</h3>
        {leaderboardData.map((meme, index) => {
          const rank = index + 1;
          return (
            <div key={meme.id} className={`ranking-item ${getRankClass(rank)}`}>
              <div className="rank-number">{getRankIcon(rank)}</div>
              <img src={meme.image} alt={meme.title} className="ranking-image" />
              <div className="ranking-info">
                <div className="ranking-title">{meme.title}</div>
                <div className="ranking-tags">
                  {meme.tags && meme.tags.split(',').slice(0, 3).map((tag, i) => (
                    <span key={i} className="ranking-tag">{tag.trim()}</span>
                  ))}
                </div>
              </div>
              <div className="ranking-score">
                <span className="score-number">{meme.upvotes || 0}</span>
                <span className="score-label">votes</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemeGallery;