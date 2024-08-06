import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteCard } from '../NoteList/NoteList';
import Accordion from '../Accordion/Accordion';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { searchIconBlack } from '../../utils/icons';

import './SideBar.css';

export default function SideBar({ tags, notes, lightmode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [title, setTitle] = useState('');

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

      <div className="sidebar-search-container">
        <span onClick={() => setIsSearchOpen(true)} className="sidebar-search">
          {searchIconBlack} Search
        </span>
      </div>

      {sortedTags.map((tag) => (
        <Accordion tag={tag} notes={notes} lightmode={lightmode} key={tag.id} />
      ))}

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
