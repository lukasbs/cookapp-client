export class FridgeItemEditModel {
  constructor(
    public name: string,
    public amount: string,
    public amountType: string,
    public expirationDate: Date,
  ) {}
}
