import NoteForm from '../NoteForm/NoteForm';
import { useNote } from '../NoteLayout/NoteLayout';
import { moon, sun } from '../../utils/icons';

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
      <div className="edit-header">
        <h1 className="mb-4 note-title">Edit Note</h1>
        {lightmode ? (
          <div className="lightmode-icons" onClick={() => setLightmode(false)}>
            <svg>
              <path d={moon}></path>
            </svg>
          </div>
        ) : (
          <div className="lightmode-icons" onClick={() => setLightmode(true)}>
            <svg className="sun">
              <path d={sun}></path>
            </svg>
          </div>
        )}
      </div>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        toc={note.toc}
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
