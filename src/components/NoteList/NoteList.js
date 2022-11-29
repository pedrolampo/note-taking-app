import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Row,
  Col,
  Stack,
  Button,
  Card,
  Badge,
  Modal,
} from 'react-bootstrap';
import ReactSelect from 'react-select';
import styles from './NoteList.module.css';
import { getPass } from '../../services/firestore/firebase';

export default function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
  isLoggedIn,
  setIsLoggedIn,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
  const [logInModalIsOpen, setLogInModalIsOpen] = useState(false);

  useEffect(() => {
    document.title = "Peter's Notes";
  }, []);

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? '#444' : '#2b2a34',
      color: '#fff',
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: '#fff',
    }),
    multiValue: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#666',
    }),
    multiValueLabel: (baseStyles) => ({
      ...baseStyles,
      color: '#fff',
      backgroundColor: '#666',
    }),
    multiValueRemove: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#666',
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#444',
      color: '#fff',
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#444',
      color: '#fff',
    }),
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === '' ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Button
              style={{ display: isLoggedIn && 'none' }}
              className="white-text"
              onClick={() => setLogInModalIsOpen(true)}
              variant="outline-primary"
            >
              Log In
            </Button>
            <Link style={{ pointerEvents: !isLoggedIn && 'none' }} to="/new">
              <Button
                disabled={!isLoggedIn}
                className="white-text"
                variant="outline-primary"
              >
                Create
              </Button>
            </Link>
            <Button
              disabled={!isLoggedIn}
              className="white-text"
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>

      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                className="select"
                isMulti
                styles={selectStyles}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>

      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />

      <LogInModal
        show={logInModalIsOpen}
        handleClose={() => setLogInModalIsOpen(false)}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
}

function NoteCard({ id, title, tags }) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  show,
  handleClose,
  onUpdateTag,
  onDeleteTag,
}) {
  return (
    <Modal className="modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function LogInModal({ show, handleClose, setIsLoggedIn }) {
  const logInPassRef = useRef();

  async function handleLogIn() {
    const pass = await getPass().then((data) => {
      return data;
    });

    if (logInPassRef.current.value === pass) {
      sessionStorage.setItem('NOTES_LOGGED_IN', JSON.stringify(true));
      setIsLoggedIn(true);
      handleClose();
    } else return;
  }

  return (
    <Modal className="modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Stack gap={2}>
            <Row>
              <Col>
                <Form.Control ref={logInPassRef} type="password" />
              </Col>
              <Col xs="auto">
                <Button onClick={() => handleLogIn()} variant="outline-primary">
                  Log In
                </Button>
              </Col>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
