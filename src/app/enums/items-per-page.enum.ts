export enum ItemsPerPage {
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  HUNDRED = 100,
  MAX = 100
}

export const ITEMS_PER_PAGE_VALUES: number[] = [
  ItemsPerPage.TEN,
  ItemsPerPage.TWENTY_FIVE,
  ItemsPerPage.FIFTY,
  ItemsPerPage.HUNDRED
];

export const isValidItemsPerPage = (value: number): boolean => {
  return ITEMS_PER_PAGE_VALUES.includes(value);
};
