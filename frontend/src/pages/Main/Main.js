import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import like from '../../assets/like.svg';
import dislike from '../../assets/dislike.svg';
import itsamatch from '../../assets/itsamatch.png';

const Main = ({ match }) => {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: { 
          user: match.params.id,
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io('http://localhost:0811', {
      query: { user: match.params.id }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`devs/${id}/like`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`devs/${id}/dislike`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return(
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
        { users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user._id}>
              <img src={user.avatar} alt="avatar" />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
              <button type="button">
                  <img src={dislike} alt="dislike" onClick={() => handleDislike(user._id)}/>
                </button>
                <button type="button">
                  <img src={like} alt="like" onClick={() => handleLike(user._id)}/>
                </button>
              </div>
            </li>
          ))}
          </ul>
        ) : (
          <div className="empty">Acabou :(</div>
        ) }

        { matchDev && (
          <div className="match-container">
            <img src={itsamatch} alt="its a match" />

            <img className="avatar" src={matchDev.avatar} alt="avatar" />
            <strong>{matchDev.name}</strong>
            <p>{matchDev.bio}</p>

            <button type="button" onClick={() => setMatchDev(null)} >Fechar</button>
          </div>
        ) }
    </div>
  );
}

export default Main;