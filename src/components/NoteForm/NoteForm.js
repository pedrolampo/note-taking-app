import { useEffect, useRef, useState } from 'react';
import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CreatableReactSelect from 'react-select/creatable';
import { v4 as uuidV4 } from 'uuid';
import { getUserData } from '../../utils/getUserData';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = '',
  markdown = '',
  owner = '',
  tags = [],
  lightmode,
  isLoggedIn,
}) {
  const titleRef = useRef(null);
  const markdownRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState(tags);
  const [noteMd, setNoteMd] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    setNoteMd(markdown);
  }, [markdown]);

  const Pre = ({ children }) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );

  function checkIfOwner(owner) {
    if (window.location.href.includes('/new')) return true;
    if (owner === getUserData()?.email) return true;
    else return false;
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current.value,
      markdown: markdownRef.current.value,
      tags: selectedTags,
      owner: getUserData()?.email,
    });

    navigate('..');
  }

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                isMulti
                styles={lightmode ? undefined : selectStyles}
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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
        <Form.Group controlId="markdown">
          <div className="edit-note-labels">
            <Form.Label htmlFor="markdown">Body</Form.Label>
            <Form.Check
              id="toggle"
              type="switch"
              onChange={(e) => setShowOverview(e.target.checked)}
              label="Toggle Note Overview"
              reverse
            />
          </div>
          <div className={showOverview ? 'edit-note-form' : undefined}>
            <Form.Control
              ref={markdownRef}
              onChange={(e) => setNoteMd(e.target.value)}
              defaultValue={markdown}
              required
              as="textarea"
              rows={15}
            />

            {showOverview && (
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
                {noteMd}
              </ReactMarkdown>
            )}
          </div>
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          {isLoggedIn && checkIfOwner(owner) && (
            <Button
              disabled={!isLoggedIn}
              type="submit"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'primary' : 'outline-primary'}
            >
              Save
            </Button>
          )}
          <Link to="..">
            <Button
              type="button"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'secondary' : 'outline-secondary'}
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
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
