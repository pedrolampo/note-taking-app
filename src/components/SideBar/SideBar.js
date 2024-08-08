import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { NoteCard } from '../../views/NoteList/NoteList';
import Accordion from '../Accordion/Accordion';
import { searchIconBlack } from '../../utils/icons';
import './SideBar.css';

export default function SideBar({
  tags,
  notes,
  teamspaces,
  lightmode,
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

  const sortedTags = tags.sort((a, b) => {
    if (a.label.toLowerCase() < b.label.toLowerCase()) {
      return -1;
    }
    if (a.label.toLowerCase() > b.label.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="sidebar">
      <Link to="/">
        <h4>Peter's Notes</h4>
      </Link>

      <div className="sidebar-content">
        <div className="sidebar-search-container">
          <span
            onClick={() => setIsSearchOpen(true)}
            className="sidebar-search"
          >
            {searchIconBlack} Quick Search
          </span>
        </div>

        {isLoggedIn && (
          <div className="sidebar-teamspaces-container">
            <Link to={'/teamspaces'}>
              <h4 className="sidebar-teamspaces-header">Teamspaces</h4>
            </Link>
            <div className="teamspaces-body">
              {teamspaces.map((space) => (
                <Link
                  className={`${space.id === id && 'selected'}`}
                  key={space.id}
                  to={`/teamspace/${space.id}`}
                >
                  {space.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="tags-container">
          <h4 className="tags-header">Tags</h4>
          <div className="tags-body">
            {sortedTags.map((tag) => (
              <Accordion
                tag={tag}
                notes={notes}
                lightmode={lightmode}
                key={tag.id}
              />
            ))}
          </div>
        </div>
      </div>

      <Link to="/new" className="create-button">
        &#43; Create
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
                  <Col onClick={() => setIsSearchOpen(false)} key={note.id}>
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
