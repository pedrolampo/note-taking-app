import { useRef, useState } from 'react';
import { useNote } from '../NoteLayout/NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Stack, Badge, Button, Modal, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { getPass } from '../../services/firestore/firebase.js';

export default function Note({ onDelete }) {
  const [deleteNoteModalIsOpen, setDeleteNoteModalIsOpen] = useState(false);
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button className="white-text" variant="outline-primary">
                Edit
              </Button>
            </Link>
            <Button
              onClick={() => {
                // onDelete(note.id);
                // navigate('/');
                setDeleteNoteModalIsOpen(true);
              }}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Link to="/">
              <Button className="white-text" variant="outline-secondary">
                Back
              </Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown className="note-markdown">{note.markdown}</ReactMarkdown>

      <DeleteNoteModal
        onDelete={onDelete}
        noteId={note.id}
        navigate={navigate}
        show={deleteNoteModalIsOpen}
        handleClose={() => setDeleteNoteModalIsOpen(false)}
      />
    </>
  );
}

function DeleteNoteModal({ onDelete, show, handleClose, noteId, navigate }) {
  const passRef = useRef();

  async function handleDelete() {
    const pass = await getPass().then((data) => {
      return data;
    });

    if (passRef.current.value === pass) {
      onDelete(noteId);
      navigate('/');
    } else return;
  }

  return (
    <Modal className="modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete note?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Stack>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Control ref={passRef} type="password" />
              </Form>
            </Stack>
          </Col>
          <Col xs="auto">
            <Stack
              className="justify-content-end"
              direction="horizontal"
              gap={2}
            >
              <Button onClick={() => handleDelete()} variant="outline-danger">
                Yes
              </Button>
              <Button onClick={handleClose} variant="outline-secondary">
                No
              </Button>
            </Stack>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
