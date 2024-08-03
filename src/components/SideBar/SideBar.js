import { Link } from 'react-router-dom';
import Accordion from '../Accordion/Accordion';

import './SideBar.css';

export default function SideBar({ tags, notes, lightmode }) {
  const sortedTags = tags.sort((a, b) => {
    if (a.label.toLowerCase() < b.label.toLowerCase()) {
      return -1;
    }
    if (a.label.toLowerCase() > b.label.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="sidebar">
      <Link to="/">
        <h4>Peter's Notes</h4>
      </Link>

      {sortedTags.map((tag) => (
        <Accordion tag={tag} notes={notes} lightmode={lightmode} key={tag.id} />
      ))}
    </div>
  );
}
