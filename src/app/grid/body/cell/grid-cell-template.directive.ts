import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dfGridCellTemplate]'
})
export class GridCellTemplateDirective {

  constructor(public templateRef: TemplateRef<any>) {}

}
