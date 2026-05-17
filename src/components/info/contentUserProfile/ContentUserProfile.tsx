import { useState } from 'react';
import { HeaderActividad } from '../../Headers/HeaderActividad/HeaderActividad';
import styles from './ContentUserProfile.module.css';
import { Left } from './left/Left';
import { UserInfo } from './Right/UserInfo/UserInfo';
import { ClinicalProfile } from '../../profile/ClinicalProfile';
import { ObstetricFormula } from '../../profile/ObstetricFormula';
import { Terms } from './Right/Terms/Terms'; // Import Terms component

export const ContentUserProfile = () => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'privacidad'>('perfil');

  return (
    <div className={styles.mainWrapper}>
      <HeaderActividad />

      <section className={styles.container}>
        <div className={styles.sidebar}>
          <Left activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className={styles.contentArea}>
          {activeTab === 'perfil' ? (
            <>
              <UserInfo />
              <div className={styles.medicalInfo}>
                <ObstetricFormula />
                <ClinicalProfile />
              </div>
            </>
          ) : (
            <Terms />
          )}
        </div>
      </section>
    </div>
  );
};
