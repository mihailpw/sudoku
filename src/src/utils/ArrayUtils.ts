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

  public static insertSorted<T>(
    array: T[],
    value: T,
    compare: ((left: T, value: T) => boolean) | null = null
  ) {
    if (compare == null) {
      compare = (l, v) => l >= v;
    }
    let i = 0;
    while (i < array.length) {
      if (compare(array[i], value)) {
        break;
      } else {
        i++;
      }
    }
    array.splice(i, 0, value);
  }

  public static range(count: number, offset = 0): number[] {
    return Array.from({ length: count }, (_, i) => i + offset);
  }
}
