import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Stack,
} from 'react-bootstrap';
import SideBar from '../../components/SideBar/SideBar';
import { moon, sun } from '../../utils/icons';

import './Teamspaces.css';

const Teamspaces = ({
  isLoggedIn,
  lightmode,
  teamspaces,
  tags,
  notes,
  setLightmode,
}) => {
  // if (!isLoggedIn) {
  //   return <Navigate to="/" replace={true} />;
  // }

  return (
    <Row className="teamspaces-main-container">
      <Col>
        <SideBar
          tags={tags}
          notes={notes}
          lightmode={lightmode}
          teamspaces={teamspaces}
          isLoggedIn={isLoggedIn}
        />
      </Col>

      <Col>
        <Container>
          <Row className="align-items-end justify-content-end mb-4">
            <Col>
              <h1 className="note-title">My Teamspaces</h1>
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

          <Container className="teamspaces align-items-center">
            <Row
              xs={1}
              sm={2}
              lg={3}
              className="align-items-center justify-content-center"
            >
              {teamspaces.map((el) => (
                <Card as={Link} to={`/teamspace/${el.id}`} key={el.id}>
                  <Card.Body>
                    <Stack gap={2} className="h-100">
                      <span className="card-title">{el.name}</span>
                      <Stack gap={1} direction="vertical" className="flex-wrap">
                        <Badge className="text-truncate bg-secondary">
                          Members: {el.collaborators.length}
                        </Badge>
                        <Badge className="text-truncate bg-secondary">
                          Notes:{' '}
                          {
                            notes.filter((note) =>
                              note.teamspaces?.includes(el.id)
                            ).length
                          }
                        </Badge>
                      </Stack>
                    </Stack>
                  </Card.Body>
                </Card>
              ))}
              <Card as={Link} to="/teamspaces/new">
                <Card.Body>
                  <Stack
                    gap={2}
                    className="align-items-center justify-content-center h-100"
                  >
                    <span className="card-title">New Teamspace</span>
                  </Stack>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </Container>
      </Col>
    </Row>
  );
};

export default Teamspaces;
