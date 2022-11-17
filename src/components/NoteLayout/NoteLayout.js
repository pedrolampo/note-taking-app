import { useParams, Outlet, useOutletContext } from 'react-router-dom';

export default function NoteLayout({ notes }) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note == null) return <h3 style={{ color: '#fff' }}>Loading...</h3>;

  return <Outlet context={note} />;
}

export function useNote() {
  return useOutletContext();
}
