import { ArrayUtils } from "./../utils/ArrayUtils";
import { IIndex, ILocationResolver } from "./LocationResolver";

export interface ICell {
  readonly id: string;
  readonly index: IIndex;
  value: number | null;

  possibleValues: number[];
}

export interface IBoard {
  readonly cells: ICell[][];

  setValue(index: IIndex, value: number | null): boolean;
  validate(index: IIndex, value: number): boolean;
  getIndexes(value: number): IIndex[];
}

export class DefaultBoard implements IBoard {
  private readonly _locationResolver: ILocationResolver;

  public readonly cells: ICell[][] = [];

  constructor(locationResolver: ILocationResolver) {
    this._locationResolver = locationResolver;
    this.initialize();
  }

  public setValue(index: IIndex, value: number | null): boolean {
    if (value != null && !this.validate(index, value)) return false;

    const previousValue = this.cells[index.r][index.c].value;
    this.cells[index.r][index.c].value = value;
    this.refreshPossibleValueFor(index, value, previousValue);
    return true;
  }

  public validate(index: IIndex, value: number): boolean {
    const cell = this.cells[index.r][index.c];
    return cell.possibleValues.indexOf(value) >= 0;
  }

  public getIndexes(value: number): IIndex[] {
    const indexes: IIndex[] = [];
    this.cells.forEach(row =>
      row.forEach(c => {
        if (c.value == value) {
          indexes.push(c.index);
        }
      })
    );
    return indexes;
  }

  private initialize() {
    const possibleValues = ArrayUtils.range(this._locationResolver.size, 1);

    for (let r = 0; r < this._locationResolver.size; r++) {
      this.cells[r] = [];
      for (let c = 0; c < this._locationResolver.size; c++) {
        this.cells[r][c] = {
          id: "_" + r + c,
          index: { c, r },
          value: null,
          possibleValues: [...possibleValues]
        };
      }
    }
  }

  private refreshPossibleValueFor(
    index: IIndex,
    valueToRemove: number | null,
    valueToAdd: number | null
  ) {
    const indexesToRefresh = this._locationResolver.getAllIndexes(index);
    indexesToRefresh.forEach(ind => {
      const values = this.cells[ind.r][ind.c].possibleValues;
      if (valueToRemove != null) {
        const valueIndex = values.indexOf(valueToRemove);
        if (valueIndex >= 0) {
          values.splice(valueIndex, 1);
        }
      }
      if (valueToAdd != null) {
        const valueIndex = values.indexOf(valueToAdd);
        if (valueIndex < 0) {
          values.push(valueToAdd);
        }
      }
      values.sort();
    });
  }
}
