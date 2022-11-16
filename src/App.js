import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewNote from './components/NewNote/NewNote';
import { v4 as uuidV4 } from 'uuid';

import './App.css';
import NoteList from './components/NoteList/NoteList';
import NoteLayout from './components/NoteLayout/NoteLayout';
import Note from './components/Note/Note';
import EditNote from './components/EditNote/EditNote';
import { useLocalStorage } from './utils/useLocalStorage';

// const partialNotes = [
//   {
//     title: 'Title 1',
//     tagIds: ['testId'],
//     id: 'testnoteid1',
//     markdown: 'markdown body',
//   },
//   {
//     title: 'Title 3',
//     tagIds: [],
//     id: 'testnoteid3',
//     markdown: 'markdown body2',
//   },
//   {
//     title: 'Title 2',
//     tagIds: ['testId2'],
//     id: 'testnoteid2',
//     markdown: 'markdown body2',
//   },
// ];

// const partialTags = [
//   { label: 'test', id: 'testId' },
//   { label: 'test2', id: 'testId2' },
// ];

function App() {
  const [notes, setNotes] = useLocalStorage('NOTES', []);
  const [tags, setTags] = useLocalStorage('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id, { tags, ...data }) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id, label) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <NoteList
                notes={notesWithTags}
                availableTags={tags}
                onUpdateTag={updateTag}
                onDeleteTag={deleteTag}
              />
            }
          />
          <Route
            path="/new"
            element={
              <NewNote
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDelete={onDeleteNote} />} />
            <Route
              path="edit"
              element={
                <EditNote
                  onSubmit={onUpdateNote}
                  onAddTag={addTag}
                  availableTags={tags}
                />
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
