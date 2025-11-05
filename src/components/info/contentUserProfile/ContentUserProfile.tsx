import { HeaderActividad } from '../../Headers/HeaderActividad/HeaderActividad';
import styles from './ContentUserProfile.module.css';
import { Left } from './left/Left';

import { UserInfo } from './Right/UserInfo/UserInfo';

export const ContentUserProfile = () => {
  return (
    <div>
      <HeaderActividad />

      <section className={styles.container}>
        <Left />

        <UserInfo />
      </section>
    </div>
  );
};
