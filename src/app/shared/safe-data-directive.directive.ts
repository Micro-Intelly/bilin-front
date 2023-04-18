import { Directive, Renderer2, ElementRef, OnInit, Input  } from '@angular/core';

@Directive({
  selector: '[appSafeDataDirective]'
})
export class SafeDataDirectiveDirective {
  @Input() passedHtmlData:string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.renderer.appendChild(this.el.nativeElement, this.passedHtmlData);
  }
}
