import { ICallState, CallState, cloneData } from "@/utils";

interface IAsyncCreatorParams<T> {
  initialValue: T;
  isValid?(value: T): boolean;
  isEmpty?(value: T): boolean;
  processSave(saveValue: T): Promise<any>;
}

export interface IAsyncCreator<T> {
  value: T;
  valid: boolean;
  editing: boolean;
  saveState: ICallState;
  save(): Promise<void>;
  reset(): void;
}

class AsyncCreator<T> implements IAsyncCreator<T> {
  private _initialValue: T;
  private _isValid: (value: T) => boolean;
  private _isEmpty: (value: T) => boolean;
  private _processSave: (saveValue: T) => Promise<any>;

  public value: T;
  public readonly saveState: CallState = new CallState();

  constructor(params: IAsyncCreatorParams<T>) {
    this._initialValue = params.initialValue;
    this._isValid = params.isValid ?? (() => true);
    this._isEmpty =
      params.isEmpty ??
      (value => JSON.stringify(value) === JSON.stringify(this._initialValue));
    this._processSave = params.processSave;
    this.value = cloneData(params.initialValue);
  }

  public get valid(): boolean {
    return this._isValid(this.value);
  }

  public get editing(): boolean {
    return !this._isEmpty(this.value);
  }

  public async save(): Promise<void> {
    if (this.valid) {
      const saveResult = await this.saveState.process(() =>
        this._processSave(cloneData(this.value))
      );
      if (saveResult != null) {
        this.reset();
      }
    }
  }

  public reset(): void {
    this.value = cloneData(this._initialValue);
  }
}

export function createAsyncCreator<T>(
  params: IAsyncCreatorParams<T>
): IAsyncCreator<T> {
  return new AsyncCreator<T>(params);
}
