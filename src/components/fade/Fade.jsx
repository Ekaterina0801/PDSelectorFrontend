import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Fade.module.scss';

const Fade = ({ in: inProp, children }) => (
  <CSSTransition
    in={inProp}
    timeout={300}
    classNames={{
      enter: styles.fadeEnter,
      enterActive: styles.fadeEnterActive,
      exit: styles.fadeExit,
      exitActive: styles.fadeExitActive,
    }}
    unmountOnExit
  >
    {children}
  </CSSTransition>
);

export default Fade;
