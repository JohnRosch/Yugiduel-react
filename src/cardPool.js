export const CARD_POOL = [
  // --- Your 10 Original Cards ---
  { id: 1, name: "Goblin", level: 3, atk: 1200, def: 800 },
  { id: 2, name: "Orc Warrior", level: 4, atk: 1500, def: 1200 },
  { id: 3, name: "Golem", level: 5, atk: 1000, def: 2000 },
  { id: 4, name: "Dragon", level: 6, atk: 2400, def: 1500 },
  { id: 5, name: "Elf Archer", level: 3, atk: 1100, def: 1000 },
  { id: 6, name: "Knight", level: 4, atk: 1600, def: 1400 },
  { id: 7, name: "Wizard", level: 5, atk: 1800, def: 1000 },
  { id: 8, name: "Slime", level: 1, atk: 300, def: 300 },
  { id: 9, name: "Zombie", level: 2, atk: 800, def: 500 },
  { id: 10, name: "Centaur", level: 4, atk: 1400, def: 1300 },

  // --- New Variations You Can Add Manually ---
  { id: 11, name: "Winged Kuriboh", level: 1, atk: 300, def: 200 },
  { id: 12, name: "Celtic Guardian", level: 4, atk: 1400, def: 1200 },
  { id: 13, name: "Dark Magician", level: 7, atk: 2500, def: 2100 },
  { id: 14, name: "Blue-Eyes Dragon", level: 8, atk: 3000, def: 2500 },
  { id: 15, name: "Curse of Dragon", level: 5, atk: 2000, def: 1500 },
  { id: 16, name: "Giant Soldier", level: 3, atk: 1300, def: 2000 },
  { id: 17, name: "Flame Swordsman", level: 5, atk: 1800, def: 1600 },
  { id: 18, name: "Harpy Lady", level: 4, atk: 1300, def: 1400 },
  { id: 19, name: "Summoned Skull", level: 6, atk: 2500, def: 1200 },
  { id: 20, name: "Baby Dragon", level: 3, atk: 1200, def: 700 }
];

export const shuffleDeck = () => [...CARD_POOL].sort(() => Math.random() - 0.5);
