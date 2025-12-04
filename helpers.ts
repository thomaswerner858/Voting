
export const getEmojiForCuisine = (cuisine: string, name: string): string => {
  const text = (cuisine + ' ' + name).toLowerCase();

  if (text.includes('pizza') || text.includes('italien') || text.includes('pasta')) return '🍕';
  if (text.includes('burger') || text.includes('amerikanisch')) return '🍔';
  if (text.includes('sushi') || text.includes('japan')) return '🍣';
  if (text.includes('asiatisch') || text.includes('china') || text.includes('vietnam') || text.includes('thai')) return '🍜';
  if (text.includes('döner') || text.includes('kebab') || text.includes('türkisch')) return '🥙';
  if (text.includes('indisch') || text.includes('curry')) return '🍛';
  if (text.includes('salat') || text.includes('gesund') || text.includes('bowl')) return '🥗';
  if (text.includes('bäcker') || text.includes('sandwich') || text.includes('brot')) return '🥪';
  if (text.includes('steak') || text.includes('grill') || text.includes('fleisch')) return '🥩';
  if (text.includes('mexikanisch') || text.includes('tacos')) return '🌮';
  if (text.includes('fisch') || text.includes('nordsee')) return '🐟';
  if (text.includes('vegan') || text.includes('vegetarisch')) return '🥦';
  if (text.includes('kaffee') || text.includes('cafe')) return '☕';
  
  return '🍽️'; // Standard Emoji
};
