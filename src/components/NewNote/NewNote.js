import { Form } from 'react-bootstrap';
import NoteForm from '../NoteForm/NoteForm';

export default function NewNote({
  onSubmit,
  onAddTag,
  availableTags,
  lightmode,
  setLightmode,
  isLoggedIn,
}) {
  return (
    <>
      <h1 className="mb-4 note-title">New Note</h1>
      <Form.Switch
        className="lightmode-switch"
        checked={lightmode}
        onChange={(e) => setLightmode(e.target.checked)}
      />
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        isLoggedIn={isLoggedIn}
        lightmode={lightmode}
      />
    </>
  );
}
