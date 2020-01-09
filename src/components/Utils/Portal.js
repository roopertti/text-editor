import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * usePortal hook
 */
function usePortal() {
  const rootRef = useRef(null);

  /**
   * Returns portal root element reference
   */
  function getRootRef() {
    if (!rootRef.current) {
      rootRef.current = document.createElement('div');
    }

    return rootRef.current;
  }

  /**
   * useEffect hook that appends root element to the dom. Removes root ref on unmount
   */
  useEffect(() => {
    const parent = document.querySelector('#modal-root');
    parent.appendChild(rootRef.current);

    return function() {
      rootRef.current.remove();
    };
  }, []);

  return getRootRef();
}

/**
 * Portal component
 * @param {Props} props
 */
const Portal = props => {
  const container = usePortal();
  return ReactDOM.createPortal(props.children, container);
};

export default Portal;
