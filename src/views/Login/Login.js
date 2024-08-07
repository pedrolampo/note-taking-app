import { useState, useContext } from 'react';
import './Login.css';
import UserContext from '../../context/UserContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';

const Login = ({ setIsLoggedIn, lightmode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    let userData = document.querySelectorAll('.loginInput');

    if (userData[0].value.length > 0 && userData[1].value.length > 0) {
      let email = userData[0].value;
      let password = userData[1].value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          login(user);
          navigate('/');
          setIsLoggedIn(true);
          setNotification('success', 'Successfully logged in');
        })
        .catch((error) => {
          console.log(error);
          setNotification('error', 'Wrong email or pass');
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
          <h1 className="note-title">Log In</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/">
              <Button
                className={lightmode ? undefined : 'white-text'}
                variant={lightmode ? 'secondary' : 'outline-secondary'}
              >
                Back
              </Button>
            </Link>
          </Stack>
        </Col>
      </Row>

      <Container xs="auto" className="loginContainer">
        <Form className="login-form" onSubmit={handleLogin}>
          <Row>
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="loginInput"
              type="text"
              value={username}
              required
              onChange={({ target }) => setUsername(target.value)}
            />
          </Row>
          <Row>
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="loginInput"
              type="password"
              value={password}
              required
              onChange={({ target }) => setPassword(target.value)}
            />
          </Row>
          <Row>
            <Stack
              gap={4}
              direction="horizontal"
              className="justify-content-center mt-4"
            >
              <Link className="createUser" to={'/createUser'}>
                <Button
                  className={lightmode ? undefined : 'white-text'}
                  variant={lightmode ? 'secondary' : 'outline-secondary'}
                  type="button"
                >
                  Create User
                </Button>
              </Link>
              <Button
                className={lightmode ? undefined : 'white-text'}
                variant={lightmode ? 'primary' : 'outline-primary'}
                type="submit"
              >
                Log In
              </Button>
            </Stack>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default Login;
