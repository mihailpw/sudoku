import { ArrayUtils } from "./../utils/ArrayUtils";
import { IIndex, ILocationResolver } from "./LocationResolver";

export interface ICell {
  readonly id: string;
  readonly index: IIndex;

  readonly possibleValues: number[];
  value: number | null;
}

class Cell implements ICell {
  private readonly _possibleValuesUsage: { [value: number]: number } = {};

  public readonly id: string;
  public readonly index: IIndex;
  public readonly possibleValues: number[];

  public value: number | null;

  constructor(index: IIndex, initialPossibleValues: number[]) {
    this.id = `_${index.r}_${index.c}`;
    this.index = index;
    this.possibleValues = [...initialPossibleValues];
    this.value = null;

    this.possibleValues.forEach(v => (this._possibleValuesUsage[v] = 0));
  }

  public updatePossibleValue(possibleValue: number, isAdding: boolean) {
    const operationWeight = isAdding ? 1 : -1;
    this._possibleValuesUsage[possibleValue] += operationWeight;
    if (this._possibleValuesUsage[possibleValue] > 0) {
      const valueIndex = this.possibleValues.indexOf(possibleValue);
      if (valueIndex >= 0) {
        this.possibleValues.splice(valueIndex, 1);
      }
    } else {
      ArrayUtils.insertSorted(this.possibleValues, possibleValue);
    }
  }
}

export interface IBoard {
  readonly locationResolver: ILocationResolver;
  readonly cells: ICell[][];

  setValue(index: IIndex, value: number | null): boolean;
  validate(index: IIndex, value: number): boolean;
}

export class DefaultBoard implements IBoard {
  public readonly locationResolver: ILocationResolver;
  public readonly _cells: Cell[][] = [];

  constructor(locationResolver: ILocationResolver) {
    this.locationResolver = locationResolver;
    this.initialize();
  }

  public get cells(): ICell[][] {
    return this._cells;
  }

  public setValue(index: IIndex, value: number | null): boolean {
    if (value != null && !this.validate(index, value)) return false;

    const cell = this._cells[index.r][index.c];
    const previousValue = cell.value;
    cell.value = value;
    this.refreshPossibleValue(index, value, previousValue);
    return true;
  }

  public validate(index: IIndex, value: number): boolean {
    const cell = this.cells[index.r][index.c];
    return cell.possibleValues.indexOf(value) >= 0;
  }

  private initialize() {
    const possibleValues = ArrayUtils.range(this.locationResolver.size, 1);

    for (let r = 0; r < this.locationResolver.size; r++) {
      this._cells[r] = [];
      for (let c = 0; c < this.locationResolver.size; c++) {
        this._cells[r][c] = new Cell({ c, r }, [...possibleValues]);
      }
    }
  }

  private refreshPossibleValue(
    index: IIndex,
    newValue: number | null,
    oldValue: number | null
  ) {
    const indexesToRefresh = this.locationResolver.getAllIndexes(index);
    indexesToRefresh.forEach(ind => {
      const cell = this._cells[ind.r][ind.c];
      if (oldValue != null) {
        cell.updatePossibleValue(oldValue, false);
      }
      if (newValue != null) {
        cell.updatePossibleValue(newValue, true);
      }
    });
  }
}
