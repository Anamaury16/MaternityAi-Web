import { BackgroundDecor } from '../components/backgrounds/Backgrounddecor';
import { HeaderActividad } from '../components/Headers/HeaderActividad/HeaderActividad';
import { ContentMain } from '../components/info/contentMain/ContentMain';

export const Main = () => {
  return (
    <div>
      <BackgroundDecor />
      <HeaderActividad />
      <ContentMain />
    </div>
  );
};
