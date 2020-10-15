export class ArrayUtils {
  public static moveItem(
    array: Array<unknown>,
    fromIndex: number,
    toIndex: number
  ): void {
    const item = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, item);
  }

  public static range(count: number, offset = 0): number[] {
    return Array.from({ length: count }, (_, i) => i + offset);
  }
}
