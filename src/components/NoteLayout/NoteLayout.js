import {
  useParams,
  Navigate,
  Outlet,
  useOutletContext,
} from 'react-router-dom';

export default function NoteLayout({ notes }) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note == null) return <Navigate to="/" replace />;

  return <Outlet context={note} />;
}

export function useNote() {
  return useOutletContext();
}
