import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatIconModule } from '@angular/material';
import { ScrollingModule } from '../scrolling';

import { GridComponent } from './grid.component';
import { GridColumnComponent } from './grid-column.component';
import { GridCellTemplateDirective } from './body/cell/grid-cell-template.directive';

import { GridResizeDirective } from './header/resize/grid-resize.directive';
import { GridResizeHandleComponent } from './header/resize/grid-resize-handle.component';
import { GridHeaderRowComponent } from './header/grid-header-row.component';
import { GridHeaderCellComponent } from './header/cell/grid-header-cell.component';
import { GridHeaderCellTemplateDirective } from './header/cell/grid-header-cell-template.directive';

import { GridRowComponent } from './body/grid-row.component';
import { GridBodyCellComponent } from './body/cell/grid-body-cell.component';

import { GridPagerComponent } from './footer/pager.component';
import { GridFooterComponent } from './footer/footer.component';
import { ColumnWidthHelper } from './column-width';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    GridComponent,
    GridColumnComponent,
    GridCellTemplateDirective,
    GridHeaderRowComponent,
    GridHeaderCellComponent,
    GridRowComponent,
    GridBodyCellComponent,
    GridResizeDirective,
    GridResizeHandleComponent,
    GridPagerComponent,
    GridHeaderCellTemplateDirective,
    GridFooterComponent
  ],
  exports: [
    GridComponent,
    GridColumnComponent,
    GridCellTemplateDirective,
    GridRowComponent,
    GridHeaderCellTemplateDirective,
    GridPagerComponent,
    GridFooterComponent,
    GridHeaderRowComponent,
    GridHeaderCellComponent,
    GridBodyCellComponent
  ],
  providers: [ColumnWidthHelper]
})
export class GridModule {}
