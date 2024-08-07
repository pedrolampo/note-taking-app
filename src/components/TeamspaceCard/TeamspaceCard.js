import React from 'react';
import { Badge, Card, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './TeamspaceCard.css';

export default function TeamspaceCard({ id, title, tags, isPrivate }) {
  return (
    <Card
      as={Link}
      to={`/note/${id}`}
      className="h-100 text-reset text-decoration-none teamspace-card"
    >
      <Card.Body>
        <Stack
          gap={4}
          className="align-items-left justify-content-center h-100"
        >
          <span className="fs-4">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-left flex-wrap"
            >
              {isPrivate && (
                <Badge className="text-truncate bg-danger">Private</Badge>
              )}
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}
