export class ItemsPerPage {
  static readonly TEN = 10;
  static readonly TWENTY_FIVE = 25;
  static readonly FIFTY = 50;
  static readonly HUNDRED = 100;
  static readonly MAX = 100;
  
  static getValidValues(): number[] {
    return [this.TEN, this.TWENTY_FIVE, this.FIFTY, this.HUNDRED];
  }
  
  static isValid(value: number): boolean {
    return this.getValidValues().includes(value);
  }
}
