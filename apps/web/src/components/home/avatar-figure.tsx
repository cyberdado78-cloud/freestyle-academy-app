type Props = {
  hair: string;
  skin: string;
  outfit: string;
  accessory: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
};

export function AvatarFigure({ hair, skin, outfit, accessory, size = 'md', className = '' }: Props) {
  const hairImage = hair === 'Sciolti' ? '/art/sara-loose.png' : hair === 'Treccia' ? '/art/sara-braid.png' : '/art/sara-athlete.png';
  const teal = outfit === 'Teal';
  const image = teal ? '/art/sara-teal.png' : hairImage;
  return (
    <div className={`av-figure av-${size} ${outfit === 'Notte' ? 'av-outfit-notte' : ''} ${className}`} aria-label={`Anteprima dell'atleta: ${hair}, outfit ${outfit}. Carnagione e accessori selezionati: ${skin}, ${accessory}.`} role="img">
      <img src={image} alt="" />
      {teal && hair !== 'Chignon' && <img className="av-hair-overlay" src={hairImage} alt="" />}
      {size === 'hero' && <span className="av-figure-caption">ANTEPRIMA DEL PERSONAGGIO</span>}
    </div>
  );
}
