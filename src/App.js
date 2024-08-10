import { useContext, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NewNote from './components/NewNote/NewNote';
import {
  addDoc,
  collection,
  writeBatch,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import NoteList from './views/NoteList/NoteList';
import NoteLayout from './views/NoteLayout/NoteLayout';
import Login from './views/Login/Login';
import Teamspace from './views/Teamspace/Teamspace';
import Teamspaces from './views/Teamspaces/Teamspaces';
import Note from './components/Note/Note';
import EditNote from './components/EditNote/EditNote';
import ScrollToTop from './utils/scrollToTop';
import Notification from './components/Notification/Notification';
import CreateUser from './components/CreateUser/CreateUser';
import {
  db,
  getNotes,
  getTags,
  searchTagsId,
  getPowerUsers,
  getTeamspaces,
} from './services/firestore/firebase';
import './App.css';

import { NotificationContextProvider } from './context/NotificationContext';
import UserContext from './context/UserContext';
import { getUserData } from './utils/getUserData';
import NewTeamspace from './components/NewTeamspace/NewTeamspace';
import EditTeamspace from './components/EditTeamspace/EditTeamspace';
import TeamspaceLayout from './views/TeamspaceLayout/TeamspaceLayout';

function App() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  // const [todos, setTodos] = useState([]);
  const [teamspaces, setTeamspaces] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [powerUsers, setPowerUsers] = useState();
  const [lightmode, setLightmode] = useState(false);

  const { user, login, setIsPowerUser } = useContext(UserContext);

  useEffect(() => {
    const currentUser = getUserData();
    // Get all data and log in info on load
    getTags().then((tags) => {
      setTags(tags);
    });
    getTeamspaces().then((tspaces) => {
      let filteredTeamspaces = [];
      if (isLoggedIn) {
        filteredTeamspaces = tspaces.filter((space) =>
          space.collaborators.some(
            (collaborator) => collaborator.uid === user.uid
          )
        );
      }
      setTeamspaces(
        filteredTeamspaces.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
    // getTodos('owner', '==', getUserData()?.email).then((toDos) => {
    //   setTodos(toDos);
    // });

    // Fetch for powerusers
    getPowerUsers().then((poweruser) => {
      setPowerUsers(poweruser);
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
  }, [isLoggedIn]); // eslint-disable-line

  useEffect(() => {
    const currentUser = getUserData();
    getNotes().then((notes) => {
      setNotes(
        notes.filter((note) => {
          // Add note if it isn't private
          if (!note.private) return true;

          // Add note if it is private, and the owner is logged in
          if (note.private && note.owner === currentUser?.email) return true;

          // Add note if it is private, and the user is a collaborator in a teamspace where the note is included
          return (
            note.private &&
            note.teamspaces?.some((teamspaceId) => {
              const teamspace = teamspaces.find((ts) => ts.id === teamspaceId);
              return (
                teamspace &&
                teamspace.collaborators.some(
                  (collaborator) => collaborator.uid === currentUser?.uid
                )
              );
            })
          );
        })
      );
    });
    // Set current user permissions if isPowerUser
    powerUsers?.forEach((admin) => {
      if (admin.email === user?.email && admin.poweruser) {
        setIsPowerUser(true);
      }
    });
  }, [powerUsers]); // eslint-disable-line

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
  // function onCreateTodo(data) {
  //   const batch = writeBatch(db);

  //   addDoc(collection(db, 'todos'), data)
  //     .then(({ id }) => {
  //       setTodos((prevTodos) => {
  //         return [...prevTodos, data];
  //       });
  //       batch.commit().then(() => console.log(id));
  //     })
  //     .catch((err) => console.log(err));
  // }

  // Handles deleting an existing task
  // async function onDeleteTask(id) {
  //   await deleteDoc(doc(db, 'todos', id));

  //   setTodos((prevTasks) => {
  //     return prevTasks.filter((task) => task.id !== id);
  //   });
  // }

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

  // Handle create a new teamspace and push it to firebase
  function onCreateTeamspace({ ...data }) {
    const newTeamspace = {
      ...data,
    };

    const batch = writeBatch(db);

    addDoc(collection(db, 'teamspaces'), newTeamspace)
      .then(({ id }) => {
        setTeamspaces((prevTeamspaces) => {
          return [...prevTeamspaces, { ...data, id: id }];
        });
        batch.commit().then(() => console.log(id));
      })
      .catch((err) => console.log(err));
  }

  // Handle update an existing teamspace and push it to firebase
  function onUpdateTeamspace(id, { ...data }) {
    setTeamspaces((prevTeamspaces) => {
      return prevTeamspaces.map((space) => {
        if (space.id === id) {
          return { ...space, ...data };
        } else {
          return space;
        }
      });
    });

    const batch = writeBatch(db);

    const newTeamspace = {
      ...data,
    };

    getDoc(doc(db, 'teamspaces', id))
      .then((docSnapshot) => {
        batch.update(doc(db, 'teamspaces', docSnapshot.id), newTeamspace);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        batch.commit();
      });
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
                  tags={tags}
                  teamspaces={teamspaces}
                />
              }
            />
            <Route
              path="/note/new"
              element={
                <NewNote
                  onSubmit={onCreateNote}
                  onAddTag={addTag}
                  availableTags={tags}
                  isLoggedIn={isLoggedIn}
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
                  teamspaces={teamspaces}
                />
              }
            />
            <Route
              path="/note/:id"
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
                    teamspaces={teamspaces}
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
                    teamspaces={teamspaces}
                  />
                }
              />
            </Route>
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
            <Route
              path="/teamspaces"
              element={
                <Teamspaces
                  lightmode={lightmode}
                  isLoggedIn={isLoggedIn}
                  teamspaces={teamspaces}
                  tags={tags}
                  notes={notesWithTags}
                  setLightmode={handleLightmode}
                />
              }
            />
            <Route
              path="/teamspaces/new"
              element={
                <NewTeamspace
                  onSubmit={onCreateTeamspace}
                  lightmode={lightmode}
                  isLoggedIn={isLoggedIn}
                  teamspaces={teamspaces}
                  tags={tags}
                  notes={notesWithTags}
                  setLightmode={handleLightmode}
                />
              }
            />
            <Route
              path={'/teamspace/:id'}
              element={
                <TeamspaceLayout
                  lightmode={lightmode}
                  setLightmode={handleLightmode}
                  teamspaces={teamspaces}
                />
              }
            >
              <Route
                index
                element={
                  <Teamspace
                    notes={notesWithTags}
                    tags={tags}
                    lightmode={lightmode}
                    teamspaces={teamspaces}
                    setLightmode={handleLightmode}
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route
                path="edit"
                element={
                  <EditTeamspace
                    onSubmit={onUpdateTeamspace}
                    lightmode={lightmode}
                    isLoggedIn={isLoggedIn}
                    teamspaces={teamspaces}
                    tags={tags}
                    notes={notesWithTags}
                    setLightmode={handleLightmode}
                  />
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Notification />
        </BrowserRouter>
      </NotificationContextProvider>
    </Container>
  );
}

export default App;
