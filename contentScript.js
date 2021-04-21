const navigatorModule = (function () {
  function getCentralHighlight(highlights, pageCentralPoint) {
    const highlightsSortedByDistanceFromCenter = highlights
      .map(highlight => [highlight, getCentralPoint(highlight)])
      .map(([highlight, highlightCentralPoint]) => ({
        highlight,
        distanceFromCenter: getCartesianDistance(highlightCentralPoint, pageCentralPoint)
      }))
      .sort((highlight1, highlight2) => highlight1.distanceFromCenter - highlight2.distanceFromCenter);

    return highlightsSortedByDistanceFromCenter.length > 0
      ? highlightsSortedByDistanceFromCenter[0].highlight
      : null;
  }

  function getCentralPoint(highlight) {
    const rect = highlight.getBoundingClientRect();
    return { x: rect.x + .5*rect.width, y: rect.y + .5*rect.height };
  }

  function getCartesianDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
  }

  return {
    getCentralHighlight
  };
})();

const domHighlightModule = (function () {
  function createHighlightsOnPage(domDocument) {
    return queryClickableAll(domDocument).map(createHighlightFromClickable.bind(null, domDocument));
  }

  function selectHighlight(highlight) {
    Object.assign(highlight.style, {
      background: "yellow",
      opacity: .5
    });
  }

  function queryClickableAll(domDocument) {
    const clickableSelector = "a, button, input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"]";
    return Array.from(domDocument.querySelectorAll(clickableSelector));
  }

  function createHighlightFromClickable(domDocument, clickableElement) {
    const elementPosition = clickableElement.getBoundingClientRect();
    const highlight = domDocument.createElement("div");
    Object.assign(highlight.style, {
      background: "transparent",
      border: "2px solid black",
      height: elementPosition.height + "px",
      left: (elementPosition.left + domDocument.documentElement.scrollLeft) + "px",
      position: "absolute",
      top: (elementPosition.top + domDocument.documentElement.scrollTop) + "px",
      width: elementPosition.width + "px",
      zIndex: 999999999
    });
    return highlight;
  }

  return {
    createHighlightsOnPage,
    selectHighlight
  }
})();

const highlightsModule = (function () {
  const self = {
    highlights: [],
    highlightsVisible: false
  };

  function toggleHighlights(domWindow) {
    self.highlightsVisible ? hide() : show(domWindow);
    self.highlightsVisible = !self.highlightsVisible;
  }

  function show(domWindow) {
    const domDocument = domWindow.document;
    self.highlights = domHighlightModule.createHighlightsOnPage(domDocument);
    self.highlights.forEach(highlight => domDocument.body.appendChild(highlight));
  }

  function hide() {
    self.highlights.forEach(highlight => highlight.remove());
    self.highlights = [];
  }

  return {
    toggleHighlights
  };
})();

window.document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "f": highlightsModule.toggleHighlights(window);
  }
});
