import NoteForm from '../NoteForm/NoteForm';
import { useNote } from '../NoteLayout/NoteLayout';

export default function EditNote({
  onSubmit,
  onAddTag,
  availableTags,
  isLoggedIn,
}) {
  const note = useNote();
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
