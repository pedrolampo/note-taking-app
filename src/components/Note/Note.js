import { useEffect, useState } from 'react';
import { useNote } from '../NoteLayout/NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Stack, Badge, Button, Container } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { searchUsers } from '../../services/firestore/firebase.js';
import { getUserData } from '../../utils/getUserData';
import { moon, sun } from '../../utils/icons';
import {
  CodeCopyBtn,
  DeleteNoteModal,
  extractHeadings,
  TableOfContents,
} from '../../utils/noteFunctions.js';
import './Note.css';
import SideBar from '../SideBar/SideBar.js';

export default function Note({
  onDelete,
  isLoggedIn,
  lightmode,
  setLightmode,
  tags,
  notes,
}) {
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
    <Row className="note-main-container">
      <Col>
        <SideBar tags={tags} notes={notes} lightmode={lightmode} />
      </Col>
      <Col>
        <Container>
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
                    <Badge className="text-truncate bg-success">
                      {ownerName}
                    </Badge>
                  ) : null}
                </Stack>
              )}
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
                {isLoggedIn && checkIfOwner(note.owner) && (
                  <>
                    <Link
                      style={{ pointerEvents: !isLoggedIn && 'none' }}
                      to={`/${note.id}/edit`}
                    >
                      <Button
                        disabled={!isLoggedIn}
                        className={lightmode ? undefined : 'white-text'}
                        variant={lightmode ? 'primary' : 'outline-primary'}
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
                      variant={lightmode ? 'danger' : 'outline-danger'}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Link to="/">
                  <Button
                    className={lightmode ? undefined : 'white-text'}
                    variant={lightmode ? 'secondary' : 'outline-secondary'}
                  >
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
                    style={lightmode ? undefined : oneDark}
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
        </Container>
      </Col>
    </Row>
  );
}
