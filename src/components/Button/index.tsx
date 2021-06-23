import React from 'react';
import { VscTriangleRight } from 'react-icons/vsc';

const Button: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}> = ({ onClick, style, children }) => {
  return (
    <button style={{ ...styles.appButton, ...style }} onClick={onClick}>
      <h3>{children}</h3>
    </button>
  );
};

const styles: StyleSheets = {
  appButton: {
    height: '3rem',
    width: '11rem',

    // marginTop: '1rem',

    border: 0,
    borderStyle: 'solid',
    borderRadius: '100rem',

    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: 'Red Hat Display, sans-serif',
  },
};

export default Button;
