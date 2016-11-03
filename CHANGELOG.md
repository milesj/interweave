# 1.1.0
* Added an `interweave` class to all rendered HTML elements.
* Added an `interweave--no-html` class when `noHtml` is enabled.
* Updated the `content` prop to accept null or undefined values. Will
  default to an empty string.
* Removed the `data-interweave` attribute from elements.
* Removed the `className` prop from `Interweave` and `Markup`.
* Fixed an issue where void elements (`br`, `hr`, etc) would not render
  correctly.

# 1.0.1
* Fixed an issue in which empty parses would pass an empty child to
  `Element`, triggering a prop type failure.

# 1.0.0
* Initial release!
