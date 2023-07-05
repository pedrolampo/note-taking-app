import { Form } from 'react-bootstrap';
import NoteForm from '../NoteForm/NoteForm';
import { useNote } from '../NoteLayout/NoteLayout';

export default function EditNote({
  onSubmit,
  onAddTag,
  availableTags,
  isLoggedIn,
  lightmode,
  setLightmode,
}) {
  const note = useNote();
  return (
    <>
      <h1 className="mb-4 note-title">Edit Note</h1>
      <Form.Switch
        className="lightmode-switch"
        checked={lightmode}
        onChange={(e) => setLightmode(e.target.checked)}
      />
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
        isLoggedIn={isLoggedIn}
        owner={note.owner}
        lightmode={lightmode}
      />
    </>
  );
}
