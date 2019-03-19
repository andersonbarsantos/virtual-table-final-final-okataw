import { Directive, AfterContentInit, ContentChildren, QueryList, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { GridResizeHandleComponent } from './grid-resize-handle.component';
import { GridHeaderCellComponent } from '../cell/grid-header-cell.component';
import { ColumnWidthHelper } from '../../column-width';
import { GridHeaderRowComponent } from '../grid-header-row.component';

@Directive({
  selector: '[dfGridResize]'
})
export class GridResizeDirective implements AfterContentInit {

  @Output() widthChange = new EventEmitter<{ field: string, size: string }>();

  @ContentChildren(GridHeaderCellComponent) cells: QueryList<GridHeaderCellComponent>;

  private _previousX: number;
  private _first: GridHeaderCellComponent;
  private _next: GridHeaderCellComponent;

  constructor(
    private _columnHelper: ColumnWidthHelper,
    @Inject(forwardRef(() => GridHeaderRowComponent)) private _header: GridHeaderRowComponent
  ) {}

  ngAfterContentInit() {
    this.cells.forEach((cell: GridHeaderCellComponent) => {
      cell.resizeHandle.resizing.subscribe(ev => this.onResize(ev, cell));
      cell.resizeHandle.resizeEnd.subscribe(() => this.onResizeEnd());
    });
  }

  /**
   * A resize handle resized was called. This function will:
   * - Calculate the delta to resize the current column
   * - Determine the delta to distribute to the other columns
   * - Determine the direction to add/subtract the other columns
   */
  onResize(event: MouseEvent, cell: GridHeaderCellComponent) {
    const direction = this.determineDirection(event);
    if (direction) {
      const areas = this.findColumnsToResize(cell);
      const delta = event.movementX;

      // Reset our cache
      this._first = undefined;
      this._next = undefined;

      const [first, next] = areas;
      if (next) {
        // Calculate our new width from the delta
        const firstWidth = first.cellTemplate.basis;
        const diff = (firstWidth + delta) - firstWidth;
        const newFirstWidth = firstWidth + delta;

        // Determine which direction we are going and reverse if needed
        let dividedDelta = Math.abs(diff);
        if (direction === 'right') {
          dividedDelta = dividedDelta * -1;
        }

        // Calculate our new next width from the delta
        const nextWidth = next.cellTemplate.basis;
        const newNextWidth = nextWidth + dividedDelta;
        const viewportWidth = this._header._grid.getViewportWidth();

        // Get min widths to make sure we don't go beyond that
        const firstMinWidth = first.cellTemplate.minBasis;
        const nextMinWidth = next.cellTemplate.minBasis;

        // If the widths aze greater than the min width, proceed
        if (newFirstWidth > 0 &&
            newNextWidth > 0 &&
            newFirstWidth > firstMinWidth &&
            newNextWidth > nextMinWidth) {
          // Reset the basis width to the new width
          first.cellTemplate.width = this._columnHelper.getWidth(
            first.cellTemplate,
            newFirstWidth,
            viewportWidth);

          first.cellTemplate.basis = newFirstWidth;

          next.cellTemplate.width = this._columnHelper.getWidth(
            next.cellTemplate,
            newNextWidth,
            viewportWidth);

          next.cellTemplate.basis = newNextWidth;

          this._first = first;
          this._next = next;
        }
      }
    }
  }

  /**
   * Resize ended, emit our event for done.
   */
  onResizeEnd() {
    if (this._first && this._next) {
      this.widthChange.emit({
        field: this._first.cellTemplate.field,
        size: this._first.cellTemplate.width
      });

      this.widthChange.emit({
        field: this._next.cellTemplate.field,
        size: this._next.cellTemplate.width
      });
    }
  }

  /**
   * Determine the direction of the drag.
   */
  determineDirection(event): 'left' | 'right' {
    let direction;

    if (event.pageX < this._previousX) {
      direction = 'left';
    } else if (event.pageX > this._previousX) {
      direction = 'right';
    }

    this._previousX = event.pageX;

    return direction;
  }

  /**
   * Find the columns we are going to resize.
   */
  findColumnsToResize(cell: GridHeaderCellComponent): GridHeaderCellComponent[] {
    const copies = this.cells.toArray();
    const areas = this.cells.toArray();
    let match = false;

    for (const copy of copies) {
      if (!match && copy !== cell) {
        const index = areas.indexOf(copy);
        areas.splice(index, 1);
        continue;
      }

      if (copy === cell) {
        match = true;
      } else if (!cell.cellTemplate.resizable) {
        const index = areas.indexOf(copy);
        areas.splice(index, 1);
      }
    }

    return areas;
  }

}
