import { useContext, useEffect, useRef, useState } from 'react';
import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getUserData } from '../../utils/getUserData';

import './TeamspaceForm.css';
import { searchUsers } from '../../services/firestore/firebase';
import { NotificationContext } from '../../context/NotificationContext';

export default function TeamspaceForm({
  onSubmit,
  title = '',
  uid = '',
  collaborators = [],
  lightmode,
  isLoggedIn,
  teamspaces,
}) {
  const titleRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] =
    useState(collaborators);
  const { setNotification } = useContext(NotificationContext);

  const navigate = useNavigate();

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? '#444' : '#2b2a34',
      color: '#fff',
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: '#fff',
    }),
    multiValue: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#666',
    }),
    multiValueLabel: (baseStyles) => ({
      ...baseStyles,
      color: '#fff',
      backgroundColor: '#666',
    }),
    multiValueRemove: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#666',
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#444',
      color: '#fff',
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#444',
      color: '#fff',
    }),
  };

  function checkIfOwner(uid) {
    if (window.location.href.includes('/new')) return true;
    if (uid === getUserData()?.uid) return true;
    else return false;
  }

  function handleSubmit(e) {
    e.preventDefault();

    for (let el of teamspaces) {
      if (
        titleRef.current.value === el.name &&
        window.location.href.includes('/new')
      ) {
        setNotification(
          'success', // I know, it's contradictory, but error text is just ugly
          'Error: already exists a Teamspace with that name'
        );
        return;
      }
    }

    onSubmit({
      name: titleRef.current.value,
      uid: getUserData()?.uid,
      collaborators: [
        ...selectedCollaborators,
        {
          uid: getUserData()?.uid,
          name: users.find((user) => user.uid === getUserData()?.uid).name,
        },
      ],
    });

    navigate('..');
  }

  useEffect(() => {
    searchUsers().then((data) => {
      setUsers(data);
    });
    setSelectedCollaborators(collaborators);
  }, []); //eslint-disable-line

  return (
    <Form className="teamspace-form" onSubmit={(e) => handleSubmit(e)}>
      <Stack gap={4}>
        <Row className="title-row">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <Row className="title-row">
          <Col>
            <Form.Group controlId="teamspaces">
              <Form.Label>Collaborators</Form.Label>
              <Select
                isMulti
                styles={lightmode ? undefined : selectStyles}
                value={selectedCollaborators?.map((user) => {
                  return {
                    label: user?.name,
                    value: user?.uid,
                  };
                })}
                options={users
                  ?.filter((el) => el.uid !== getUserData()?.uid)
                  ?.map((user) => {
                    return {
                      label: user.name,
                      value: user.uid,
                    };
                  })}
                onChange={(users) => {
                  setSelectedCollaborators(
                    users?.map((user) => {
                      return { uid: user.value, name: user.label };
                    })
                  );
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Stack direction="horizontal" gap={2} className="justify-content-end">
          {isLoggedIn && checkIfOwner(uid) && (
            <Button
              disabled={!isLoggedIn}
              type="submit"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'primary' : 'outline-primary'}
            >
              Save
            </Button>
          )}
          <Link to="..">
            <Button
              type="button"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'secondary' : 'outline-secondary'}
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
