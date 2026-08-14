import attributesData from '../data/attributes.json';

/**
 * Utility function to pick a random item from an array
 */
function getRandomItem(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Utility to format currency prices in INR (₹)
 */
function formatPrice(basePrice, unit) {
  return `₹${basePrice}/${unit || 'm'}`;
}

/**
 * Utility to format quantity values
 */
function formatQuantity(qty, unit) {
  if (typeof qty === 'number') {
    return `${qty.toLocaleString()} ${unit || 'm'}`;
  }
  return `${qty} ${unit || 'm'}`;
}

/**
 * Generates Stock Fabric Cards based on attributes.json data
 */
function generateStockCards(count, quoteId) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const unit = getRandomItem(attributesData.unitOfMeasurement) || 'm';
    const price = getRandomItem(attributesData.priceBase) || 180;
    const qty = getRandomItem(attributesData.availableQuantity) || 2500;
    const structure = getRandomItem(attributesData.structure) || 'Poplin';
    const content = getRandomItem(attributesData.content) || 'Cotton';
    const color = getRandomItem(attributesData.color) || 'Navy Blue';
    const composition = getRandomItem(attributesData.composition) || '100% Cotton';
    const gsm = getRandomItem(attributesData.gsm) || 180;
    const width = getRandomItem(attributesData.width) || '58 inch';
    const fabricImage = getRandomItem(attributesData.fabricImage) || '#1e3a8a';

    cards.push({
      id: `stk_${quoteId}_${i + 1}`,
      type: 'Stock',
      title: `${composition} ${structure}`,
      sku: `SKU-STK-${1000 + i + Math.floor(Math.random() * 8999)}`,
      structure,
      content,
      composition,
      color,
      gsm,
      width,
      unit,
      priceFormatted: formatPrice(price, unit),
      priceBase: price,
      quantityFormatted: formatQuantity(qty, unit),
      availableQuantity: qty,
      fabricImage
    });
  }
  return cards;
}

/**
 * Generates NOOS (Never Out Of Stock) Fabric Cards based on attributes.json data
 */
function generateNoosCards(count, quoteId) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const unit = getRandomItem(attributesData.unitOfMeasurement) || 'm';
    const price = getRandomItem(attributesData.priceBase) || 220;
    const qty = getRandomItem(attributesData.availableQuantity) || 5000;
    const structure = getRandomItem(attributesData.structure) || 'Twill';
    const content = getRandomItem(attributesData.content) || 'Polyester';
    const color = getRandomItem(attributesData.color) || 'Optic White';
    const composition = getRandomItem(attributesData.composition) || '65% Cotton 35% Polyester';
    const gsm = getRandomItem(attributesData.gsm) || 220;
    const width = getRandomItem(attributesData.width) || '60 inch';
    const fabricImage = getRandomItem(attributesData.fabricImage) || '#dc143c';

    cards.push({
      id: `nos_${quoteId}_${i + 1}`,
      type: 'NOOS',
      title: `${composition} ${structure}`,
      sku: `SKU-NOS-${2000 + i + Math.floor(Math.random() * 8999)}`,
      structure,
      content,
      composition,
      color,
      gsm,
      width,
      unit,
      priceFormatted: formatPrice(price, unit),
      priceBase: price,
      quantityFormatted: formatQuantity(qty, unit),
      availableQuantity: qty,
      fabricImage
    });
  }
  return cards;
}

/**
 * Generates MTO (Make To Order) Fabric Quotes with technical specifications
 */
function generateMtoQuotes(count, quoteId) {
  const quotes = [];
  for (let i = 0; i < count; i++) {
    const unit = getRandomItem(attributesData.unitOfMeasurement) || 'm';
    const price = getRandomItem(attributesData.priceBase) || 320;
    const structure = getRandomItem(attributesData.structure) || 'French Terry';
    const content = getRandomItem(attributesData.content) || 'Cotton';
    const composition = getRandomItem(attributesData.composition) || '100% Cotton';
    const gsm = getRandomItem(attributesData.gsm) || 280;
    const greigeMoqVal = getRandomItem(attributesData.greigeMoqBase) || 2000;
    const printTech = getRandomItem(attributesData.printingTechnique) || 'Digital Reactive';
    const printMoqVal = getRandomItem(attributesData.printingMoqBase) || 500;
    const dyeTech = getRandomItem(attributesData.dyeingTechnique) || 'Reactive Solid Dye';
    const dyeMoqVal = getRandomItem(attributesData.dyeingMoqBase) || 1000;
    const tat = getRandomItem(attributesData.tat) || '30 Days';

    quotes.push({
      id: `mto_${quoteId}_${i + 1}`,
      type: 'MTO',
      title: `${content} ${structure}`,
      composition,
      specifications: {
        structure,
        composition,
        content,
        gsm: `${gsm} gsm`,
        greigeMoq: formatQuantity(greigeMoqVal, unit),
        printingTechnique: printTech,
        printingMoq: printMoqVal === 'NA' ? 'NA' : formatQuantity(printMoqVal, unit),
        dyeingTechnique: dyeTech,
        dyeingMoq: dyeMoqVal === 'NA' ? 'NA' : formatQuantity(dyeMoqVal, unit),
        price: formatPrice(price, unit),
        tat
      }
    });
  }
  return quotes;
}

/**
 * Main Quote Generation Engine conforming to prototype distribution specifications:
 * - Stock: 25% chance of 0; 75% chance of 3-10
 * - NOOS: 25% chance of 0; 75% chance of 3-10
 * - MTO: 25% chance of 0; 75% chance of 1-6
 */
export function getOrCreateQuotationData(quoteId) {
  if (!quoteId) return { stockCards: [], noosCards: [], mtoQuotes: [], matchCountString: '0 Matches' };

  const storageKey = `fabrito_quote_data_${quoteId}`;
  const existingRaw = localStorage.getItem(storageKey);
  if (existingRaw) {
    try {
      const parsed = JSON.parse(existingRaw);
      let needsUpdate = false;

      // Migrate Stock Cards currency
      if (Array.isArray(parsed.stockCards)) {
        parsed.stockCards = parsed.stockCards.map((card) => {
          if (card.priceFormatted && card.priceFormatted.includes('$')) {
            needsUpdate = true;
            return {
              ...card,
              priceFormatted: card.priceFormatted.replace(/\$/g, '₹')
            };
          }
          return card;
        });
      }

      // Migrate NOOS Cards currency
      if (Array.isArray(parsed.noosCards)) {
        parsed.noosCards = parsed.noosCards.map((card) => {
          if (card.priceFormatted && card.priceFormatted.includes('$')) {
            needsUpdate = true;
            return {
              ...card,
              priceFormatted: card.priceFormatted.replace(/\$/g, '₹')
            };
          }
          return card;
        });
      }

      // Migrate MTO Quotes currency & composition
      if (Array.isArray(parsed.mtoQuotes)) {
        parsed.mtoQuotes = parsed.mtoQuotes.map((mto) => {
          let updatedMto = { ...mto };
          if (updatedMto.specifications?.price && updatedMto.specifications.price.includes('$')) {
            needsUpdate = true;
            updatedMto.specifications = {
              ...updatedMto.specifications,
              price: updatedMto.specifications.price.replace(/\$/g, '₹')
            };
          }
          if (updatedMto.price && String(updatedMto.price).includes('$')) {
            needsUpdate = true;
            updatedMto.price = String(updatedMto.price).replace(/\$/g, '₹');
          }
          const currentComp = updatedMto.specifications?.composition || updatedMto.composition;
          if (!currentComp || !/\d%/.test(currentComp)) {
            const content = updatedMto.specifications?.content || updatedMto.content || 'Cotton';
            const matchedComp = attributesData.composition.find((c) =>
              c.toLowerCase().includes(content.toLowerCase())
            ) || getRandomItem(attributesData.composition) || '100% Cotton';
            needsUpdate = true;
            updatedMto.composition = matchedComp;
            updatedMto.specifications = {
              ...updatedMto.specifications,
              composition: matchedComp
            };
          }
          return updatedMto;
        });
      }

      if (needsUpdate) {
        localStorage.setItem(storageKey, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse quote data from localStorage, re-generating...', e);
    }
  }

  // Calculate counts based on probability distribution
  const hasStock = Math.random() >= 0.25;
  const stockCount = hasStock ? Math.floor(Math.random() * 8) + 3 : 0; // 3 to 10

  const hasNoos = Math.random() >= 0.25;
  const noosCount = hasNoos ? Math.floor(Math.random() * 8) + 3 : 0; // 3 to 10

  const hasMto = Math.random() >= 0.25;
  const mtoCount = hasMto ? Math.floor(Math.random() * 6) + 1 : 0; // 1 to 6

  const stockCards = generateStockCards(stockCount, quoteId);
  const noosCards = generateNoosCards(noosCount, quoteId);
  const mtoQuotes = generateMtoQuotes(mtoCount, quoteId);

  // Build matchCount string
  const summaryParts = [];
  if (stockCount > 0) summaryParts.push(`${stockCount} Stock`);
  if (noosCount > 0) summaryParts.push(`${noosCount} NOOS`);
  if (mtoCount > 0) summaryParts.push(`${mtoCount} MTO`);
  const matchCountString = summaryParts.length > 0 ? summaryParts.join(' • ') : '0 Matches';

  const quotationData = {
    quoteId,
    stockCards,
    noosCards,
    mtoQuotes,
    matchCountString
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(quotationData));
  } catch (e) {
    console.error('Failed to write quotation data to localStorage', e);
  }

  return quotationData;
}
