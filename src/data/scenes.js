import {
  ABOUT_IMAGE,
  COUPLE_BEDROOM_IMAGE,
  EXPERIENCE_IMAGES,
  GALLERY_IMAGES,
  HERO_IMAGE,
  SPACE_IMAGES,
  TERRACE_LEISURE_IMAGE,
} from './media.js';

const tourBase = `${import.meta.env.BASE_URL}assets/images/luxury-house/tour/`;
const immersivePhoto = (image, file) => ({
  ...image,
  thumbnail: image.src,
  src: file ? `${tourBase}${file}` : image.src,
});

export const SCENES = [
  {
    id: 'ocean-lounge-wide',
    title: 'Janelas para a costa',
    description: 'Uma sala com janelas amplas.',
    image: immersivePhoto(GALLERY_IMAGES[1], 'ocean-lounge-wide.jpg'),
  },
  {
    id: 'garden',
    title: 'Jardim',
    description: 'Jardim tropical junto à villa e à piscina.',
    image: immersivePhoto(HERO_IMAGE),
  },
  {
    id: 'terrace',
    title: 'Terraço',
    description: 'Comece o percurso ao ar livre, junto ao jardim.',
    image: immersivePhoto(SPACE_IMAGES[1], 'ocean-lounge.jpg'),
  },
  {
    id: 'terrace-leisure',
    title: 'Lazer no terraço',
    description: 'Uma área ao ar livre para aproveitar o terraço.',
    image: immersivePhoto(TERRACE_LEISURE_IMAGE, 'terrace-leisure.jpg'),
  },
  {
    id: 'sala-com-vista',
    title: 'Sala com vista',
    description: 'A sala abre-se para o exterior.',
    image: immersivePhoto(EXPERIENCE_IMAGES[1], 'terrace-dining.jpg'),
  },
  {
    id: 'living-room',
    title: 'Sala de estar',
    description: 'Madeira e materiais naturais no interior.',
    image: immersivePhoto(SPACE_IMAGES[0], 'living-room.jpg'),
  },
  {
    id: 'garden-lounge',
    title: 'Sala exterior',
    description: 'Continue pela zona de estar junto à vegetação.',
    image: immersivePhoto(ABOUT_IMAGE, 'garden-lounge.jpg'),
  },
  {
    id: 'infinity-pool',
    title: 'Piscina',
    description: 'Uma vista da piscina e da villa entre palmeiras.',
    image: immersivePhoto(EXPERIENCE_IMAGES[0], 'infinity-pool.jpg'),
  },
  {
    id: 'primary-suite',
    title: 'Quarto principal',
    description: 'Quarto principal com cama de dossel e vista para o mar.',
    image: immersivePhoto(SPACE_IMAGES[2], 'primary-bedroom.jpg'),
  },
  {
    id: 'couple-bedroom',
    title: 'Quarto de casal',
    description: 'Quarto de casal com teto em madeira e vista para o exterior.',
    image: immersivePhoto(COUPLE_BEDROOM_IMAGE, 'primary-suite.jpg'),
  },
  {
    id: 'loft-bedroom',
    title: 'Quarto loft',
    description: 'Um quarto com escada em madeira e varanda.',
    image: immersivePhoto(SPACE_IMAGES[3], 'loft-bedroom.jpg'),
  },
  {
    id: 'bath-experience',
    title: 'Banheira',
    description: 'Uma banheira independente numa casa de banho privada.',
    image: immersivePhoto(SPACE_IMAGES[4], 'double-vanity.jpg'),
  },
  {
    id: 'double-vanity',
    title: 'Lavatórios duplos',
    description: 'Móvel de madeira com dois lavatórios.',
    image: immersivePhoto(GALLERY_IMAGES[0], 'bath-experience.jpg'),
  },
];
