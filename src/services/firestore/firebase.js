import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDocs, collection, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
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
        rej(`Error obtaining tags: ${err}`);
      });
  });
};

export const getTodos = (key, op, owner) => {
  return new Promise((res, rej) => {
    if (owner == null) return;
    const collectionQuery = query(
      collection(db, 'todos'),
      where(key, op, owner)
    );

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const todos = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        res(todos);
      })
      .catch((err) => {
        rej(`Error obtaining to do's: ${err}`);
      });
  });
};

export const searchUsers = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'users'), where(key, op, value))
        : collection(db, 'users');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const users = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        res(users);
      })
      .catch((err) => {
        rej(`Error obtaining users: ${err}`);
      });
  });
};

export const getPass = () => {
  return new Promise((res, rej) => {
    getDoc(doc(db, 'data', process.env.REACT_APP_passId))
      .then((querySnapshot) => {
        res(querySnapshot.data().pass);
      })
      .catch((err) => {
        rej(`error al obtener los datos: ${err}`);
      });
  });
};

export const getPowerUsers = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'users'), where(key, op, value))
        : collection(db, 'users');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const users = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        res(users.filter((user) => user.poweruser));
      })
      .catch((err) => {
        rej(`Error obtaining users: ${err}`);
      });
  });
};

export const getTeamspaces = (key, op, value) => {
  return new Promise((res, rej) => {
    const collectionQuery =
      key && op && value
        ? query(collection(db, 'teamspaces'), where(key, op, value))
        : collection(db, 'teamspaces');

    getDocs(collectionQuery)
      .then((querySnapshot) => {
        const teamspaces = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        res(teamspaces);
      })
      .catch((err) => {
        rej(`Error obtaining teamspaces: ${err}`);
      });
  });
};
