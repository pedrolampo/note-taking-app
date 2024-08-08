import { Link } from 'react-router-dom';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import { useTeamspace } from '../../views/TeamspaceLayout/TeamspaceLayout';
import TeamspaceForm from '../TeamspaceForm/TeamspaceForm';
import { moon, sun } from '../../utils/icons';

import './EditTeamspace.css';
import { getUserData } from '../../utils/getUserData';

export default function EditTeamspace({
  lightmode,
  teamspaces,
  isLoggedIn,
  setLightmode,
  tags,
  notes,
  onSubmit,
}) {
  const teamspace = useTeamspace();

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
              <h1 className="note-title">Edit Teamspace</h1>
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
                <Link to="..">
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
            <TeamspaceForm
              title={teamspace.name}
              collaborators={teamspace.collaborators.filter(
                (el) => el.uid !== getUserData()?.uid
              )}
              uid={teamspace.uid}
              onSubmit={(data) => onSubmit(teamspace.id, data)}
              isLoggedIn={isLoggedIn}
              lightmode={lightmode}
              teamspaces={teamspaces}
            />
          </Container>
        </Container>
      </Col>
    </Row>
  );
}
