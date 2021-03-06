export type Rectangle = DOMRect;

export type Highlight = {
  clickable: HTMLElement;
  element: HTMLElement;
  rect: Rectangle;
};

export type Point = {
  x: number;
  y: number;
};
