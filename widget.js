(function () {
  // Create the LabelWidget object
  var LabelWidget = {};

  // Initialize the widget
  LabelWidget.init = function (containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.error("Container element not found");
      return;
    }

    // Create widget HTML
    container.innerHTML = `
       <div id="label-widget">
        <input type="text" id="label-input" placeholder="Enter label text">
        <div id="label-box">
          <span id="label-count">Total Labels: 0</span>
          <div id="label-list"></div>
          <button id="save-button">SAVE</button>
        </div>
      </div>
      <div class="hidden">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" id="dustbin-icon">
          <path
            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </div>
      
      <style>
      #label-widget {
        display: flex;
        border: 1px solid;
        box-sizing: border-box;
        padding: 5px;
        width: 600px;
        height: 300px;
      }

      #label-box {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 50%;
        box-sizing: border-box;
        padding: 5px;
      }

      #label-count {
        background-color: #f5f5f5;
        box-sizing: border-box;
        padding: 5px;
        margin-bottom: 5px;
        width: 100%;
        z-index: 1;
      }

      #label-input {
        margin-right: 10px;
        width: 50%;
        /* padding: 5px; */
        /* margin: 5px; */
        flex: 1;
        /* resize: vertical; */
        min-height: 50px;
        /* height: 100%; */
      }

      #label-list {
        display: flex;
        flex-direction: column;
        max-height: 100%;
        width: 100%;
        /* margin: 5px; */
        /* padding: 5px; */
        /* Adjust the value as needed to prevent overflowing */
        overflow-y: auto;
        flex: 1;
      }

      .label-badge {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 5px;
        border-left: 5px solid;
      }

      .label-text {
        margin-right: 10px;
      }

      .label-delete {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 2px;
        border-radius: 50%;
      }

      .label-delete:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }

      .hidden {
        display: none;
      }

      #save-button {
        display: block;
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #007bff;
        /* Replace with desired background color */
        color: #fff;
        /* Replace with desired text color */
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      #save-button:hover {
        background-color: #0056b3;
        /* Replace with desired hover background color */
      }

      #save-button:focus {
        outline: none;
      }
      </style>
    `;

    // Get widget elements
    var labelInput = container.querySelector("#label-input");
    var labelList = container.querySelector("#label-list");
    var labelCount = container.querySelector("#label-count");
    var saveButton = container.querySelector("#save-button");

    var totalLabels = 0;
    var labelNames = new Set(); // Set to store unique label names
    var labelColors = new Set(); // Set to store unique label colors

    // Event listener for label input
    labelInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const labelText = labelInput.value.trim(); // Remove leading/trailing whitespace

        if (labelText !== "") {
          if (!labelNames.has(labelText)) {
            createLabelBadge(labelText);
            labelInput.value = "";
          } else {
            console.log("Label name must be unique");
          }
        } else {
          console.log("Label name cannot be blank");
        }
      }
    });

    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    labelInput.addEventListener("mousedown", (event) => {
      if (event.target === labelInput) {
        isResizing = true;
        startY = event.clientY;
        startHeight = labelInput.offsetHeight;

        document.addEventListener("mousemove", resizeInputHeight);
        document.addEventListener("mouseup", stopResizeInputHeight);
      }
    });

    function resizeInputHeight(event) {
      if (!isResizing) return;
      const deltaY = event.clientY - startY;
      const newHeight = startHeight + deltaY;
      labelInput.style.height = `${newHeight}px`;
    }

    function stopResizeInputHeight() {
      isResizing = false;
      document.removeEventListener("mousemove", resizeInputHeight);
      document.removeEventListener("mouseup", stopResizeInputHeight);
    }

    // Event listener for save button
    saveButton.addEventListener("click", function () {
      let labels = exportLabels();
      // Emit custom event with labels data
      var event = new CustomEvent("labelsSaved", { detail: labels });
      container.dispatchEvent(event);
    });

    function createLabelBadge(text) {
      const badge = document.createElement("div");
      badge.className = "label-badge";
      const color = getRandomColor();

      if (!labelColors.has(color)) {
        badge.style.backgroundColor = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, 0.2)`;
        badge.style.borderLeftColor = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, 1)`;

        const labelText = document.createElement("span");
        labelText.className = "label-text";
        labelText.innerText = text;

        const labelDelete = document.createElement("span");
        labelDelete.className = "label-delete";
        console.log(container);
        const deleteSVG = container.querySelector("#dustbin-icon").outerHTML;
        labelDelete.innerHTML = deleteSVG;

        labelDelete.addEventListener("click", () => {
          labelList.removeChild(badge);
          updateLabelCount(-1);
          labelNames.delete(text);
          labelColors.delete(color);
        });

        badge.appendChild(labelText);
        badge.appendChild(labelDelete);
        labelList.prepend(badge);
        updateLabelCount(1);
        labelNames.add(text);
        labelColors.add(color);
      } else {
        alert("Label color must be unique");
      }
    }

    function updateLabelCount(countChange) {
      totalLabels += countChange;
      labelCount.innerText = "Total Labels: " + totalLabels;
    }

    function getRandomColor() {
      const hue = Math.floor(Math.random() * 361); // Random hue value from 0 to 360
      const saturation = Math.floor(Math.random() * 101); // Random saturation value from 0 to 100
      const lightness = Math.floor(Math.random() * 51) + 25; // Random lightness value from 25 to 75

      return { hue, saturation, lightness };
    }

    function exportLabels() {
      const labels = [];
      const labelBadges = labelList.querySelectorAll(".label-badge");

      labelBadges.forEach((badge) => {
        const labelText = badge.querySelector(".label-text").innerText;
        const backgroundColor = badge.style.backgroundColor;
        const borderColor = badge.style.borderLeftColor;

        const label = {
          text: labelText,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        };

        labels.push(label);
      });

      return labels;
    }
  };

  // Make the LabelWidget object globally accessible
  window.LabelWidget = LabelWidget;
})();
