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

    const left = cubeRect.left - containerRect.left
        - container.clientLeft;
    const top = cubeRect.top - containerRect.top
        - container.clientTop;

    // Preserve the cube's dimensions before removing it from the grid.
    const width = selectedCube.offsetWidth;
    const height = selectedCube.offsetHeight;

    selectedCube.style.width = `${width}px`;
    selectedCube.style.height = `${height}px`;
    selectedCube.style.position = 'absolute';
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
    const cubeRect = selectedCube.getBoundingClientRect();

    const containerLeft = containerRect.left + container.clientLeft;
    const containerTop = containerRect.top + container.clientTop;

    const visualLeft = cubeRect.left -
        (containerLeft + selectedCube.offsetLeft);
    const visualTop = cubeRect.top -
        (containerTop + selectedCube.offsetTop);
    const visualRight = cubeRect.right -
        (containerLeft + selectedCube.offsetLeft);
    const visualBottom = cubeRect.bottom -
        (containerTop + selectedCube.offsetTop);

    let x = event.clientX - containerLeft - offsetX;
    let y = event.clientY - containerTop - offsetY;

    x = Math.max(-visualLeft, Math.min(
        x, container.clientWidth - visualRight
    ));

    y = Math.max(-visualTop, Math.min(
        y, container.clientHeight - visualBottom
    ));

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