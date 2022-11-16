import NoteForm from '../NoteForm/NoteForm';

export default function NewNote({ onSubmit, onAddTag, availableTags }) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
