const container = document.querySelector('.container');
const cubes = document.querySelectorAll('.cube');

let selectedCube = null;
let offsetX = 0;
let offsetY = 0;

cubes.forEach(cube => {
    cube.addEventListener('mousedown', startDrag);
});

function startDrag(event) {
    selectedCube = event.currentTarget;

    const cubeRect = selectedCube.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    offsetX = event.clientX - cubeRect.left;
    offsetY = event.clientY - cubeRect.top;

    // Preserve the cube's current position before removing it from the grid.
    const left = cubeRect.left - containerRect.left - container.clientLeft;
    const top = cubeRect.top - containerRect.top - container.clientTop;

    selectedCube.style.position = 'absolute';
    selectedCube.style.width = `${cubeRect.width / 1.31}px`;
    selectedCube.style.height = `${cubeRect.height}px`;
    selectedCube.style.left = `${left}px`;
    selectedCube.style.top = `${top}px`;
    selectedCube.style.margin = '0';

    selectedCube.classList.add('dragging');

    document.addEventListener('mousemove', dragCube);
    document.addEventListener('mouseup', stopDrag);
}

function dragCube(event) {
    if (!selectedCube) return;

    const containerRect = container.getBoundingClientRect();

    const maxX = container.clientWidth - selectedCube.offsetWidth;
    const maxY = container.clientHeight - selectedCube.offsetHeight;

    let x = event.clientX - containerRect.left
        - container.clientLeft - offsetX;

    let y = event.clientY - containerRect.top
        - container.clientTop - offsetY;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    selectedCube.style.left = `${x}px`;
    selectedCube.style.top = `${y}px`;
}

function stopDrag() {
    if (selectedCube) {
        selectedCube.classList.remove('dragging');
        selectedCube = null;
    }

    document.removeEventListener('mousemove', dragCube);
    document.removeEventListener('mouseup', stopDrag);
}