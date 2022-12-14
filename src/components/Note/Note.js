import { useEffect, useRef, useState } from 'react';
import { useNote } from '../NoteLayout/NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Stack, Badge, Button, Modal, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPass } from '../../services/firestore/firebase.js';

export default function Note({ onDelete, isLoggedIn }) {
  const [deleteNoteModalIsOpen, setDeleteNoteModalIsOpen] = useState(false);
  const note = useNote();
  const navigate = useNavigate();

  const Pre = ({ children }) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );

  useEffect(() => {
    document.title = `${note.title} - Peter's Notes`;
  }, [note]);

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
            <Link
              style={{ pointerEvents: !isLoggedIn && 'none' }}
              to={`/${note.id}/edit`}
            >
              <Button
                disabled={!isLoggedIn}
                className="white-text"
                variant="outline-primary"
              >
                Edit
              </Button>
            </Link>
            <Button
              disabled={!isLoggedIn}
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
      {/* <div className="markdown-container">
        <Button
          onClick={() => copyToClipboard(note.markdown)}
          className="markdown-copy-btn"
          variant="outline-secondary"
        >
          Copy
        </Button> */}
      <ReactMarkdown
        className="note-markdown"
        components={{
          pre: Pre,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {note.markdown}
      </ReactMarkdown>
      {/* </div> */}

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

// function copyToClipboard(text) {
//   let newText = text.substring(4);
//   newText = newText.slice(0, -3);
//   navigator.clipboard.writeText(newText);
// }

function CodeCopyBtn({ children }) {
  const handleClick = (e) => {
    navigator.clipboard.writeText(children[0].props.children[0]);
    console.log(children);
  };

  return (
    <div className="code-copy-btn">
      <svg
        onClick={handleClick}
        id="svg5612"
        viewBox="0 0 128 128"
        version="1.1"
      >
        <g id="layer1" transform="translate(0 -924.36)">
          <g id="g6783" transform="matrix(.99829 0 0 .99829 -101.01 570.97)">
            <path
              id="rect6587"
              d="m134.94 354c-3.324 0-6 2.676-6 6v96c0 3.324 2.676 6 6 6h82c3.324 0 6-2.676 6-6v-62h-40c-3.324 0-6-2.676-6-6v-34h-42z"
            />
            <path
              id="rect6587-3-9-6-6"
              d="m113.66 374.22c-3.324 0-6 2.676-6 6v96c0 3.324 2.676 6 6 6h82c3.324 0 6-2.676 6-6v-7h-73c-3.324 0-6-2.676-6-6v-89h-9z"
            />
            <path
              id="rect6587-3-2-9-2"
              d="m180.94 354v30c0 3.324 2.676 6 6 6h36z"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
