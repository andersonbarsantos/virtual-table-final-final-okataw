import { Component, ChangeDetectionStrategy, Input, ContentChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { GridCellTemplateDirective } from './body/cell/grid-cell-template.directive';
import { Subject, BehaviorSubject } from 'rxjs';
import { GridHeaderCellTemplateDirective } from './header/cell/grid-header-cell-template.directive';

@Component({
  selector: 'df-grid-column',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridColumnComponent {

  /**
   * Field attribute which is read from the row data.
   */
  @Input()
  set field(val: string) {
    this._field = val;
    this._cssClassFriendlyName = val.replace(/[^a-z0-9_-]/ig, '-');
  }
  get field() { return this._field; }

  /**
   * Title for the cell header.
   */
  @Input() title: string;

  /**
   * Whether the cell is resizable or not.
   */
  @Input() resizable = true;

  /**
   * Whether the column can grow not.
   */
  @Input() grow = true;

  /**
   * Whether the column can shrink or not.
   */
  @Input() shrink = false;

  /**
   * Min width of the column.
   */
  @Input()
  set minWidth(val: string) {
    this._minWidth = val;
    this.minBasis = undefined;
  }
  get minWidth() { return this._minWidth; }

  /**
   * Flex distribution for the cell.
   */
  @Input()
  set width(val: string) {
    this._width = val;
    this.basis = undefined;
  }
  get width() { return this._width; }

  /**
   * The pixel value of the width. Used internally.
   */
  set basis(val: number) {
    this._basis$.next(val);
  }
  get basis() { return this._basis$.getValue(); }

  /**
   * The pixel value of the min width. Used internally.
   */
  set minBasis(val: number) {
    this._minBasis$.next(val);
  }
  get minBasis() { return this._minBasis$.getValue(); }

  /**
   * Width was changed by a resize.
   */
  @Output() widthChange = new EventEmitter();

  @ContentChild(GridCellTemplateDirective, { read: TemplateRef }) template: GridCellTemplateDirective;
  @ContentChild(GridHeaderCellTemplateDirective, { read: TemplateRef }) headerTemplate: GridHeaderCellTemplateDirective;

  _cssClassFriendlyName: string;
  _field: string;
  _width: string;
  _minWidth = '50px';
  _basis$ = new BehaviorSubject(undefined);
  _minBasis$ = new BehaviorSubject(undefined);

}
