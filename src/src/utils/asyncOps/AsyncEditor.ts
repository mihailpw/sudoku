import { ICallState, CallState, cloneData } from "@/utils";

interface IAsyncEditorParams<T> {
  initialValue: T;
  isValid?(value: T): boolean;
  processSave(saveValue: T): Promise<T>;
}

export interface IAsyncEditor<T> {
  value: T;
  valid: boolean;
  editing: boolean;
  saveState: ICallState;
  startEdit(): void;
  save(): Promise<void>;
  cancelEdit(): void;
}

class AsyncEditor<T> implements IAsyncEditor<T> {
  private _savedValue: T;
  private _isValid: (value: T) => boolean;
  private _processSave: (saveValue: T) => Promise<T>;

  public value: T;
  public editing = false;
  public readonly saveState: CallState = new CallState();

  constructor(params: IAsyncEditorParams<T>) {
    this._savedValue = cloneData(params.initialValue);
    this._isValid = params.isValid ?? (() => true);
    this._processSave = params.processSave;
    this.value = cloneData(params.initialValue);
  }

  public get valid(): boolean {
    return this._isValid(this.value);
  }

  public startEdit(): void {
    this.editing = true;
  }

  public async save(): Promise<void> {
    if (this.editing && this.valid) {
      const saveResult = await this.saveState.process(() =>
        this._processSave(this.value)
      );
      if (saveResult != null) {
        this._savedValue = saveResult;
        this.editing = false;
      }
    }
  }

  public cancelEdit(): void {
    if (this.editing) {
      this.value = cloneData(this._savedValue);
      this.editing = false;
    }
  }
}

export function createAsyncEditor<T>(
  params: IAsyncEditorParams<T>
): IAsyncEditor<T> {
  return new AsyncEditor<T>(params);
}
