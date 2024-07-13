import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ".././flipTransition.css";

const FlipTransition = ({ children, location }) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames="flip" timeout={1500}>
      {children}
    </CSSTransition>
  </TransitionGroup>
);

export default FlipTransition;
