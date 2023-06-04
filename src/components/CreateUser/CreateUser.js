import { useContext } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { NotificationContext } from '../../context/NotificationContext';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firestore/firebase';
import './CreateUser.css';
import UserContext from '../../context/UserContext';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';

const CreateUser = () => {
  const { user } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let accountInfo = document.querySelectorAll('.create-acc-input');
    const auth = getAuth();

    const emailCheck = () => {
      if (accountInfo[1].value.length) {
        if (
          accountInfo[1].value.includes('@') &&
          accountInfo[1].value.includes('.com')
        ) {
          return true;
        }
      }
    };
    let validEmail = emailCheck();

    if (
      accountInfo[0].value.length &&
      accountInfo[1].value.length &&
      accountInfo[2].value.length &&
      accountInfo[3].value.length &&
      accountInfo[2].value === accountInfo[3].value &&
      validEmail
    ) {
      let email = accountInfo[1].value;
      let password = accountInfo[2].value;

      const userData = {
        name: accountInfo[0].value,
        email: accountInfo[1].value,
        password: accountInfo[2].value,
        poweruser: false,
        date: Timestamp.fromDate(new Date()),
      };

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          addDoc(collection(db, 'users'), userData).catch((err) => {
            console.log(err);
          });
          setNotification('success', `Success`);
          navigate('/login');
        })
        .catch((error) => {
          console.log(error);
          setNotification('error', `Error: email's already taken`);
        });
    } else setNotification('error', 'Error');
  };

  if (user) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Row className="align-items-end justify-content-end mb-4">
        <Col>
          <h1 className="note-title">Create User</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/login">
              <Button className="white-text" variant="outline-secondary">
                Back
              </Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <Container className="createAccContainer">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Label>Full Name</Form.Label>
            <Form.Control className="create-acc-input" type="text" />
          </Row>
          <Row>
            <Form.Label>Email</Form.Label>
            <Form.Control className="create-acc-input" type="text" />
          </Row>
          <Row>
            <Form.Label>Password</Form.Label>
            <Form.Control className="create-acc-input" type="password" />
          </Row>
          <Row>
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control className="create-acc-input" type="password" />
          </Row>
          <Row className="mt-4 justify-content-end" xs="auto">
            <Button
              variant="outline-primary"
              className="button createUserButton white-text"
              type="submit"
            >
              Confirm
            </Button>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default CreateUser;
