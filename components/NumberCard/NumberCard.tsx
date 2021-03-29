import * as React from 'react';
import { cardColorMap } from '../../constant';
import styles from './NumberCard.module.scss';

interface INumberCardProps {
  children: string;
}

const NumberCard: React.FunctionComponent<INumberCardProps> = (props) => {
  return (
    <div style={{ borderColor: cardColorMap[props.children] }} className={styles.numberCard}>
      <p style={{ color: cardColorMap[props.children] }}>{props.children}</p>
    </div>
  );
};

export default NumberCard;
