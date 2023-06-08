# Label Widget

The Label Widget is a JavaScript-based UI component that allows users to create and manage labels. It provides a simple
interface for users to input label names, create badges with unique colors, and delete labels as needed. The widget
emits an event when the save button is clicked, providing the ability to capture and process the label data.

## Features

- Input field to enter label names
- Creating badges with randomly generated colors
- Deleting labels with a dustbin button
- Save button to export label data as JSON
- Event-based architecture for capturing label data

## Usage

1. Include the `widget.js` file in your HTML file using a `
<script>` tag.
2. Initialize the widget by calling the `LabelWidget.init()` method with the ID of the container element.
3. Listen for the `labelsSaved` event on the container element to capture the label data.
4. Customize the CSS styles within the `widget.js` file to match your desired widget appearance.

Example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Label Widget Demo</title>
</head>
<body>
  <div id="label-widget-container"></div>
  <script src="widget.js"></script>
  <script>
    // Initialize the widget with the container element
    LabelWidget.init('label-widget-container');
    // Event listener for the 'labelsSaved' event
    document.getElementById('label-widget-container').addEventListener('labelsSaved', function (event) {
      var labels = event.detail;
      console.log(labels); // JSON object containing the labels
    });
  </script>
</body>
</html>
```

[Demo](./index.html)

## License
This project is licensed under the MIT License.

Feel free to customize and use the Label Widget in your own projects. Contributions are welcome!
