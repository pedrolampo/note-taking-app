import { useContext, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewNote from './components/NewNote/NewNote';
// import { v4 as uuidV4 } from 'uuid';
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
import Todo from './components/Todo/Todo';
import NewTodo from './components/NewTodo/NewTodo';
import {
  db,
  getNotes,
  getTags,
  // getTodos,
  searchTagsId,
  getPowerUsers,
} from './services/firestore/firebase';
import './App.css';

import { NotificationContextProvider } from './context/NotificationContext';
import UserContext from './context/UserContext';
import { getUserData } from './utils/getUserData';

function App() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [powerUsers, setPowerUsers] = useState();
  const [lightmode, setLightmode] = useState(false);

  const { user, login, setIsPowerUser } = useContext(UserContext);

  // Fetch for poweruser &
  getPowerUsers().then((poweruser) => {
    setPowerUsers(poweruser);
  });

  useEffect(() => {
    const currentUser = getUserData();
    // Get all data and log in info on load
    getNotes().then((notes) => {
      setNotes(
        notes.filter(
          (note) =>
            !note.private || (note.private && note.owner === currentUser?.email)
        )
      );
    });
    getTags().then((tags) => {
      setTags(tags);
    });
    // getTodos('owner', '==', getUserData()?.email).then((toDos) => {
    //   setTodos(toDos);
    // });

    // Set current user permissions if isPowerUser
    powerUsers?.forEach((admin) => {
      if (admin.email === user?.email && admin.poweruser) {
        setIsPowerUser(true);
      }
    });

    // Auto login at start
    if (currentUser) {
      login(currentUser);
      setIsLoggedIn(true);
    }

    //  Check for Lightmode user prefs
    const isLightmodeOn = localStorage.getItem('PNOTES_IS_LIGHTMODE');
    if (isLightmodeOn) {
      setLightmode(JSON.parse(isLightmodeOn));
    }
  }, [powerUsers, isLoggedIn]); // eslint-disable-line

  // Array containing all the notes with their tags
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

  // Set lightmode and store user pref
  function handleLightmode(value) {
    setLightmode(value);
    localStorage.setItem('PNOTES_IS_LIGHTMODE', JSON.stringify(value));
  }

  // Handle create new note and push it to firebase
  function onCreateNote({ tags, ...data }) {
    const newNote = {
      ...data,
      tagIds: tags.map((tag) => tag.id),
    };

    const batch = writeBatch(db);

    addDoc(collection(db, 'notes'), newNote)
      .then(({ id }) => {
        setNotes((prevNotes) => {
          return [
            ...prevNotes,
            { ...data, id: id, tagIds: tags.map((tag) => tag.id) },
          ];
        });
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
  }

  // Handle update existing note and push it to firebase
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

  // Handle delete existing note
  function onDeleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });

    deleteDoc(doc(db, 'notes', id));
  }

  // Handles creating a new task
  function onCreateTodo(data) {
    const batch = writeBatch(db);

    addDoc(collection(db, 'todos'), data)
      .then(({ id }) => {
        setTodos((prevTodos) => {
          return [...prevTodos, data];
        });
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
  }

  // Handles deleting an existing task
  async function onDeleteTask(id) {
    await deleteDoc(doc(db, 'todos', id));

    setTodos((prevTasks) => {
      return prevTasks.filter((task) => task.id !== id);
    });
  }

  // Handles adding a new note tag
  function addTag(tag) {
    setTags((prev) => [...prev, tag]);

    const batch = writeBatch(db);

    addDoc(collection(db, 'tags'), tag)
      .then(({ id }) => {
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
  }

  // Handles editing an existing note tag
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

  // Handles deleting an existing note tag
  async function deleteTag(id) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });

    let searchedTag;
    await searchTagsId('id', '==', id).then((tags) => (searchedTag = tags));
    await deleteDoc(doc(db, 'tags', searchedTag[0]));
  }

  return (
    <Container className={lightmode ? 'lightmode py-4' : 'py-4'}>
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
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
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
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
                />
              }
            />
            <Route
              path="/:id"
              element={
                <NoteLayout
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
                  notes={notesWithTags}
                />
              }
            >
              <Route
                index
                element={
                  <Note
                    lightmode={lightmode}
                    setLightmode={handleLightmode}
                    isLoggedIn={isLoggedIn}
                    onDelete={onDeleteNote}
                    tags={tags}
                    notes={notesWithTags}
                  />
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
                    lightmode={lightmode}
                    setLightmode={handleLightmode}
                  />
                }
              />
            </Route>
            <Route
              path="/tasks"
              element={
                <Todo
                  todos={todos}
                  isLoggedIn={isLoggedIn}
                  lightmode={lightmode}
                  setTodos={setTodos}
                  setLightmode={handleLightmode}
                  setIsLoggedIn={setIsLoggedIn}
                  onDeleteTask={onDeleteTask}
                />
              }
            />
            <Route
              path="/tasks/new"
              element={
                <NewTodo
                  onSubmit={onCreateTodo}
                  isLoggedIn={isLoggedIn}
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login lightmode={lightmode} setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route
              path={'/createUser'}
              element={<CreateUser lightmode={lightmode} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Notification />
        </BrowserRouter>
      </NotificationContextProvider>
    </Container>
  );
}

export default App;
