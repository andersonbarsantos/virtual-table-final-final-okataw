import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, Inject, forwardRef } from '@angular/core';
import { GridComponent } from '../grid.component';

@Component({
  selector: 'df-grid-footer',
  template: `
    <div class="df-grid-footer-container">
      <div class="total-col">
        {{length | number}} total
      </div>
      <div class="pager-col">
        <df-grid-pager
          [pageIndex]="_grid.pageIndex$ | async"
          [length]="length"
          [pageSize]="_grid.pageSize$ | async"
          (pageIndexChange)="onPageIndexChange($event)">
        </df-grid-pager>
      </div>
    </div>
  `,
  host: {
    '[class.df-grid-footer]': 'true'
  },
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridFooterComponent {

  /**
   * Total number of pages.
   */
  @Input() length: number;

    /**
   * Page index changed.
   */
  @Output() pageIndexChange = new EventEmitter();

  constructor(@Inject(forwardRef(() => GridComponent)) public _grid: GridComponent) {}

  /**
   * Pager updated the page index.
   */
  onPageIndexChange(index: number) {
    this._grid.onPageIndexChange(index);
    this.pageIndexChange.emit(index);
  }

}
