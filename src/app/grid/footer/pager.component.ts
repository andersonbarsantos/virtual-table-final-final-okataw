import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'df-grid-pager',
  template: `
    <div *ngIf="showWheel">
      <button mat-icon-button [disabled]="pageNumber === 1" (click)="selectPage(1)">
        <mat-icon aria-label="First page">first_page</mat-icon>
      </button>
      <button mat-icon-button [disabled]="!canPrevious" (click)="prevPage()">
        <mat-icon aria-label="Next page">chevron_left</mat-icon>
      </button>
      <button
        type="button"
        mat-button
        *ngFor="let index of pageWheel"
        class="df-grid-page-button"
        [attr.aria-label]="'Page ' + index"
        [class.df-grid-page-active]="index === pageNumber"
        (click)="selectPage(index)">
        {{index | number}}
      </button>
      <button mat-icon-button [disabled]="!canNext" (click)="nextPage()">
        <mat-icon aria-label="Next page">chevron_right</mat-icon>
      </button>
      <button mat-icon-button [disabled]="pageNumber === totalPages" (click)="selectPage(totalPages)">
        <mat-icon aria-label="Last page">last_page</mat-icon>
      </button>
    </div>
  `,
  host: {
    '[class.df-grid-pager]': 'true'
  },
  styleUrls: ['./pager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPagerComponent implements OnInit, OnChanges {

  /**
   * The active page (zero based).
   */
  @Input() pageIndex: number;

  /**
   * Total number of pages.
   */
  @Input() length: number;

  /**
   * Page size.
   */
  @Input() pageSize: number;

  /**
   * Page index changed.
   */
  @Output() pageIndexChange = new EventEmitter();

  get pageNumber() {
    if (!this.pageIndex) return 1;
    return this.pageIndex + 1;
  }

  totalPages = 0;
  pageWheel = [];
  canPrevious = false;
  canNext = false;
  showWheel = false;

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  /**
   * Update the calculated properties.
   */
  update() {
    this.canPrevious = this.getCanPrevious();
    this.canNext = this.getCanNext();
    this.totalPages = this.getTotalPages();
    this.pageWheel = this.buildPageWheel();
    this.showWheel = this.length && this.totalPages !== 1;
  }

  /**
   * A page was clicked, emit a event for the body to respond to.
   */
  selectPage(page: number) {
    if (page > 0 && page <= this.totalPages && page !== this.pageNumber) {
      // No need to update the index here, the scroller will update it
      this.pageIndexChange.emit(page - 1);
    }
  }

  /**
   * Select the previous page.
   */
  prevPage(): void {
    this.selectPage(this.pageNumber - 1);
  }

  /**
   * Select the next page.
   */
  nextPage(): void {
    this.selectPage(this.pageNumber + 1);
  }

  /**
   * Get the total number of pages available.
   */
  getTotalPages() {
    const count = this.pageSize < 1 ? 1 : Math.floor(this.length / this.pageSize);
    return Math.max(count || 0, 1);
  }

  /**
   * Determine if you can select previous.
   */
  getCanPrevious() {
    return this.pageNumber > 1;
  }

  /**
   * Determine if you can click next.
   */
  getCanNext() {
    return this.pageNumber < this.totalPages;
  }

  /**
   * Build the page wheel.
   */
  buildPageWheel() {
    const pages = [];
    const maxSize = 5;
    const totalPages = this.totalPages;
    const isMaxSized = maxSize < totalPages;
    const page = this.pageNumber;
    let startPage = 1;
    let endPage = this.totalPages;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, totalPages);
      } else if (endPage > totalPages) {
        startPage = Math.max(totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let index = startPage; index <= endPage; index++) {
      pages.push(index);
    }

    return pages;
  }

}
