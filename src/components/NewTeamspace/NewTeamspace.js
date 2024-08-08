import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import TeamspaceForm from '../TeamspaceForm/TeamspaceForm';
import useWindowDimensions from '../../utils/getWindowDimensions';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import BurgerBtn from '../BurgerBtn/BurgerBtn';
import { moon, sun } from '../../utils/icons';

import './NewTeamspace.css';

export default function NewTeamspace({
  lightmode,
  teamspaces,
  isLoggedIn,
  setLightmode,
  tags,
  notes,
  onSubmit,
}) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const windowDimensions = useWindowDimensions();

  if (isBurgerOpen) {
    return (
      <BurgerMenu
        notes={notes}
        teamspaces={teamspaces}
        setIsBurgerOpen={setIsBurgerOpen}
        isLoggedIn={isLoggedIn}
      />
    );
  }

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
          <Row className="align-items-center justify-content-end mb-4">
            <Col>
              <h1 className="note-title">New Teamspace</h1>
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
                {windowDimensions.width < 1100 && (
                  <Col>
                    <BurgerBtn action={setIsBurgerOpen} />
                  </Col>
                )}
              </Stack>
            </Col>
          </Row>

          <Container className="teamspaces align-items-center">
            <TeamspaceForm
              onSubmit={onSubmit}
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
