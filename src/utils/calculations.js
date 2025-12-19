export const calculateItemTotal = (quantity, price, margin) => {
  const baseTotal = quantity * price;
  const marginAmount = (baseTotal * margin) / 100;
  return baseTotal + marginAmount;
};

export const calculateSectionTotal = (items) => {
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item.quantity, item.price, item.margin);
  }, 0);
};

export const calculateEstimationTotal = (sections) => {
  return sections.reduce((total, section) => {
    return total + calculateSectionTotal(section.items);
  }, 0);
};

