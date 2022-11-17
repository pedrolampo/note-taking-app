import { useNote } from '../NoteLayout/NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Stack, Badge, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

export default function Note({ onDelete }) {
  const note = useNote();
  const navigate = useNavigate();

  if (note == null) return <h3>Loading...</h3>;

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
                onDelete(note.id);
                navigate('/');
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
    </>
  );
}
