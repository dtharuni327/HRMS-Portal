// Reusable pastel color palette for UI consistency
export const cardPalette = [
  { bg: "#D8C9F3", text: "#3C096C" }, // muted lavender
  { bg: "#CDECDF", text: "#09543A" }, // muted mint
  { bg: "#F3E9D6", text: "#6B4A2A" }, // warm cream
  { bg: "#DDEEF9", text: "#0B5A75" }, // soft ice blue
  { bg: "#F7E6EA", text: "#7A2B45" }, // muted pink
  { bg: "#EFE3D2", text: "#5A472F" }, // warm beige
  { bg: "#E8E3FB", text: "#4C1EA6" }, // soft violet
];

export const getPaletteFor = (key: string) => {
  const sum = Array.from(key).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return cardPalette[sum % cardPalette.length];
};

export const clientPalette = {
  lavender: '#BBA0E6',
  mintGreen: '#B7E8D1',
  warmCream: '#F2EBD6',
  iceBlue: '#E8F4FB',
  softSaga: '#E9E0F3',
  softPink: '#F6E9EE',
  lightBeige: '#EEE6D6',
  lilacFrost: '#D7C8F2',
  royalNavy: '#07123A',
  ivorySand: '#F7F5EE',
};
