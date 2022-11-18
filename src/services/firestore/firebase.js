import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDocs, collection, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAXQsJcQZ6AOCc7dX0Nuf0yojzPR6y34sA',
  authDomain: 'note-taking-app-a2250.firebaseapp.com',
  projectId: 'note-taking-app-a2250',
  storageBucket: 'note-taking-app-a2250.appspot.com',
  messagingSenderId: '301706468175',
  appId: '1:301706468175:web:97d4319d4d4a1fa47a833a',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const getNotes = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'notes'), where('category', '==', value))
        : collection(db, 'notes');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const notes = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        res(notes);
      })
      .catch((err) => {
        rej(`Error obtaining notes: ${err}`);
      });
  });
};

export const getTags = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'tags'), where('category', '==', value))
        : collection(db, 'tags');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const tags = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        res(tags);
      })
      .catch((err) => {
        rej(`Error obtaining tags: ${err}`);
      });
  });
};

export const searchTagsId = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'tags'), where('id', '==', value))
        : collection(db, 'tags');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const tags = querySnapshot.docs.map((doc) => {
          return doc.id;
        });
        res(tags);
      })
      .catch((err) => {
        rej(`Error al obtener las recetas: ${err}`);
      });
  });
};

export const getPass = () => {
  return new Promise((res, rej) => {
    getDoc(doc(db, 'data', '2gPvhD957QgKdgKAAvij'))
      .then((querySnapshot) => {
        res(querySnapshot.data().pass);
      })
      .catch((err) => {
        rej(`error al obtener los datos: ${err}`);
      });
  });
};
