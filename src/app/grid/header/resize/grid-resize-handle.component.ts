import { Component, ElementRef, OnInit, OnDestroy, Output, EventEmitter, HostBinding, ChangeDetectorRef, NgZone } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'df-grid-resize-handle',
  template: `<div></div>`,
  styleUrls: ['./grid-resize-handle.component.scss'],
  host: {
    '[class.df-grid-resize-handle]': 'true'
  }
})
export class GridResizeHandleComponent implements OnInit, OnDestroy {

  /**
   * The handle is resizing.
   */
  @Output() resizing = new EventEmitter<MouseEvent>();
  @Output() resizeEnd = new EventEmitter<MouseEvent>();

  @HostBinding('class.df-grid-resize-handle-active')
  active = false;

  private _destroy$ = new Subject();

  constructor(
    private _cd: ChangeDetectorRef,
    private _elementRef: ElementRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    fromEvent(this._elementRef.nativeElement, 'mousedown')
      .pipe(takeUntil(this._destroy$))
      .subscribe(((event: MouseEvent) => this.onMouseDown(event)));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Mouse down event fired, need to listen for mousemove and emit resizing.
   */
  onMouseDown(event: MouseEvent) {
    // cancel for right clicks
    if (event.which === 3) {
      return;
    }

    this.active = true;
    document.body.style['cursor'] = 'ew-resize';

    const mouseup = fromEvent(document, 'mouseup');
    const upSubscription = mouseup.subscribe((ev) => {
      this.active = false;
      document.body.style['cursor'] = 'inherit';

      this.resizeEnd.emit();
      this._cd.markForCheck();
      upSubscription.unsubscribe();
    });

    fromEvent(document, 'mousemove')
      .pipe(takeUntil(mouseup))
      .subscribe((ev: MouseEvent) => {
        this._ngZone.runOutsideAngular(() => this.resizing.emit(ev));
      });
  }

}
