import React from 'react';
import ICardProps from '../../@types/components/card.props';

const index: React.FC<ICardProps> = ({ style, children }) => {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
};

const styles: StyleSheets = {
  card: {
    // backgroundColor: '#fafafa',
    padding: '3rem',
    borderRadius: '2rem',
  },
};

export default index;
