import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { Experience } from '@/components/home/experience';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo(
    { matches, location },
    {
      title: 'Freestyle Academy × Dynamic Zen | Prototipo giocabile',
      description:
        'Prototipo privato mobile-first: stanza atleta, repertorio, Sequenza Misteriosa, Dynamic Zen e pannello coach.',
    },
  );
}
export default function HomePage() { return <Experience />; }
