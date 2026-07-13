import { getHeroWorks } from '@/lib/data';
import StageBackground from '@/components/StageBackground';
import LandingBodyClass from '@/components/LandingBodyClass';

// Read at request time so newly added work shows up immediately.
// LANDING — one fit-to-screen page. Paintings crossfade behind the artist's name.
export default async function Home() {
  const works = await getHeroWorks();
  const images = works.map((w) => w.image).filter(Boolean).slice(0, 5);

  return (
    <div className="stage">
      <LandingBodyClass />
      <StageBackground images={images} />
      <div className="stage__center">
        <h1 className="stage__name">Omar&nbsp;Chacón</h1>
        <p className="stage__tagline">Hand-cast acrylic, collaged by hand. A brush is never used.</p>
      </div>
    </div>
  );
}
