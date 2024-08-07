import { useContext, useEffect, useMemo, useState } from 'react';
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
  Container,
} from 'react-bootstrap';
import ReactSelect from 'react-select';
import styles from './NoteList.module.css';
import UserContext from '../../context/UserContext';
import { moon, sun } from '../../utils/icons';
import useWindowDimensions from '../../utils/getWindowDimensions';
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu';
import SideBar from '../../components/SideBar/SideBar';
import BurgerBtn from '../../components/BurgerBtn/BurgerBtn';

import './NoteList.css';

export default function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
  isLoggedIn,
  setIsLoggedIn,
  lightmode,
  setLightmode,
  teamspaces,
  tags,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const loadingNotes = ['1', '2', '3', '4', '5', '6'];

  const windowDimensions = useWindowDimensions();

  const { logout, isPowerUser } = useContext(UserContext);

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

  function handleLogOut() {
    setIsLoggedIn(false);
    logout();
  }

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

  useEffect(() => {
    document.title = "Peter's Notes";
    if (!filteredNotes.length) setNotesLoading(true);
    else setNotesLoading(false);
  }, [filteredNotes]);

  if (isBurgerOpen) {
    return (
      <BurgerMenu
        notes={notes}
        teamspaces={teamspaces}
        setIsBurgerOpen={setIsBurgerOpen}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <Row className="note-list-main-container">
      <Col>
        <SideBar
          tags={tags}
          notes={notes}
          lightmode={lightmode}
          teamspaces={teamspaces}
          isLoggedIn={isLoggedIn}
        />
      </Col>
      <Col>
        <Container>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="note-title">Peter's Notes</h1>
            </Col>
            <Col xs="auto">
              <Stack gap={2} direction="horizontal">
                {lightmode ? (
                  <div
                    className="lightmode-icons"
                    onClick={() => setLightmode(false)}
                  >
                    <svg>
                      <path d={moon}></path>
                    </svg>
                  </div>
                ) : (
                  <div
                    className="lightmode-icons"
                    onClick={() => setLightmode(true)}
                  >
                    <svg className="sun">
                      <path d={sun}></path>
                    </svg>
                  </div>
                )}
                {/* <Link to="/tasks">
              <Button
                className={
                  lightmode ? 'todo-btn text-black' : 'white-text todo-btn'
                }
                variant={lightmode ? 'outline-secondary' : 'outline-secondary'}
              >
                Switch to Tasks
              </Button>
            </Link> */}

                {!isLoggedIn && (
                  <Link to="/login">
                    <Button
                      className={lightmode ? undefined : 'white-text'}
                      variant={lightmode ? 'primary' : 'outline-primary'}
                    >
                      Log In
                    </Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <Button
                    disabled={!isLoggedIn}
                    onClick={() => handleLogOut()}
                    className={lightmode ? undefined : 'white-text'}
                    variant={lightmode ? 'danger' : 'outline-danger'}
                  >
                    Log Out
                  </Button>
                )}
                {windowDimensions.width < 1100 && (
                  <Col>
                    <BurgerBtn action={setIsBurgerOpen} />
                  </Col>
                )}
              </Stack>
            </Col>
          </Row>

          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="note-title">Notes</h2>
            </Col>
            <Col xs="auto">
              <Stack gap={2} direction="horizontal">
                {/* {isLoggedIn && (
                <Link
                  to={`/teamspace/${
                    teamspaces.find((tspace) => tspace.name === 'Personal')?.id
                  }`}
                >
                  <Button
                    disabled={!isLoggedIn}
                    className={lightmode ? undefined : 'white-text'}
                    variant={lightmode ? 'primary' : 'outline-primary'}
                  >
                    My Teamspace
                  </Button>
                </Link>
              )} */}
                {isLoggedIn && (
                  <Link
                    style={{ pointerEvents: !isLoggedIn && 'none' }}
                    to="/new"
                  >
                    <Button
                      disabled={!isLoggedIn}
                      className={lightmode ? undefined : 'white-text'}
                      variant={lightmode ? 'primary' : 'outline-primary'}
                    >
                      Create
                    </Button>
                  </Link>
                )}
                {isLoggedIn && isPowerUser && (
                  <Button
                    disabled={!isLoggedIn}
                    onClick={() => setEditTagsModalIsOpen(true)}
                    className={lightmode ? undefined : 'white-text'}
                    variant={lightmode ? 'secondary' : 'outline-secondary'}
                  >
                    Edit Tags
                  </Button>
                )}
              </Stack>
            </Col>
          </Row>

          <Form>
            <Row className="mb-4 search-bar">
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
                    styles={lightmode ? undefined : selectStyles}
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

          <Row xs={1} sm={2} lg={3} xxl={4} className="g-3">
            {notesLoading
              ? loadingNotes.map((load) => (
                  <Col key={load} className="loading-card">
                    <NoteCard
                      id=""
                      title="Loading"
                      tags={[{ id: 1, label: 'Loading' }]}
                    />
                  </Col>
                ))
              : filteredNotes.map((note) => (
                  <Col key={note.id}>
                    <NoteCard
                      id={note.id}
                      title={note.title}
                      tags={note.tags}
                      isPrivate={note.private}
                    />
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
        </Container>
      </Col>
    </Row>
  );
}

export function NoteCard({ id, title, tags, isPrivate }) {
  return (
    <Card
      as={Link}
      to={`/note/${id}`}
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
              {isPrivate && (
                <Badge className="text-truncate bg-danger">Private</Badge>
              )}
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
