const base = `${import.meta.env.BASE_URL}assets/images/luxury-house/`;
const photo = (file, alt) => ({ src: `${base}${file}`, alt });

export const HERO_IMAGE = photo(
  'villa-garden.jpg',
  'Villa, jardim e piscina enquadrados por palmeiras.',
);

export const ABOUT_IMAGE = photo(
  'garden-lounge.jpg',
  'Sala exterior rodeada por vegetação tropical.',
);

export const TERRACE_LEISURE_IMAGE = photo(
  'terrace-leisure.jpg',
  'Área de lazer no terraço da villa com mesas e cadeiras.',
);

export const SPACE_IMAGES = [
  photo('living-room.jpg', 'Sala de estar com madeira e materiais naturais.'),
  photo('ocean-lounge.jpg', 'Sala da villa aberta para o jardim e o oceano.'),
  photo('primary-bedroom.jpg', 'Quarto principal com cama de dossel e vista para o mar.'),
  photo('loft-bedroom.jpg', 'Quarto com escada em madeira e varanda.'),
  photo('double-vanity.jpg', 'Banheira independente numa casa de banho com materiais naturais.'),
];

export const COUPLE_BEDROOM_IMAGE = photo(
  'primary-suite.jpg',
  'Quarto de casal com teto em madeira e vista para o exterior.',
);

export const EXPERIENCE_IMAGES = [
  photo('infinity-pool.jpg', 'Piscina e villa rodeadas por palmeiras.'),
  photo('terrace-dining.jpg', 'Terraço de refeições ao ar livre junto ao jardim.'),
];

export const GALLERY_IMAGES = [
  photo('bath-experience.jpg', 'Casa de banho com dois lavatórios sobre um móvel de madeira.'),
  photo('ocean-lounge-wide.jpg', 'Sala com janelas amplas voltadas para a costa.'),
];

export const VIDEO_COVER = `${base}editorial-cover.avif`;
