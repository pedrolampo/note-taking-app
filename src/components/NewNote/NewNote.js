import NoteForm from '../NoteForm/NoteForm';

export default function NewNote({
  onSubmit,
  onAddTag,
  availableTags,
  isLoggedIn,
}) {
  return (
    <>
      <h1 className="mb-4 note-title">New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
