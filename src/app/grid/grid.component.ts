import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  AfterContentInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ContentChildren,
  ContentChild,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, fromEvent, animationFrameScheduler, Subject, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, sampleTime, takeUntil, take } from 'rxjs/operators';

import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '../scrolling';

import { GridColumnComponent } from './grid-column.component';
import { ColumnWidthHelper } from './column-width';

@Component({
  selector: 'df-grid',
  template: `
    <div class="df-grid-container">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class.mat-elevation-z8]': 'true',
    '[class.df-grid]': 'true'
  },
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements AfterContentInit, OnDestroy {

  @ContentChildren(GridColumnComponent) cellTemplates: QueryList<GridColumnComponent>;
  @ContentChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;
  @ContentChild(CdkVirtualForOf) virtualFor: CdkVirtualForOf<any>;
  @ContentChild(CdkFixedSizeVirtualScroll) fixedScroll: CdkFixedSizeVirtualScroll;

  pageSize$ = new BehaviorSubject(0);
  pageIndex$ = new BehaviorSubject(0);
  cells: GridColumnComponent[];
  private _pageHeight = 0;
  private _viewportWidth = 0;
  private _destroy$ = new Subject();

  constructor(
    private _elementRef: ElementRef,
    private _cd: ChangeDetectorRef,
    private _columnHelper: ColumnWidthHelper
  ) {}

  ngAfterContentInit() {
    fromEvent(window, 'resize')
      .pipe(
        distinctUntilChanged(),
        debounceTime(10),
        sampleTime(0, animationFrameScheduler),
        takeUntil(this._destroy$)
      ).subscribe(() => this.onResize());

    fromEvent(this.scrollViewport.elementRef.nativeElement, 'scroll')
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      ).subscribe(() => this.onScroll());

    this.virtualFor.dataStream
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.updateSizes();
        this._cd.detectChanges();
      });

    this.cellTemplates.changes
      .pipe(takeUntil(this._destroy$))
      .subscribe((() => {
        this.updateColumns(this.getViewportWidth());
        this._cd.markForCheck();
      }));

    this.updateColumns(this.getViewportWidth());
    this.updateSizes();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Scroll to the row passed.
   */
  scrollToRow(row: any) {
    this.virtualFor.dataStream.pipe(take(1)).subscribe(datasource => {
      const idx = datasource.indexOf(row);
      this.scrollViewport.scrollToIndex(idx, { smooth: true, lazy: true });
    });
  }

  /**
   * Scroll to the offset passed. Only scrolls if the offset is out of view.
   */
  scrollToOffset(top: number) {
    this.scrollViewport.scrollToOffset(top, { smooth: true, lazy: true });
  }

  /**
   * Window resize was triggered, need to update the viewport and page sizes.
   */
  onResize() {
    this.cells = this._columnHelper.sizeColumns(
      [...this.cells], this.getViewportWidth(true), true);

    this.scrollViewport.updateViewport();
    this.updateSizes();
  }

  /**
   * Virtual scroll body was scrolled. Need to calculate the page index.
   */
  onScroll() {
    const offset = this.scrollViewport.measureScrollOffset();
    const idx = this.getPageForOffset(offset);
    this.pageIndex$.next(idx);
  }

  /**
   * Page index was changed via the footer. Scroll into view of the page.
   */
  onPageIndexChange(index: number) {
    this.scrollToOffset(index * this._pageHeight);
  }

  /**
   * Called on init and resize to calculate page sizes.
   */
  updateSizes() {
    const pageSize = this.getPageSize();
    this.pageSize$.next(pageSize);
    this._pageHeight = this.getPageHeight();
  }

  /**
   * Update the columns sizes.
   */
  updateColumns(viewPortWidth: number, forceRebasis = false) {
    const newCells = this.cellTemplates.toArray();

    if (!this.cells || newCells.length !== this.cells.length) {
       // TODO: Figure out a better way
      // If we have existing cells, lets transpose our widths
      // onto the new cells
      if (this.cells) {
        for (const cell of this.cells) {
          const newCell = newCells.find(c => c.field === cell.field);
          if (newCell) {
            newCell.width = cell.width;
          }
        }
      }

      this.cells = this._columnHelper.sizeColumns(newCells, viewPortWidth, forceRebasis);
    }
  }

  /**
   * Gets the page size given the body height and row height.
   */
  getPageSize() {
    const rowHeight = this.fixedScroll.itemSize;
    const bodyHeight = this.scrollViewport.getViewportSize();
    return Math.max(Math.ceil(bodyHeight / rowHeight), 0);
  }

  /**
   * Gets the page height. This is the actual number of rows rendered height.
   */
  getPageHeight() {
    const rowHeight = this.fixedScroll.itemSize;
    const pageSize = this.pageSize$.getValue();
    return Math.floor(pageSize * rowHeight);
  }

  /**
   * Get the page for the given offset.
   */
  getPageForOffset(offset: number) {
    return Math.floor(Math.max(offset / this._pageHeight, 0));
  }

  /**
   * Get the width of the viewport so we can use it to calculate the columns.
   */
  getViewportWidth(update = false) {
    if (!this._viewportWidth || update) {
      this._viewportWidth = this._elementRef.nativeElement.getBoundingClientRect().width;
    }
    return this._viewportWidth;
  }

}
