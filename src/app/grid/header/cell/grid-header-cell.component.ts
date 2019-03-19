import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  HostListener,
  Inject,
  forwardRef,
  HostBinding
} from '@angular/core';
import { GridColumnComponent } from '../../grid-column.component';
import { GridResizeHandleComponent } from '../resize/grid-resize-handle.component';

@Component({
  selector: 'df-grid-header-cell',
  template: `
    <div class="df-grid-header-cell-container">
      <span *ngIf="!cellTemplate.headerTemplate" [innerHTML]="cellTemplate.title"></span>
      <ng-template
        *ngIf="cellTemplate.headerTemplate"
        [ngTemplateOutlet]="cellTemplate.headerTemplate">
      </ng-template>
      <df-grid-resize-handle
        [hidden]="!cellTemplate.resizable">
      </df-grid-resize-handle>
    </div>
  `,
  styleUrls: ['./grid-header-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridHeaderCellComponent {

  /**
   * Cell template we are rendering.
   */
  @Input() cellTemplate: GridColumnComponent;

  /**
   * Flex was resized by the resize handle.
   */
  @Output() widthChange = new EventEmitter();

  @HostBinding('class')
  get cssClass() {
    if (this.cellTemplate._cssClassFriendlyName) {
      return `${this.cellTemplate._cssClassFriendlyName}-cell df-grid-cell`;
    }
    return 'df-grid-header-cell';
  }

  @ViewChild(GridResizeHandleComponent) resizeHandle: GridResizeHandleComponent;

}
