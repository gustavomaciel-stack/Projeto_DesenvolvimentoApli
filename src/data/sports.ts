export const SPORTS = [
  { name: 'Futebol', icon: '⚽' }, { name: 'Futsal', icon: '🥅' },
  { name: 'Futebol society', icon: '⚽' }, { name: 'Basquete', icon: '🏀' },
  { name: 'Vôlei', icon: '🏐' }, { name: 'Vôlei de praia', icon: '🏖️' },
  { name: 'Tênis', icon: '🎾' }, { name: 'Beach tennis', icon: '🎾' },
  { name: 'Padel', icon: '🎾' }, { name: 'Handebol', icon: '🤾' },
  { name: 'Beisebol', icon: '⚾' }, { name: 'Softbol', icon: '🥎' },
  { name: 'Futebol americano', icon: '🏈' }, { name: 'Rugby', icon: '🏉' },
  { name: 'Tênis de mesa', icon: '🏓' }, { name: 'Badminton', icon: '🏸' },
  { name: 'Peteca', icon: '🪶' }, { name: 'Squash', icon: '🎾' },
  { name: 'Corrida', icon: '🏃' }, { name: 'Ciclismo', icon: '🚴' },
  { name: 'Natação', icon: '🏊' }, { name: 'Skate', icon: '🛹' },
  { name: 'Surfe', icon: '🏄' }, { name: 'Golfe', icon: '⛳' },
  { name: 'Boliche', icon: '🎳' }, { name: 'Sinuca', icon: '🎱' },
  { name: 'Xadrez', icon: '♟️' }, { name: 'Artes marciais', icon: '🥋' },
];
export function sportIcon(name: string) {
  return SPORTS.find((sport) => sport.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))?.icon ?? '🏅';
}
