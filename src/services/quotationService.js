import attributesData from '../data/attributes.json';
import { simulateNetwork } from '../utils/simulateNetwork';

/**
 * Generates mock quotation data for a specific chat or prompt
 */
export async function getQuotationForChat(chatId, promptText) {
  await simulateNetwork(350);

  const colors = attributesData.color || ['Navy Blue', 'Optic White', 'Jet Black', 'Blush', 'Sand'];
  const structures = attributesData.structure || ['Poplin', 'Twill', 'Jersey', 'Fleece', 'Chiffon'];
  const compositions = attributesData.composition || ['100% Cotton', '100% Linen', '95% Cotton 5% Spandex'];

  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  const color3 = colors[Math.floor(Math.random() * colors.length)];

  const hex1 = attributesData.fabricImage[0] || '#1e3a8a';
  const hex2 = attributesData.fabricImage[1] || '#dc143c';
  const hex3 = attributesData.fabricImage[2] || '#8f9779';
  const hex4 = attributesData.fabricImage[3] || '#ffdb58';

  return {
    id: chatId || `2026_${Math.floor(Math.random() * 900 + 100)}`,
    stock: [
      {
        title: `${structures[0]} ${color1}`,
        colorHex: hex1,
        type: 'Woven',
        structure: structures[0],
        composition: compositions[0],
        gsm: 140,
        availableQty: 5000,
        price: 180
      },
      {
        title: `${structures[1]} ${color2}`,
        colorHex: hex2,
        type: 'Knit',
        structure: structures[1],
        composition: compositions[1],
        gsm: 220,
        availableQty: 2500,
        price: 240
      },
      {
        title: `${structures[2]} ${color3}`,
        colorHex: hex3,
        type: 'Woven',
        structure: structures[2],
        composition: '100% Viscose',
        gsm: 110,
        availableQty: 10000,
        price: 160
      },
      {
        title: `Heavy Twill Optic White`,
        colorHex: hex4,
        type: 'Woven',
        structure: 'Twill',
        composition: '100% Cotton',
        gsm: 280,
        availableQty: 15000,
        price: 320
      }
    ],
    noos: [
      {
        title: `NOOS Jersey Heather Grey`,
        colorHex: '#9ca3af',
        type: 'Knit',
        structure: 'Jersey',
        composition: '100% Cotton',
        gsm: 180,
        availableQty: 25000,
        price: 150
      },
      {
        title: `NOOS Poplin Jet Black`,
        colorHex: '#0a0a0a',
        type: 'Woven',
        structure: 'Poplin',
        composition: '65% Cotton 35% Poly',
        gsm: 120,
        availableQty: 50000,
        price: 130
      },
      {
        title: `NOOS French Terry Navy`,
        colorHex: '#1e3a8a',
        type: 'Knit',
        structure: 'French Terry',
        composition: '100% Cotton',
        gsm: 240,
        availableQty: 12000,
        price: 280
      },
      {
        title: `NOOS Canvas Sand`,
        colorHex: '#d2b48c',
        type: 'Woven',
        structure: 'Canvas',
        composition: '100% Cotton',
        gsm: 320,
        availableQty: 8000,
        price: 210
      }
    ],
    mto: [
      {
        id: 'MTO-101',
        structure: 'Custom Print Georgette',
        content: '100% Polyester',
        gsm: 110,
        greigeMoq: 2000,
        printingTech: 'Digital Reactive',
        printingMoq: 1000,
        dyeingTech: 'Custom Reactive Dye',
        dyeingMoq: 500,
        price: 190,
        tat: '25 Days'
      },
      {
        id: 'MTO-102',
        structure: 'Heavy Acid-Wash Fleece',
        content: '80% Cotton 20% Polyester',
        gsm: 380,
        greigeMoq: 3000,
        printingTech: 'Rotary Screen',
        printingMoq: 2000,
        dyeingTech: 'Acid-Wash Pigment',
        dyeingMoq: 1000,
        price: 340,
        tat: '40 Days'
      }
    ]
  };
}
