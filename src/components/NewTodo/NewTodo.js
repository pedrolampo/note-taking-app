import React, { useRef, useState } from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';

import { moon, sun } from '../../utils/icons';
import { getUserData } from '../../utils/getUserData';

export default function NewTodo({
  onSubmit,
  lightmode,
  setLightmode,
  isLoggedIn,
}) {
  const titleRef = useRef();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ label: 'Todo', value: 'todo' });
  const [category, setCategory] = useState({ label: 'Work', value: 'work' });
  const [priority, setPriority] = useState({ label: 'High', value: 'high' });

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
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: '#fff',
    }),
    singleValueHover: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: 'red',
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
      backgroundColor: '#2b2a34',
      color: '#fff',
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: '#2b2a34',
      color: '#fff',
    }),
  };

  const statusOptions = [
    { label: 'Todo', value: 'todo' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Done', value: 'done' },
  ];
  const categoryOptions = [
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
  ];
  const priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current.value,
      status: status,
      category: category,
      priority: priority,
      owner: getUserData()?.email,
    });

    navigate('/tasks');
  }

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="note-title">New Task</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            {lightmode ? (
              <div
                className="lightmode-icons"
                onClick={() => setLightmode(false)}
              >
                <svg>
                  <path d={moon}></path>
                </svg>
              </div>
            ) : (
              <div
                className="lightmode-icons"
                onClick={() => setLightmode(true)}
              >
                <svg className="sun">
                  <path d={sun}></path>
                </svg>
              </div>
            )}
          </Stack>
        </Col>
      </Row>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <Row className="mb-3">
          <Col>
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" ref={titleRef} required />
          </Col>
          <Col>
            <Form.Label>Status</Form.Label>
            <ReactSelect
              className="select"
              styles={lightmode ? undefined : selectStyles}
              defaultValue={statusOptions[0]}
              options={statusOptions}
              onChange={setStatus}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Category</Form.Label>
            <ReactSelect
              className="select"
              styles={lightmode ? undefined : selectStyles}
              defaultValue={categoryOptions[0]}
              options={categoryOptions}
              onChange={setCategory}
            />
          </Col>
          <Col>
            <Form.Label>Priority</Form.Label>
            <ReactSelect
              className="select"
              styles={lightmode ? undefined : selectStyles}
              defaultValue={priorityOptions[0]}
              options={priorityOptions}
              onChange={setPriority}
            />
          </Col>
        </Row>

        <Stack
          direction="horizontal"
          gap={2}
          className="justify-content-end mt-4"
        >
          {isLoggedIn && (
            <Button
              disabled={!isLoggedIn}
              type="submit"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'primary' : 'outline-primary'}
            >
              Save
            </Button>
          )}
          <Link to="/tasks">
            <Button
              type="button"
              className={lightmode ? undefined : 'white-text'}
              variant={lightmode ? 'secondary' : 'outline-secondary'}
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Form>
    </>
  );
}
