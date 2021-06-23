import React from 'react';

const Input: React.FC<React.HTMLProps<HTMLInputElement>> = (props) => {
  const { children, style, ...newProps } = props;

  return (
    <input
      style={{
        ...styles.input,
        ...style,
      }}
      {...newProps}
    />
  );
};

const styles: StyleSheets = {
  input: {
    height: '3rem',
    width: '15rem',

    paddingLeft: '2rem',
    paddingRight: '2rem',

    border: 0,
    borderStyle: 'solid',
    borderRadius: '100rem',

    fontFamily: 'Red Hat Display, sans-serif',
    fontSize: '1.3rem',
  },
};

export default Input;
