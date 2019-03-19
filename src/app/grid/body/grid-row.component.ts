import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  AfterViewInit,
  QueryList,
  Inject,
  forwardRef,
  Self,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { GridComponent } from '../grid.component';
import { GridColumnComponent } from '../grid-column.component';
import { CdkFixedSizeVirtualScroll } from '../../scrolling';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'df-grid-row',
  template: `
    <div class="df-grid-row-container" [style.height.px]="itemSize">
      <df-grid-body-cell
        *ngFor="let cell of _grid.cells; trackBy: cellTrackBy"
        [row]="row"
        [cellTemplate]="cell"
        [style.min-width.px]="cell._minBasis$ | async"
        [style.width.px]="cell._basis$ | async">
      </df-grid-body-cell>
    </div>
  `,
  styleUrls: ['./grid-row.component.scss'],
  host: {
    '[class.df-grid-row]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridRowComponent implements AfterViewInit, OnDestroy {

  /**
   * Row data we are rendering.
   */
  @Input() row: any;

  /**
   * Height of the row from the virtual scroll
   */
  get itemSize() {
    return this._scrollViewport.itemSize;
  }

  private _destroy$ = new Subject();

  constructor(
    @Inject(forwardRef(() => GridComponent)) public _grid: GridComponent,
    @Inject(forwardRef(() => CdkFixedSizeVirtualScroll)) private _scrollViewport: CdkFixedSizeVirtualScroll,
    private _cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Listen for changes and manually call update. This is required
    // when things externally change the columns.
    this._grid.cellTemplates.changes
      .pipe(takeUntil(this._destroy$))
      .subscribe((() => this._cd.detectChanges()));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Track the columns by field property.
   */
  cellTrackBy(index: number, cell: GridColumnComponent) {
    return cell.field;
  }

}
