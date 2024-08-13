import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  useParams,
  useNavigate,
  Outlet,
  useOutletContext,
} from 'react-router-dom';

export default function NoteLayout({ notes }) {
  const [notesLoaded, setNotesLoaded] = useState(false);
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);
  const navigate = useNavigate();

  useEffect(() => {
    setNotesLoaded(true);
  }, [notes]);

  if (notesLoaded && note === undefined && notes.length) {
    return (
      <>
        <h1>Error 404</h1>
        <h3 className="not-found">Note not found</h3>
        <Button variant="outline-primary" onClick={() => navigate('/')}>
          Go back
        </Button>
      </>
    );
  }

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
