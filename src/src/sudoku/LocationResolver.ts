export interface IIndex {
  readonly c: number;
  readonly r: number;
}

export interface IBorderInfo {
  readonly top: boolean;
  readonly right: boolean;
  readonly bottom: boolean;
  readonly left: boolean;
}

export interface ILocationResolver {
  readonly size: number;

  getHorizontalIndexes(index: IIndex): IIndex[];
  getVerticalIndexes(index: IIndex): IIndex[];
  getZoneIndexes(index: IIndex): IIndex[];
  getAllIndexes(index: IIndex): IIndex[];

  getBorderInfo(index: IIndex): IBorderInfo;
}

export class DefaultLocationResolver implements ILocationResolver {
  private readonly _zoneSize: number;

  public readonly size: number;

  constructor(zoneSize: number, zonesPerLine: number) {
    this._zoneSize = zoneSize;
    this.size = zoneSize * zonesPerLine;
  }

  public getHorizontalIndexes(index: IIndex): IIndex[] {
    const indexes: IIndex[] = [];
    for (let c = 0; c < this.size; c++) {
      indexes.push({ c: c, r: index.r });
    }
    return indexes;
  }

  public getVerticalIndexes(index: IIndex): IIndex[] {
    const indexes: IIndex[] = [];
    for (let r = 0; r < this.size; r++) {
      indexes.push({ c: index.c, r: r });
    }
    return indexes;
  }

  public getZoneIndexes(index: IIndex): IIndex[] {
    const zoneStartIndex: IIndex = {
      c: index.c - (index.c % this._zoneSize),
      r: index.r - (index.r % this._zoneSize)
    };
    const zoneEndIndex: IIndex = {
      c: zoneStartIndex.c + this._zoneSize,
      r: zoneStartIndex.r + this._zoneSize
    };
    const indexes: IIndex[] = [];
    for (let c = zoneStartIndex.c; c < zoneEndIndex.c; c++) {
      for (let r = zoneStartIndex.r; r < zoneEndIndex.r; r++) {
        indexes.push({ c: c, r: r });
      }
    }
    return indexes;
  }

  public getAllIndexes(index: IIndex): IIndex[] {
    const indexes: IIndex[] = this.getZoneIndexes(index);
    const insertIfUnique = (index: IIndex) => {
      if (!indexes.find(ind => ind.c == index.c && ind.r == index.r)) {
        indexes.push(index);
      }
    };
    this.getHorizontalIndexes(index).forEach(v => insertIfUnique(v));
    this.getVerticalIndexes(index).forEach(v => insertIfUnique(v));
    return indexes;
  }

  public getBorderInfo(index: IIndex): IBorderInfo {
    const top = index.r % this._zoneSize == 0;
    const right = index.c % this._zoneSize == this._zoneSize - 1;
    const bottom = index.r % this._zoneSize == this._zoneSize - 1;
    const left = index.c % this._zoneSize == 0;
    return { top, right, bottom, left };
  }
}
