import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  HostBinding
} from '@angular/core';
import { GridColumnComponent } from '../../grid-column.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FlexDirective } from '@angular/flex-layout';

@Component({
  selector: 'df-grid-body-cell',
  template: `
    <div class="df-grid-cell-container">
      <span
        *ngIf="!cellTemplate.template"
        [innerHTML]="row[cellTemplate.field]">
      </span>
      <ng-template
        *ngIf="cellTemplate.template"
        [ngTemplateOutlet]="cellTemplate.template"
        [ngTemplateOutletContext]="cellContext">
      </ng-template>
    </div>
  `,
  styleUrls: ['./grid-body-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridBodyCellComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Row we are rendering.
   */
  @Input() row: any;

  /**
   * Cell data we are rendering.
   */
  @Input() cellTemplate: GridColumnComponent;

  @HostBinding('class')
  get cssClass() {
    if (this.cellTemplate._cssClassFriendlyName) {
      return `${this.cellTemplate._cssClassFriendlyName}-cell df-grid-cell`;
    }
    return 'df-grid-cell';
  }

  cellContext = {
    row: undefined,
    value: undefined
  };

  private _destroy$ = new Subject();

  ngOnInit() {
    this.cellContext = {
      row: this.row,
      value: this.row[this.cellTemplate.field]
    };
  }

  ngOnChanges() {
    this.update();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Update the context.
   */
  update() {
    this.cellContext.row = this.row;
    this.cellContext.value = this.row[this.cellTemplate.field];
  }

}
