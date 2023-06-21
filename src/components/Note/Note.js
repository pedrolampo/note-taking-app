import { useEffect, useRef, useState } from 'react';
import { useNote } from '../NoteLayout/NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Stack, Badge, Button, Modal, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPass, searchUsers } from '../../services/firestore/firebase.js';
import { getUserData } from '../../utils/getUserData';

export default function Note({ onDelete, isLoggedIn }) {
  const [deleteNoteModalIsOpen, setDeleteNoteModalIsOpen] = useState(false);
  const [ownerName, setOwnerName] = useState(null);
  const note = useNote();
  const navigate = useNavigate();

  const Pre = ({ children }) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );

  searchUsers('email', '==', note.owner).then((user) => {
    setOwnerName(user[0]?.name);
  });

  function checkIfOwner(owner) {
    if (owner === getUserData()?.email) return true;
    else return false;
  }

  useEffect(() => {
    document.title = `${note.title} - Peter's Notes`;

    document.querySelectorAll('h2, h3, h4, h5, h6').forEach((el) => {
      el.id = el.innerHTML.replace(/\s+/g, '-').toLowerCase();
    });

    const containingElement = document.querySelector('.note-markdown');
    document.addEventListener('click', (e) => {
      if (
        e.target.tagName === 'A' &&
        !e.target.hasAttribute('target') &&
        containingElement.contains(e.target)
      ) {
        e.target.setAttribute('target', '_blank');
      }
    });
  }, [note]);

  const headings = extractHeadings(note.markdown);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="note-title">{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
              {ownerName ? (
                <Badge className="text-truncate bg-success">{ownerName}</Badge>
              ) : null}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            {isLoggedIn && checkIfOwner(note.owner) && (
              <>
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
              </>
            )}
            <Link to="/">
              <Button className="white-text" variant="outline-secondary">
                Back
              </Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      {note?.toc === false ? null : (
        <Row>
          <TableOfContents headings={headings} />
        </Row>
      )}
      <ReactMarkdown
        className="note-markdown"
        remarkPlugins={[remarkGfm]}
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

function TableOfContents({ headings }) {
  return (
    <div className="toc">
      <h3 className="toc-header">Table of Contents</h3>
      <hr />
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={`level-${heading.level}`}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function extractHeadings(markdown) {
  const regex = /^(#+)\s+(.+)$/gm;
  let match;
  const headings = [];
  while ((match = regex.exec(markdown))) {
    const level = match[1].length;
    const text = match[2];
    const id = slugify(text);
    headings.push({ level, text, id });
  }
  return headings;
}

function CodeCopyBtn({ children }) {
  const handleClick = (e) => {
    navigator.clipboard.writeText(children[0].props.children[0]);

    if (e.target.classList.contains('code-copy-btn')) {
      e.target.classList.add('success');
      e.target.children[0].classList.add('hidden');
      e.target.children[1].classList.remove('hidden');

      setTimeout(() => {
        e.target.classList.remove('success');
        e.target.children[0].classList.remove('hidden');
        e.target.children[1].classList.add('hidden');
      }, 2000);

      return;
    } else if (e.target.classList.contains('octicon')) {
      e.target.parentNode.classList.add('success');
      e.target.classList.add('hidden');
      e.target.nextSibling.classList.remove('hidden');

      setTimeout(() => {
        e.target.parentNode.classList.remove('success');
        e.target.classList.remove('hidden');
        e.target.nextSibling.classList.add('hidden');
      }, 2000);

      return;
    } else return;
  };

  return (
    <div className="code-copy-btn" onClick={handleClick}>
      <svg
        aria-hidden="true"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        data-view-component="true"
        className="octicon octicon-copy js-clipboard-copy-icon m-2 copy-icon"
      >
        <path
          fillRule="evenodd"
          d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
        ></path>
        <path
          fillRule="evenodd"
          d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
        ></path>
      </svg>
      <svg
        aria-hidden="true"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        data-view-component="true"
        className="octicon octicon-check js-clipboard-check-icon color-fg-success m-2 copy-done-icon hidden"
      >
        <path
          fillRule="evenodd"
          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        ></path>
      </svg>
    </div>
  );
}
