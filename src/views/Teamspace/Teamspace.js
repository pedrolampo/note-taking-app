import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import SideBar from '../../components/SideBar/SideBar';
import TeamspaceCard from '../../components/TeamspaceCard/TeamspaceCard';
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu';
import useWindowDimensions from '../../utils/getWindowDimensions';

import './Teamspace.css';
import { moon, sun } from '../../utils/icons';
import BurgerBtn from '../../components/BurgerBtn/BurgerBtn';
import { getUserData } from '../../utils/getUserData';

export default function Teamspace({
  tags,
  notes,
  teamspaces,
  lightmode,
  setLightmode,
  isLoggedIn,
}) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const { id } = useParams();

  const currentTeamspace = teamspaces.find((tspace) => tspace.id === id);

  const windowDimensions = useWindowDimensions();

  const filteredNotes = notes.filter((note) =>
    note.teamspaces?.includes(currentTeamspace.id)
  );

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
    <Row className="teamspace-main-container">
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
        <Container className="teamspace-container">
          <Row className="align-items-center mb-5">
            <Col>
              <h1 className="note-title">{currentTeamspace?.name} Teamspace</h1>
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
                {currentTeamspace.uid === getUserData().uid && (
                  <Link
                    style={{ pointerEvents: !isLoggedIn && 'none' }}
                    to={`/teamspace/${id}/edit`}
                  >
                    <Button
                      disabled={!isLoggedIn}
                      className={lightmode ? undefined : 'white-text'}
                      variant={lightmode ? 'primary' : 'outline-primary'}
                    >
                      Edit
                    </Button>
                  </Link>
                )}
                <Link to="/">
                  <Button
                    className={lightmode ? undefined : 'white-text'}
                    variant={lightmode ? 'secondary' : 'outline-secondary'}
                  >
                    Home
                  </Button>
                </Link>
              </Stack>
            </Col>
            {windowDimensions.width < 1100 && (
              <Col>
                <BurgerBtn action={setIsBurgerOpen} />
              </Col>
            )}
          </Row>

          {!filteredNotes.length ? (
            <span className="empty-teamspace">
              Such emptiness...
              <br />
              Try adding some notes to the Teamspace
            </span>
          ) : (
            <Row xs={1} sm={1} lg={2} xl={2} className="g-5">
              {filteredNotes.map((note) => (
                <Col key={note.id}>
                  <TeamspaceCard
                    id={note.id}
                    title={note.title}
                    tags={note.tags}
                    isPrivate={note.private}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </Col>
    </Row>
  );
}
