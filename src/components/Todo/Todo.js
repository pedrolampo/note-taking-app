import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row, Stack, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firestore/firebase';
import UserContext from '../../context/UserContext';

import {
  done,
  high,
  inProgress,
  low,
  medium,
  moon,
  personal,
  sun,
  todo,
  work,
  sortArrows,
  sortArrowsDown,
  sortArrowsUp,
  sortArrowsLight,
  sortArrowsLightDown,
  sortArrowsLightUp,
} from '../../utils/icons';

export default function Todo({
  todos,
  lightmode,
  setLightmode,
  setIsLoggedIn,
  setTodos,
  isLoggedIn,
  onDeleteTask,
}) {
  // const [editTaskModalIsOpen, setEditTaskModalIsOpen] = useState(false);
  // const [editTaskId, setEditTaskId] = useState('');
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortType, setSortType] = useState('');

  const { logout } = useContext(UserContext);

  useEffect(() => {
    setSortedTasks(todos);
  }, [todos]);

  function handleLogOut() {
    setIsLoggedIn(false);
    logout();
  }

  function getIcon(value) {
    switch (value) {
      case 'todo':
        return todo;

      case 'inProgress':
        return inProgress;

      case 'done':
        return done;

      case 'high':
        return high;

      case 'medium':
        return medium;

      case 'low':
        return low;

      case 'work':
        return work;

      case 'personal':
        return personal;

      default:
        break;
    }
  }

  function getSortIcon(value) {
    if (lightmode) {
      if (value === sortType && sortOrder === 'desc') {
        return sortArrowsLightUp;
      } else if (value === sortType && sortOrder === 'asc') {
        return sortArrowsLightDown;
      } else return sortArrowsLight;
    }
    if (value === sortType && sortOrder === 'desc') {
      return sortArrowsUp;
    } else if (value === sortType && sortOrder === 'asc') {
      return sortArrowsDown;
    } else return sortArrows;
  }

  async function handleQuickEdit(task, action, value) {
    if (action === 'status') {
      const batch = writeBatch(db);

      const updatedTask = {
        ...task,
        status: {
          value: value,
          label:
            value === 'inProgress'
              ? 'In Progress'
              : value.charAt(0).toUpperCase() + value.slice(1),
        },
      };

      await getDoc(doc(db, 'todos', task.id))
        .then((docSnapshot) => {
          batch.update(doc(db, 'todos', docSnapshot.id), updatedTask);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          batch.commit();
        });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === task.id) {
            return {
              ...todo,
              ...task,
              status: {
                value: value,
                label:
                  value === 'inProgress'
                    ? 'In Progress'
                    : value.charAt(0).toUpperCase() + value.slice(1),
              },
            };
          } else return todo;
        });
      });
    }

    if (action === 'priority') {
      const batch = writeBatch(db);

      const updatedTask = {
        ...task,
        priority: {
          value: value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        },
      };

      await getDoc(doc(db, 'todos', task.id))
        .then((docSnapshot) => {
          batch.update(doc(db, 'todos', docSnapshot.id), updatedTask);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          batch.commit();
        });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === task.id) {
            return {
              ...todo,
              ...task,
              priority: {
                value: value,
                label: value.charAt(0).toUpperCase() + value.slice(1),
              },
            };
          } else return todo;
        });
      });
    }

    if (action === 'category') {
      const batch = writeBatch(db);

      const updatedTask = {
        ...task,
        category: {
          value: value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        },
      };

      await getDoc(doc(db, 'todos', task.id))
        .then((docSnapshot) => {
          batch.update(doc(db, 'todos', docSnapshot.id), updatedTask);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          batch.commit();
        });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === task.id) {
            return {
              ...todo,
              ...task,
              category: {
                value: value,
                label: value.charAt(0).toUpperCase() + value.slice(1),
              },
            };
          } else return todo;
        });
      });
    }
  }

  function sortTable(param) {
    setSortOrder((prevValue) => (prevValue === 'desc' ? 'asc' : 'desc'));

    switch (param) {
      case 'title':
        setSortType('title');
        if (sortOrder === 'asc') {
          setSortedTasks(
            [...todos].sort((a, b) => a.title.localeCompare(b.title))
          );
        } else {
          setSortedTasks(
            [...todos].sort((a, b) => b.title.localeCompare(a.title))
          );
        }
        break;

      case 'status':
        setSortType('status');
        if (sortOrder === 'asc') {
          setSortedTasks(
            [...todos].sort((a, b) =>
              a.status.label.localeCompare(b.status.label)
            )
          );
        } else {
          setSortedTasks(
            [...todos].sort((a, b) =>
              b.status.label.localeCompare(a.status.label)
            )
          );
        }
        break;

      case 'priority':
        setSortType('priority');
        if (sortOrder === 'asc') {
          setSortedTasks(
            [...todos].sort((a, b) =>
              a.priority.label.localeCompare(b.priority.label)
            )
          );
        } else {
          setSortedTasks(
            [...todos].sort((a, b) =>
              b.priority.label.localeCompare(a.priority.label)
            )
          );
        }
        break;

      case 'category':
        setSortType('category');
        if (sortOrder === 'asc') {
          setSortedTasks(
            [...todos].sort((a, b) =>
              a.category.label.localeCompare(b.category.label)
            )
          );
        } else {
          setSortedTasks(
            [...todos].sort((a, b) =>
              b.category.label.localeCompare(a.category.label)
            )
          );
        }
        break;

      default:
        setSortType('');
        return setSortedTasks(todos);
    }
  }

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="note-title">Peter's Notes</h1>
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
            {!isLoggedIn && (
              <Link to="/login">
                <Button
                  className={lightmode ? undefined : 'white-text'}
                  variant={lightmode ? 'primary' : 'outline-primary'}
                >
                  Log In
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/">
                <Button
                  disabled={!isLoggedIn}
                  style={{ display: !isLoggedIn && 'none' }}
                  className={lightmode ? 'todo-btn' : 'white-text todo-btn'}
                  variant={lightmode ? 'secondary' : 'outline-secondary'}
                >
                  Switch to Notes
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Button
                disabled={!isLoggedIn}
                onClick={() => handleLogOut()}
                className={lightmode ? undefined : 'white-text'}
                variant={lightmode ? 'danger' : 'outline-danger'}
              >
                Log Out
              </Button>
            )}
          </Stack>
        </Col>
      </Row>

      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="note-title">Tasks</h2>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            {isLoggedIn && (
              <Link to="/tasks/new">
                <Button
                  disabled={!isLoggedIn}
                  className={lightmode ? undefined : 'white-text'}
                  variant={lightmode ? 'primary' : 'outline-primary'}
                >
                  New
                </Button>
              </Link>
            )}
          </Stack>
        </Col>
      </Row>

      {!todos.length ? (
        <h2 className="no-tasks">You have no tasks</h2>
      ) : (
        <Table
          className="todo-table table-fixed"
          variant={lightmode ? undefined : 'dark'}
          responsive
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th onClick={() => sortTable('title')}>
                Title {getSortIcon('title')}
              </th>
              <th onClick={() => sortTable('status')}>
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => sortTable('priority')}>
                Priority {getSortIcon('priority')}
              </th>
              <th onClick={() => sortTable('category')}>
                Category {getSortIcon('category')}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  <span>
                    {getIcon(task.status.value)} {task.status.label}
                  </span>
                </td>
                <td>
                  <span>
                    {getIcon(task.priority.value)} {task.priority.label}
                  </span>
                </td>
                <td>
                  <span>
                    {getIcon(task.category.value)} {task.category.label}
                  </span>
                </td>
                <td>
                  <Dropdown drop="start" autoClose="outside">
                    <Dropdown.Toggle
                      className="white-text todos-dots"
                      variant="none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 todos-context-menu"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant={lightmode ? undefined : 'dark'}>
                      <Dropdown.Item>
                        <Dropdown drop="start">
                          <Dropdown.Toggle
                            variant="none"
                            className="white-text"
                          >
                            Status
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            variant={lightmode ? undefined : 'dark'}
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'status', 'todo')
                              }
                            >
                              Todo
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'status', 'inProgress')
                              }
                            >
                              In Progress
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'status', 'done')
                              }
                            >
                              Done
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Dropdown drop="start">
                          <Dropdown.Toggle
                            variant="none"
                            className="white-text"
                          >
                            Priority
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            variant={lightmode ? undefined : 'dark'}
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'priority', 'high')
                              }
                            >
                              High
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'priority', 'medium')
                              }
                            >
                              Medium
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'priority', 'low')
                              }
                            >
                              Low
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>

                      <Dropdown.Item>
                        <Dropdown drop="start">
                          <Dropdown.Toggle
                            variant="none"
                            className="white-text"
                          >
                            Category
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            variant={lightmode ? undefined : 'dark'}
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'category', 'work')
                              }
                            >
                              Work
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleQuickEdit(task, 'category', 'personal')
                              }
                            >
                              Personal
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>

                      <Dropdown.Divider />

                      {/* <Dropdown.Item
                      onClick={() => {
                        setEditTaskModalIsOpen(true);
                        setEditTaskId(task.id);
                      }}
                    >
                      Edit
                    </Dropdown.Item> */}
                      <Dropdown.Item onClick={() => onDeleteTask(task.id)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* <EditTaskModal
        show={editTaskModalIsOpen}
        tasks={todos}
        editTaskId={editTaskId}
        handleClose={() => setEditTaskModalIsOpen(false)}
      /> */}
    </>
  );
}

// function EditTaskModal({
//   show,
//   tasks,
//   handleClose,
//   lightmode,
//   onSubmit,
//   isLoggedIn,
//   editTaskId,
// }) {
//   const currentTask = tasks.find((task) => task.id === editTaskId);

//   const titleRef = useRef();
//   console.log(currentTask);
//   const [status, setStatus] = useState(currentTask?.status);
//   const [category, setCategory] = useState(currentTask?.category);
//   const [priority, setPriority] = useState(currentTask?.priority);

//   const selectStyles = {
//     control: (baseStyles, state) => ({
//       ...baseStyles,
//       backgroundColor: state.isFocused ? '#444' : 'transparent',
//       color: '#fff',
//     }),
//     input: (baseStyles) => ({
//       ...baseStyles,
//       color: '#fff',
//     }),
//     multiValue: (baseStyles) => ({
//       ...baseStyles,
//       backgroundColor: '#666',
//     }),
//     singleValue: (baseStyles) => ({
//       ...baseStyles,
//       color: '#fff',
//     }),
//     singleValueHover: (baseStyles) => ({
//       ...baseStyles,
//       backgroundColor: 'red',
//     }),
//     multiValueLabel: (baseStyles) => ({
//       ...baseStyles,
//       color: '#fff',
//       backgroundColor: '#666',
//     }),
//     multiValueRemove: (baseStyles) => ({
//       ...baseStyles,
//       backgroundColor: '#666',
//     }),
//     menu: (baseStyles) => ({
//       ...baseStyles,
//       backgroundColor: '#444',
//       color: '#fff',
//     }),
//     option: (baseStyles) => ({
//       ...baseStyles,
//       backgroundColor: '#444',
//       color: '#fff',
//     }),
//   };

//   const statusOptions = [
//     { label: 'Todo', value: 'todo' },
//     { label: 'In Progress', value: 'inProgress' },
//     { label: 'Done', value: 'done' },
//   ];
//   const categoryOptions = [
//     { label: 'Work', value: 'work' },
//     { label: 'Personal', value: 'personal' },
//   ];
//   const priorityOptions = [
//     { label: 'High', value: 'high' },
//     { label: 'Medium', value: 'medium' },
//     { label: 'Low', value: 'low' },
//   ];

//   function handleSubmit(e) {
//     e.preventDefault();

//     onSubmit({
//       title: titleRef.current.value,
//       status: status,
//       category: category,
//       priority: priority,
//       owner: getUserData()?.email,
//     });
//   }

//   return (
//     <Modal className="modal" show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Task</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={(e) => handleSubmit(e)}>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 ref={titleRef}
//                 defaultValue={currentTask?.title}
//                 required
//               />
//             </Col>
//             <Col>
//               <Form.Label>Status</Form.Label>
//               <ReactSelect
//                 className="select"
//                 styles={lightmode ? undefined : selectStyles}
//                 defaultValue={status}
//                 options={statusOptions}
//                 onChange={setStatus}
//               />
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <Form.Label>Category</Form.Label>
//               <ReactSelect
//                 className="select"
//                 styles={lightmode ? undefined : selectStyles}
//                 defaultValue={category}
//                 options={categoryOptions}
//                 onChange={setCategory}
//               />
//             </Col>
//             <Col>
//               <Form.Label>Priority</Form.Label>
//               <ReactSelect
//                 className="select"
//                 styles={lightmode ? undefined : selectStyles}
//                 defaultValue={priority}
//                 options={priorityOptions}
//                 onChange={setPriority}
//               />
//             </Col>
//           </Row>

//           <Stack
//             direction="horizontal"
//             gap={2}
//             className="justify-content-end mt-4"
//           >
//             {isLoggedIn && (
//               <Button
//                 disabled={!isLoggedIn}
//                 type="submit"
//                 className={lightmode ? undefined : 'white-text'}
//                 variant={lightmode ? 'primary' : 'outline-primary'}
//               >
//                 Save
//               </Button>
//             )}
//             <Link to="/tasks">
//               <Button
//                 type="button"
//                 className={lightmode ? undefined : 'white-text'}
//                 variant={lightmode ? 'secondary' : 'outline-secondary'}
//               >
//                 Cancel
//               </Button>
//             </Link>
//           </Stack>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// }
