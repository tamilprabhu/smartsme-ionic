export enum ItemsPerPage {
  ONE = 1,
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  HUNDRED = 100,
  MAX = 1000
}

export const ITEMS_PER_PAGE_VALUES: number[] = [
  ItemsPerPage.ONE,
  ItemsPerPage.TEN,
  ItemsPerPage.TWENTY_FIVE,
  ItemsPerPage.FIFTY,
  ItemsPerPage.HUNDRED,
  ItemsPerPage.MAX
];

export const isValidItemsPerPage = (value: number): boolean => {
  return ITEMS_PER_PAGE_VALUES.includes(value);
};
