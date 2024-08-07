import NoteForm from '../NoteForm/NoteForm';
import { moon, sun } from '../../utils/icons';

export default function NewNote({
  onSubmit,
  onAddTag,
  availableTags,
  lightmode,
  setLightmode,
  isLoggedIn,
  teamspaces,
}) {
  return (
    <>
      <div className="edit-header">
        <h1 className="mb-4 note-title">New Note</h1>
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
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        isLoggedIn={isLoggedIn}
        lightmode={lightmode}
        availableTeamspaces={teamspaces}
      />
    </>
  );
}
