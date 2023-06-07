const labelInput = document.getElementById('label-input');
const labelList = document.getElementById('label-list');
const labelCount = document.getElementById('label-count');
const saveButton = document.getElementById('save-button');


saveButton.addEventListener('click', () => {
  exportLabels();
});

let totalLabels = 0;
const labelNames = new Set(); // Set to store unique label names
const labelColors = new Set(); // Set to store unique label colors

labelInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const labelText = labelInput.value.trim(); // Remove leading/trailing whitespace

    if (labelText !== '') {
      if (!labelNames.has(labelText)) {
        createLabelBadge(labelText);
        labelInput.value = '';
      } else {
        console.log('Label name must be unique');
      }
    } else {
      console.log('Label name cannot be blank');
    }
  }
});

let isResizing = false;
let startY = 0;
let startHeight = 0;

labelInput.addEventListener('mousedown', (event) => {
  if (event.target === labelInput) {
    isResizing = true;
    startY = event.clientY;
    startHeight = labelInput.offsetHeight;

    document.addEventListener('mousemove', resizeInputHeight);
    document.addEventListener('mouseup', stopResizeInputHeight);
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
  document.removeEventListener('mousemove', resizeInputHeight);
  document.removeEventListener('mouseup', stopResizeInputHeight);
}

function createLabelBadge(text) {
  const badge = document.createElement('div');
  badge.className = 'label-badge';
  const color = getRandomColor();

  if (!labelColors.has(color)) {
    badge.style.backgroundColor = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, 0.2)`;
    badge.style.borderLeftColor = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, 1)`;

    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    labelText.innerText = text;

    const labelDelete = document.createElement('span');
    labelDelete.className = 'label-delete';
    labelDelete.innerHTML = document.getElementById('dustbin-icon').outerHTML;
    labelDelete.addEventListener('click', () => {
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
    alert('Label color must be unique');
  }
}

function updateLabelCount(countChange) {
  totalLabels += countChange;
  labelCount.innerText = `Total Labels: ${totalLabels}`;
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 361); // Random hue value from 0 to 360
  const saturation = Math.floor(Math.random() * 101); // Random saturation value from 0 to 100
  const lightness = Math.floor(Math.random() * 51) + 25; // Random lightness value from 25 to 75

  return { hue, saturation, lightness };
}

function exportLabels() {
  const labels = [];
  const labelBadges = labelList.querySelectorAll('.label-badge');

  labelBadges.forEach((badge) => {
    const labelText = badge.querySelector('.label-text').innerText;
    const backgroundColor = badge.style.backgroundColor;
    const borderColor = badge.style.borderLeftColor;

    const label = {
      text: labelText,
      backgroundColor: backgroundColor,
      borderColor: borderColor
    };

    labels.push(label);
  });

  console.log(labels);
}
