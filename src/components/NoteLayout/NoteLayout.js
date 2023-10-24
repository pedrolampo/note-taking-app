import { Button } from 'react-bootstrap';
import {
  useParams,
  useNavigate,
  Outlet,
  useOutletContext,
} from 'react-router-dom';

export default function NoteLayout({ notes }) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);
  const navigate = useNavigate();

  // TODO: change text to "not found" after few seconds
  // TODO: trigger re-render when loaded
  if (note == null) {
    return (
      <>
        <h1>Loading...</h1>
        <Button variant="outline-primary" onClick={() => navigate('/')}>
          Go back
        </Button>
      </>
    );
  }

  return <Outlet context={note} />;
}

export function useNote() {
  return useOutletContext();
}
