import loftusCheekImg from '../assets/Loftus-Cheek Squad Headshot.png';

export interface Player {
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  role: 'Captain' | 'First Team' | 'Academy Prospect';
  photoUrl: string;
  number?: number;
}

export const squadData: Player[] = [
  {
    name: 'Ruben Loftus-Cheek',
    position: 'Midfielder',
    role: 'Captain',
    photoUrl: loftusCheekImg,
    number: 8,
  },
  {
    name: 'Đorđe Petrović',
    position: 'Goalkeeper',
    role: 'First Team',
    photoUrl: 'https://images.gc.afcbournemouthservices.co.uk/fit-in/600x600/9a404450-f5ee-11f0-bdc5-49abafc7e013.png',
    number: 1,
  },
  {
    name: 'Elyh Harrison',
    position: 'Goalkeeper',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elyh_Harrison.jpg',
    number: 31,
  },
  {
    name: 'Trevoh Chalobah',
    position: 'Defender',
    role: 'First Team',
    photoUrl: 'https://img.chelseafc.com/image/upload/f_auto,h_860,q_50/editorial/people/first-team/2025-26/With%20IFS/3333x5000_Avatar_Image_Sponsored_IFSai_Men_Chalobah_SF_Home_25_26_RGB.png',
    number: 14,
  },
  {
    name: 'Nat Phillips',
    position: 'Defender',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nat_Phillips.jpg',
    number: 4,
  },
  {
    name: 'Kieran Tierney',
    position: 'Defender',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kieran_Tierney.jpg',
    number: 3,
  },
  {
    name: 'Sergio Reguilón',
    position: 'Defender',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sergio_Reguilon.jpg',
    number: 23,
  },
  {
    name: 'Luis Suárez',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Luis_Javier_Su%C3%A1rez_Charris.jpg',
    number: 9,
  },
  {
    name: 'Josh Acheampong',
    position: 'Defender',
    role: 'Academy Prospect',
    photoUrl: 'https://img.chelseafc.com/image/upload/f_auto,h_860,q_50/editorial/people/first-team/2025-26/With%20IFS/3333x5000_Avatar_Image_Sponsored_IFSai_Men_Acheampong_SF_Home_25_26_RGB.png',
    number: 34,
  },
  {
    name: 'Harry Amass',
    position: 'Defender',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Harry_Amass.jpg',
    number: 38,
  },
  {
    name: 'Leon Goretzka',
    position: 'Midfielder',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Leon_Goretzka.jpg',
    number: 6,
  },
  {
    name: 'Kalvin Phillips',
    position: 'Midfielder',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kalvin_Phillips.jpg',
    number: 11,
  },
  {
    name: 'Dani Ceballos',
    position: 'Midfielder',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dani_Ceballos.jpg',
    number: 10,
  },
  {
    name: 'Hannibal Mejbri',
    position: 'Midfielder',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal_Mejbri.jpg',
    number: 16,
  },
  {
    name: 'Fábio Vieira',
    position: 'Midfielder',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fabio_Vieira.jpg',
    number: 21,
  },
  {
    name: 'Jacob Wright',
    position: 'Midfielder',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jacob_Wright.jpg',
    number: 36,
  },
  {
    name: 'Ethan Nwaneri',
    position: 'Midfielder',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ethan_Nwaneri.jpg',
    number: 22,
  },
  {
    name: 'Kiano Dyer',
    position: 'Midfielder',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kiano_Dyer.jpg',
    number: 42,
  },
  {
    name: 'Marc Guiu',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://img.chelseafc.com/image/upload/f_auto,h_860,q_50/editorial/people/first-team/2025-26/With%20IFS/3333x5000_Avatar_Image_Sponsored_IFSai_Men_Guiu_SF_Home_25_26_RGB.png',
    number: 17,
  },
  {
    name: 'Ansu Fati',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ansu_Fati.jpg',
    number: 7,
  },
  {
    name: 'Reiss Nelson',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Reiss_Nelson.jpg',
    number: 19,
  },
  {
    name: 'Armando Broja',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Armando_Broja.jpg',
    number: 18,
  },
  {
    name: 'Bryan Gil',
    position: 'Forward',
    role: 'First Team',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bryan_Gil.jpg',
    number: 25,
  },
  {
    name: 'Jayden Danns',
    position: 'Forward',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jayden_Danns.jpg',
    number: 45,
  },
  {
    name: 'Mikey Moore',
    position: 'Forward',
    role: 'Academy Prospect',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mikey_Moore.jpg',
    number: 47,
  },
];
