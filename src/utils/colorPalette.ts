// Reusable pastel color palette for UI consistency
export const cardPalette = [
  { bg: "#E9D5FF", text: "#3C096C" }, // lavender
  { bg: "#D1FAE5", text: "#064E3B" }, // mint
  { bg: "#FFF7ED", text: "#78350F" }, // cream
  { bg: "#E0F2FE", text: "#075985" }, // ice blue
  { bg: "#FCE7F3", text: "#831843" }, // soft pink
  { bg: "#F5E6D3", text: "#64512F" }, // warm beige
  { bg: "#EDE9FF", text: "#5B21B6" }, // soft violet
];

export const getPaletteFor = (key: string) => {
  const sum = Array.from(key).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return cardPalette[sum % cardPalette.length];
};

export const clientPalette = {
  lavender: '#C3A6FF',
  mintGreen: '#BFF3D4',
  warmCream: '#FFF9EA',
  iceBlue: '#EDF7FF',
  softSaga: '#F3EAF8',
  softPink: '#FFF4F8',
  lightBeige: '#F5EFDB',
  lilacFrost: '#EADCFD',
  royalNavy: '#07123A',
  ivorySand: '#FAF7EE',
};
