import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  QueryList,
  Inject,
  forwardRef
} from '@angular/core';
import { GridComponent } from '../grid.component';

@Component({
  selector: 'df-grid-header-row',
  template: `
    <div
      class="df-grid-header-row-container"
      dfGridResize
      (widthChange)="widthChange.emit($event)">
      <df-grid-header-cell
        *ngFor="let cell of _grid.cells; trackBy: cellTrackBy"
        [cellTemplate]="cell"
        [style.min-width.px]="cell._minBasis$ | async"
        [style.width.px]="cell._basis$ | async">
      </df-grid-header-cell>
    </div>
  `,
  styleUrls: ['./grid-header-row.component.scss'],
  host: {
    '[class.df-grid-header-row]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridHeaderRowComponent {

  /**
   * Grid cell width changed.
   */
  @Output() widthChange = new EventEmitter<{ field: string, size: string }>();

  constructor(@Inject(forwardRef(() => GridComponent)) public _grid: GridComponent) {}

  /**
   * Track the rows by the field.
   */
  cellTrackBy(index: number, cell: any) {
    return cell.field;
  }

}
