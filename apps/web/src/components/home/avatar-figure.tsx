type Props = {
  hair: string;
  skin: string;
  outfit: string;
  accessory: string;
  effect?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
};

export function AvatarFigure({ hair, skin, outfit, accessory, effect = 'Nessuno', size = 'md', className = '' }: Props) {
  const hairImage = hair === 'Sciolti' ? '/art/sara-loose.png' : hair === 'Treccia' ? '/art/sara-braid.png' : '/art/sara-athlete.png';
  const teal = outfit === 'Teal';
  const image = teal ? '/art/sara-teal.png' : hairImage;
  const effectClass = effect === 'Aura ambra' ? 'av-effect-amber' : effect === 'Aura viola' ? 'av-effect-violet' : effect === 'Aura teal' ? 'av-effect-teal' : '';
  return (
    <div className={`av-figure av-${size} ${outfit === 'Notte' ? 'av-outfit-notte' : ''} ${effectClass} ${className}`} aria-label={`Anteprima dell'atleta: ${hair}, outfit ${outfit}. Carnagione, accessorio ed effetto selezionati: ${skin}, ${accessory}, ${effect}.`} role="img">
      <img src={image} alt="" />
      {teal && hair !== 'Chignon' && <img className="av-hair-overlay" src={hairImage} alt="" />}
      {size === 'hero' && accessory !== 'Nessuno' && <span className="av-accessory-caption">✦ {accessory}</span>}
      {size === 'hero' && <span className="av-figure-caption">ANTEPRIMA DEL PERSONAGGIO</span>}
    </div>
  );
}
