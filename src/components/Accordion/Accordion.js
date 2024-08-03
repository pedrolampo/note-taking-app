import { useEffect, useMemo, useState } from 'react';
import './Accordion.css';
import { Link } from 'react-router-dom';

export default function Accordion({ tag, notes, lightmode }) {
  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.tags.some((noteTag) => noteTag.id === tag.id)
    );
  }, [tag, notes]);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentNotes, setCurrentNotes] = useState(5);
  const [slicedItems, setSlicedItems] = useState(filteredNotes?.slice(0, 5));

  useEffect(() => {
    setSlicedItems(filteredNotes?.slice(0, currentNotes));
  }, [filteredNotes, currentNotes]);

  return (
    <div className="accordion">
      <div
        className={`accordion-header ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <span>{tag.label}</span>
        <img
          src={
            lightmode
              ? '/media/images/dropdown-arrow-light.png'
              : '/media/images/dropdown-arrow.png'
          }
          alt="dropdown arrow"
        />
      </div>
      <div className={`accordion-body ${isCollapsed ? 'collapsed' : ''}`}>
        {slicedItems?.map((note) => (
          <Link
            to={`/${note.id}`}
            key={note.id}
            className={`accordion-body-note`}
          >
            <span>{note.title}</span>
            <span className="accordion-note-qty">{note.qty}</span>
          </Link>
        ))}
        {currentNotes < filteredNotes?.length && (
          <span
            className="see-more"
            onClick={() => setCurrentNotes((prev) => prev + 5)}
          >
            See more
          </span>
        )}
      </div>
    </div>
  );
}
