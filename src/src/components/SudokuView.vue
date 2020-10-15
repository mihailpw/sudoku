<template>
  <div>
    <v-btn-toggle v-model="selectedHighliting" tile group>
      <v-btn v-for="value in values" :key="value" :value="value">{{
        value
      }}</v-btn>
    </v-btn-toggle>
    <table>
      <tr v-for="(cellsRow, r) in board.cells" :key="r">
        <td
          v-for="cell in cellsRow"
          :key="cell.id"
          :class="getClasses(cell)"
          class="cell"
        >
          <v-tooltip bottom :disabled="getTooltipDisabled(cell)">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <input
                  class="cell__input"
                  :value="cell.value"
                  @input="onChanged($event, cell)"
                />
              </div>
            </template>
            <span>{{ getPossibleValues(cell) }}</span>
          </v-tooltip>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { DefaultLocationResolver, IIndex } from "@/sudoku/LocationResolver";
import { DefaultBoard, ICell } from "@/sudoku/Board";
import { ArrayUtils } from "@/utils";

@Component
export default class SudokuView extends Vue {
  private _locationResolver!: DefaultLocationResolver;
  private board: DefaultBoard | null = null;

  private values: number[] = [];
  private hightlightIndexes: IIndex[] = [];
  private selectedHighliting: number | null = null;

  public created() {
    this._locationResolver = new DefaultLocationResolver(3, 3);
    this.board = new DefaultBoard(this._locationResolver);
    this.values.push(...ArrayUtils.range(this._locationResolver.size, 1));
  }

  @Watch("selectedHighliting")
  private selectedHighlitingChanged() {
    this.refreshHighlighting();
  }

  private refreshHighlighting() {
    const indexes: IIndex[] = [];
    if (this.selectedHighliting != null) {
      const valueIndexes = this.board?.getIndexes(this.selectedHighliting);
      valueIndexes?.forEach(ind => {
        indexes.push(...this._locationResolver.getAllIndexes(ind));
      });
    }
    this.hightlightIndexes.splice(0, this.hightlightIndexes.length, ...indexes);
  }

  private getTooltipDisabled(cell: ICell) {
    return cell.possibleValues.length == 0 || cell.value != null;
  }

  private getPossibleValues(cell: ICell) {
    return cell.possibleValues.join(", ");
  }

  private getClasses(cell: ICell): any {
    const borderInfo = this._locationResolver.getBorderInfo(cell.index);
    const highlight =
      this.hightlightIndexes.findIndex(
        ind => cell.index.c == ind.c && cell.index.r == ind.r
      ) >= 0;
    return {
      "border-top": borderInfo.top,
      "border-right": borderInfo.right,
      "border-bottom": borderInfo.bottom,
      "border-left": borderInfo.left,
      highlight
    };
  }

  private onChanged($event: any, cell: ICell) {
    const value = $event.target.value ? parseInt($event.target.value) : null;
    if (this.board?.setValue(cell.index, value)) {
      this.refreshHighlighting();
    }
  }
}
</script>

<style lang="scss" scoped>
$selected-border: 3px solid black !important;

.cell {
  &__input {
    width: 30px;
    height: 30px;
    text-align: center;
  }
}

table {
  margin: auto;
  border-collapse: collapse;
}
td {
  border: 2px solid lightgray;
}
.border {
  &-top {
    border-top: $selected-border;
  }
  &-right {
    border-right: $selected-border;
  }
  &-bottom {
    border-bottom: $selected-border;
  }
  &-left {
    border-left: $selected-border;
  }
}
.highlight {
  .cell__input {
    background-color: rgb(218, 97, 97);
  }
}
</style>
