import { Directive, Renderer2, ElementRef, OnInit, Input  } from '@angular/core';

@Directive({
  selector: '[appSafeDataDirective]'
})
export class SafeDataDirectiveDirective {
  @Input() passedHtmlData:string = '';

  /**
   * This is a constructor function that takes in a Renderer2 and ElementRef as parameters.
   * @param {Renderer2} renderer - The `Renderer2` is a service provided by Angular that allows you to manipulate the DOM
   * (Document Object Model) in a safe and efficient way. It provides methods for creating, updating, and deleting DOM
   * elements, as well as for setting and getting their attributes and styles.
   * @param {ElementRef} el - `el` is an instance of `ElementRef`, which is a wrapper around a native element in the DOM.
   * It provides access to the underlying native element and can be used to manipulate its properties and attributes. The
   * `ElementRef` is typically injected into a component or directive constructor and used to interact
   */
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  /**
   * The ngOnInit function appends passed HTML data to the native element using the renderer.
   */
  ngOnInit() {
    this.renderer.appendChild(this.el.nativeElement, this.passedHtmlData);
  }
}
