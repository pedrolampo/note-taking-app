import { useContext, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewNote from './components/NewNote/NewNote';
import { v4 as uuidV4 } from 'uuid';
import {
  addDoc,
  collection,
  writeBatch,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import NoteList from './components/NoteList/NoteList';
import NoteLayout from './components/NoteLayout/NoteLayout';
import Note from './components/Note/Note';
import EditNote from './components/EditNote/EditNote';
import ScrollToTop from './utils/scrollToTop';
import Notification from './components/Notification/Notification';
import Login from './components/Login/Login';
import CreateUser from './components/CreateUser/CreateUser';
import {
  db,
  getNotes,
  getTags,
  searchTagsId,
} from './services/firestore/firebase';
import './App.css';

import { NotificationContextProvider } from './context/NotificationContext';
import UserContext from './context/UserContext';

function App() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { login } = useContext(UserContext);

  useEffect(() => {
    getNotes().then((notes) => {
      setNotes(notes.filter((note) => !note.private));
    });
    getTags().then((tags) => {
      setTags(tags);
    });

    const loggedUserJSON = window.localStorage.getItem('user');

    if (loggedUserJSON) {
      const objUser = JSON.parse(loggedUserJSON);
      login(objUser);
      setIsLoggedIn(true);
    }
  }, []); // eslint-disable-line

  const notesWithTags = useMemo(() => {
    return notes
      .map((note) => {
        return {
          ...note,
          tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });

    const newNote = {
      ...data,
      tagIds: tags.map((tag) => tag.id),
    };

    const batch = writeBatch(db);

    addDoc(collection(db, 'notes'), newNote)
      .then(({ id }) => {
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
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

    const batch = writeBatch(db);

    const newNote = {
      ...data,
      tagIds: tags.map((tag) => tag.id),
    };

    getDoc(doc(db, 'notes', id))
      .then((docSnapshot) => {
        batch.update(doc(db, 'notes', docSnapshot.id), newNote);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        batch.commit();
      });
  }

  function onDeleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });

    deleteDoc(doc(db, 'notes', id));
  }

  function addTag(tag) {
    setTags((prev) => [...prev, tag]);

    const batch = writeBatch(db);

    addDoc(collection(db, 'tags'), tag)
      .then(({ id }) => {
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
  }

  async function updateTag(id, label) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });

    const batch = writeBatch(db);

    let searchedTag;
    await searchTagsId('id', '==', id).then((tags) => (searchedTag = tags));

    getDoc(doc(db, 'tags', searchedTag[0]))
      .then((docSnapshot) => {
        batch.update(doc(db, 'tags', docSnapshot.id), { id, label });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        batch.commit();
      });
  }

  async function deleteTag(id) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });

    let searchedTag;
    await searchTagsId('id', '==', id).then((tags) => (searchedTag = tags));
    await deleteDoc(doc(db, 'tags', searchedTag[0]));
  }

  return (
    <Container className="my-4">
      <NotificationContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <NoteList
                  notes={notesWithTags}
                  availableTags={tags}
                  onUpdateTag={updateTag}
                  onDeleteTag={deleteTag}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
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
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
              <Route
                index
                element={
                  <Note isLoggedIn={isLoggedIn} onDelete={onDeleteNote} />
                }
              />
              <Route
                path="edit"
                element={
                  <EditNote
                    isLoggedIn={isLoggedIn}
                    onSubmit={onUpdateNote}
                    onAddTag={addTag}
                    availableTags={tags}
                  />
                }
              />
            </Route>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path={'/createUser'} element={<CreateUser />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Notification />
        </BrowserRouter>
      </NotificationContextProvider>
    </Container>
  );
}

export default App;
