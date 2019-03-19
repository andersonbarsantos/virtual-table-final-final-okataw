import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dfGridHeaderCellTemplate]'
})
export class GridHeaderCellTemplateDirective {

  constructor(public templateRef: TemplateRef<any>) {}

}
