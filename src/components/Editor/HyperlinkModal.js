import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import PropTypes from 'prop-types';

function HyperlinkModal(props) {
  /**
   * Reference to modal
   */
  const modalRef = useRef(null);

  /**
   * Initial Modal State
   */
  const initialModalState = { linkName: '', linkUrl: '' };

  /**
   * Modal state value and update function
   */
  const [modalState, setModalState] = useState(initialModalState);

  /**
   * useEffect hook, which adds and removes click event listener
   */
  useEffect(() => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    if(!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLink = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLink.getEntityAt(startOffset);

      if(linkKey) {
        const linkEntity = contentState.getEntity(linkKey);
        const { linkName, linkUrl } = linkEntity.getData();
        setModalState({ linkName, linkUrl });
      }
    }
    document.addEventListener('click', checkClickTarget);

    return function() {
      document.removeEventListener('click', checkClickTarget);
    };
  }, [checkClickTarget]);

  /**
   * Checks click target, close modal when backdrop is clicked
   * @param {MouseEvent} e
   */
  const checkClickTarget = e => {
    if (!modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  /**
   * Receives input events and updates the state of inputs
   * @param {InputEvent} e 
   */
  const handleInput = e => {
    const { name, value } = e.target;
    setModalState({ ...modalState, [name]: value });
  };

  const submitLink = e => {
    e.preventDefault();
    const { linkName, linkUrl } = modalState;
    console.log("submitting new link")
    props.onSubmit(linkName, linkUrl);
    props.onClose();
  }

  /**
   * Close with onClose method passed as prop
   */
  const closeModal = () => props.onClose();

  return (
    <div className="hyperlink-modal-backdrop">
      <div className="hyperlink-modal" ref={modalRef}>
        <h3>Add hyperlink</h3>
        <label>
          <input type="text" name="linkName" value={modalState.linkName} onChange={handleInput} placeholder="Link name..." autoFocus />
        </label>
        <label>
          <input type="text" name="linkUrl" value={modalState.linkUrl} onChange={handleInput} placeholder="Link address..." />
        </label>
        <div>
          <button 
            className="primary-btn-full"
            onClick={submitLink}
          >
            OK
          </button>
          <button onClick={() => closeModal()} className="default-btn-raised">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

HyperlinkModal.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

export default HyperlinkModal;
