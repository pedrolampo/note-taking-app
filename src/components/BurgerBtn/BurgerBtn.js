import React from 'react';

import { burgerMenuIcon } from '../../utils/icons';

export default function BurgerBtn({ action }) {
  return (
    <div className="burger-btn" onClick={() => action(true)}>
      {burgerMenuIcon}
    </div>
  );
}
