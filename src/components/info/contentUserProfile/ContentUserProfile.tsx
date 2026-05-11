import { HeaderActividad } from '../../Headers/HeaderActividad/HeaderActividad';
import styles from './ContentUserProfile.module.css';
import { Left } from './left/Left';
import { UserInfo } from './Right/UserInfo/UserInfo';
import { ClinicalProfile } from '../../profile/ClinicalProfile';
import { ObstetricFormula } from '../../profile/ObstetricFormula';

export const ContentUserProfile = () => {
  return (
    <div className={styles.mainWrapper}>
      <HeaderActividad />

      <section className={styles.container}>
        <div className={styles.sidebar}>
          <Left />
        </div>

        <div className={styles.contentArea}>
          <UserInfo />
          <div className={styles.medicalInfo}>
            <ObstetricFormula />
            <ClinicalProfile />
          </div>
        </div>
      </section>
    </div>
  );
};
