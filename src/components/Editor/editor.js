import React, { ComponentProps } from 'react';
import { Editor, EditorState, RichUtils, ContentBlock, DefaultDraftBlockRenderMap, CompositeDecorator } from 'draft-js';
import Immutable from 'immutable';

import 'draft-js/dist/Draft.css';
import './editor.scss';

import Controls from './controls';
import HyperLinkModal from './HyperlinkModal';
import Portal from '../Utils/Portal';

/* CUSTOM COMPONENTS */

/**
 * Wrapper component for code block
 * @param {ComponentProps} props
 */
const CustomCodeBlock = props => <pre className="CodeBlockWrapper">{props.children}</pre>;

/**
 * Wrapper component for blockquote
 * @param {ComponentProps} props
 */
const CustomBlockquote = props => <div className="BlockquoteWrapper">{props.children}</div>;

const Link = (props) => {
  return (
    <a href="" className="Link">
      {props.children}
    </a>
  );
};

/**
 * Returns custom className for content blocks
 * @param {ContentBlock} contentBlock
 */
function customBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  switch (type) {
    case 'blockquote':
      return 'BlockQuoteStyle';
    case 'code-block':
      return 'CodeBlockStyle';
  }
}

/**
 * Includes all custom block elements with HTML element name and wrapper components
 */
const customBlockRenderMap = Immutable.Map({
  'code-block': {
    element: 'pre',
    wrapper: <CustomCodeBlock />
  },
  blockquote: {
    element: 'blockquote',
    wrapper: <CustomBlockquote />
  }
});

/**
 * Custom inline styles mapped
 */
const customStyleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  CODE: {
    background: '#535353',
    borderRadius: '3px',
    fontFamily: 'monospace',
    color: 'white',
    padding: '0 3px'
  }
};

/**
 * Extended default block render map
 */
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(customBlockRenderMap);

const initialLinkModalState = { open: false, linkName: '', linkUrl: '' };
const { NEW_LINK, EXISTING_LINK, SUBMIT, CANCEL } = {
  NEW_LINK: 'NEW_LINK',
  EXISTING_LINK: 'EXISTING_LINK',
  SUBMIT: 'SUBMIT',
  CANCEL: 'CANCEL'
};
const linkModalReducer = (state, action) => {
  switch(action.type) {
    case NEW_LINK:
      return {}
  }
}

/**
 * Main component for markdown editor
 */
function MarkdownEditor() {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty(decorator));

  const [state, dispatch] = useReducer();
  const [modalState, setModalState] = React.useState(false);

  const decorator = new CompositeDecorator([
    {
      strategy: () => {},
      component: Link
    }
  ]);

  /**
   * Toggles block style type
   * @param {string} type - Blocktype
   */
  const toggleBlockType = type => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  /**
   * Toggles inline style type
   * @param {string} type - Inline style type
   */
  const toggleInlineStyle = type => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, type));
  };

  const openLinkModal = (e) => {
    e.preventDefault();
    setModalState(true);
  }

  const setLinkToEditorState = (linkName, linkUrl) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { linkName, linkUrl }
    );
    console.log(contentStateWithEntity);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  }

  return (
    <>
      <Controls editorState={editorState} toggleBlock={toggleBlockType} toggleInline={toggleInlineStyle} />
      <Editor
        editorState={editorState}
        onChange={state => {
          setEditorState(state);
        }}
        blockStyleFn={customBlockStyleFn}
        blockRenderMap={extendedBlockRenderMap}
        customStyleMap={customStyleMap}
      />
      <button onClick={() => setModalState(true)}>Open modal</button>
      {modalState ? (
        <Portal>
          <HyperLinkModal 
            editorState={editorState} 
            onClose={() => setModalState(false)}
            onSubmit={setLinkToEditorState}
          />
        </Portal>
      ) : null}
    </>
  );
}

export default MarkdownEditor;
