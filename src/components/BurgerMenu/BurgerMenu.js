import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { NoteCard } from '../../views/NoteList/NoteList';
import { searchIconBlack } from '../../utils/icons';
import './BurgerMenu.css';

export default function BurgerMenu({
  notes,
  teamspaces,
  lightmode,
  setIsBurgerOpen,
  isLoggedIn,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [title, setTitle] = useState('');

  const { id } = useParams();

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        title === '' || note.title.toLowerCase().includes(title.toLowerCase())
      );
    });
  }, [title, notes]);

  return (
    <div className="burger-menu">
      <div className="burger-header">
        <Link onClick={() => setIsBurgerOpen(false)} to="/">
          <h4>Peter's Notes</h4>
        </Link>
        <span onClick={() => setIsBurgerOpen(false)}>&#9587;</span>
      </div>

      <div className="burger-menu-content">
        <div className="burger-menu-search-container">
          <span
            onClick={() => setIsSearchOpen(true)}
            className="burger-menu-search"
          >
            {searchIconBlack} Quick Search
          </span>
        </div>

        {isLoggedIn && (
          <div className="burger-menu-teamspaces-container">
            <Link to={'/teamspaces'}>
              <h4 className="burger-menu-teamspaces-header">Teamspaces</h4>
            </Link>
            <div className="teamspaces-body">
              {teamspaces.map((space) => (
                <Link
                  onClick={() => setIsBurgerOpen(false)}
                  key={space.id}
                  to={`/teamspace/${space.id}`}
                  className={`${space.id === id && 'selected'}`}
                >
                  {space.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        onClick={() => setIsBurgerOpen(false)}
        to="/new"
        className="create-button"
      >
        New Note
      </Link>

      {isSearchOpen && (
        <div className="main-search-container">
          <div
            onClick={() => setIsSearchOpen(false)}
            className="search-overlay"
          ></div>
          <Container>
            <Row className="search-form">
              <Form.Group controlId="title">
                <Form.Label>Search Notes</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Row>
            {title && (
              <Row xs={1} sm={2} lg={3} xl={4} className="g-3 search-results">
                {filteredNotes.map((note) => (
                  <Col
                    onClick={() => {
                      setIsSearchOpen(false);
                      setIsBurgerOpen(false);
                    }}
                    key={note.id}
                  >
                    <NoteCard
                      id={note.id}
                      title={note.title}
                      tags={note.tags}
                      isPrivate={note.private}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </div>
      )}
    </div>
  );
}
