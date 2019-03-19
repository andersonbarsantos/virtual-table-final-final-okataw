import { GridColumnComponent } from './grid-column.component';
import { Injectable } from '@angular/core';

@Injectable()
export class ColumnWidthHelper {

  /**
   * Resizes the columns for the available space and
   * sets the property on the columns returning the columns array.
   */
  sizeColumns(columns: GridColumnComponent[], totalWidth: number,
      forceRebasis = false, allowOverflow = false): GridColumnComponent[] {
    let totalColumnWidths = 0;
    const resizableColumns = [];

    // - Pre calculate width of non-resizeable columns
    // - Calculate total width of all columns
    // - Calculate remaining width of columns that are resizable
    // - Calculate the number of resizable columns
    for (const column of columns) {
      // Cache the basis for later
      if (!column.basis || forceRebasis) {
        column.basis = this.getBasis(column.width, totalWidth);
      }

      // Cache the basis for later
      if (!column.minBasis || forceRebasis) {
        column.minBasis = this.getBasis(column.minWidth, totalWidth);
      }

      const basis = column.basis;

      if (!column.grow && !column.shrink) {
        column.basis = basis;
      } else {
        resizableColumns.push(column);
      }

      totalColumnWidths += basis;
    }

    const exceedsViewport = totalColumnWidths > totalWidth;
    let viewportDelta = totalWidth - totalColumnWidths;
    let deltaDistribution = viewportDelta / resizableColumns.length;
    const resizedColumns = [];
    totalColumnWidths = 0;

    // - Distribute widths evenly with original basis as foundation
    // - If total widths exceed viewport & overflow is not allowed, subtract evenly
    // - If total widths are less than viewport, distribute remaining width evently
    for (const column of resizableColumns) {
      let basis = column.basis;
      // TODO: Implement grow/shrink exclusion here
      if ((exceedsViewport && !allowOverflow) || !exceedsViewport) {
        basis = basis + deltaDistribution;
      }

      // Check we aren't min width
      if (basis <= column.minBasis) {
        basis = column.minBasis;
      } else {
        resizedColumns.push(column);
      }

      // Save the new basis
      column.basis = basis;
      totalColumnWidths += basis;
    }

    // If min width happened, we are skipping this distribution
    // and we need to post-process to redstribute that width
    if (resizedColumns.length !== resizableColumns.length) {
      viewportDelta = totalWidth - totalColumnWidths;
      deltaDistribution = viewportDelta / resizedColumns.length;

      for (const column of resizedColumns) {
        let basis = column.basis;
        if ((exceedsViewport && !allowOverflow) || !exceedsViewport) {
          basis = basis + deltaDistribution;
        }

        column.basis = basis;
      }
    }

    return columns;
  }

  /**
  * Get the width given a new basis.
  */
  getWidth(column: GridColumnComponent, width: number, totalWidth: number) {
    const isPx = column.width.indexOf('px') > -1;
    if (isPx) return `${width}px`;

    return `${(width / totalWidth) * 100}%`;
  }

  /**
  * Convert the width to a basis pixel.
  */
  getBasis(width: string, totalWidth: number) {
    if (!width) return 0;

    const isPx = width.indexOf('px') > -1;
    const value = this.toValue(width);
    const basisPctToPx = totalWidth * (value / 100);
    const basis = isPx ? value : basisPctToPx;
    return basis;
  }

  /**
  * Convert the width from a %/px value to a number.
  */
  toValue(basis: string) {
    if (typeof basis === 'string') {
      return parseFloat(basis.replace('%', '').replace('px', ''));
    }

    return basis;
  }

}
