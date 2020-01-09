import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight, faListOl, faListUl, faCode, faLink, faImage, faFileCode, faTable, faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';

/**
 * Editor controls
 */
const CONTROLS = [
  { label: 'H1', style: 'header-one', icon: null, type: 'block', tooltip: 'Heading 1' },
  { label: 'H2', style: 'header-two', icon: null, type: 'block', tooltip: 'Heading 2' },
  { label: 'H3', style: 'header-three', icon: null, type: 'block', tooltip: 'Heading 3' },
  { label: 'BLOCKQUOTE', style: 'blockquote', icon: faQuoteRight, type: 'block', tooltip: 'Blockquote' },
  { label: 'UL', style: 'unordered-list-item', icon: faListUl, type: 'block', tooltip: 'Unordered List' },
  { label: 'OL', style: 'ordered-list-item', icon: faListOl, type: 'block', tooltip: 'Ordered List' },
  { label: 'CODEBLOCK', style: 'code-block', icon: faFileCode, type: 'block', tooltip: 'Code Block' },
  { label: 'B', style: 'BOLD', icon: null, type: 'inline', tooltip: 'Bold' },
  { label: 'I', style: 'ITALIC', icon: null, type: 'inline', tooltip: 'Italic' },
  { label: 'U', style: 'UNDERLINE', icon: null, type: 'inline', tooltip: 'Underline' },
  { label: 'CODE', style: 'CODE', icon: faCode, type: 'inline', tooltip: 'Code Inline' },
  { label: 'STRIKETHROUGH', style: 'STRIKETHROUGH', icon: faStrikethrough, type: 'inline', tooltip: 'Strikethrough' },
  { label: 'LINK', style: 'LINK', icon: faLink, type: 'inline', tooltip: 'Hyperlink' }
];

/**
 * Component for editor controls
 * @param {*} props
 */
function Controls(props) {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const inlineStyle = editorState.getCurrentInlineStyle();

  /**
   * Toggles controls on/off
   * @param {MouseEvent} e - Mouse event to be prevented to avoid loss of editor focus
   * @param {string} type - Type of editor control (inline|block)
   * @param {string} style - Style of Draft-js block/inline type
   */
  const toggleControl = (e, type, style) => {
    e.preventDefault();
    switch (type) {
      case 'inline':
        props.toggleInline(style);
        return;
      case 'block':
        props.toggleBlock(style);
        return;
    }
  };

  /**
   * Return style class for control
   * @param {string} style - Style of block
   */
  const toggleActive = style => (blockType === style || inlineStyle.has(style) ? 'editor-btn-active' : 'editor-btn');

  /**
   * Renders set of controls from given label array
   * @param {Array.<string>} labels
   */
  const renderSetOfControls = labels =>
    CONTROLS.filter(ctrl => labels.includes(ctrl.label)).map(({ label, style, icon, type, tooltip }) => (
      <button
        key={label}
        className={[toggleActive(style), 'tooltip'].join(' ')}
        data-title={tooltip}
        onMouseDown={e => toggleControl(e, type, style)}
      >
        {icon ? <FontAwesomeIcon icon={icon} /> : label}
      </button>
    ));

  /**
   * Renders buttons for block types
   */
  const renderButtons = () => (
    <>
      <div>{renderSetOfControls(['B', 'I', 'U', 'CODE', 'STRIKETHROUGH'])}</div>
      <div className="editor-divider"></div>
      <div>{renderSetOfControls(['H1', 'H2', 'H3'])}</div>
      <div className="editor-divider"></div>
      <div>{renderSetOfControls(['UL', 'OL'])}</div>
      <div className="editor-divider"></div>
      <div>{renderSetOfControls(['BLOCKQUOTE', 'CODEBLOCK', 'LINK'])}</div>
    </>
  );

  return <div className="editor-controls">{renderButtons()}</div>;
}

Controls.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  toggleBlock: PropTypes.func,
  toggleInline: PropTypes.func
};

export default Controls;
