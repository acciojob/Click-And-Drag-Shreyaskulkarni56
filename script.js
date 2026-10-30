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

    // Preserve the original layout dimensions.
    const width = selectedCube.offsetWidth;
    const height = selectedCube.offsetHeight;

    selectedCube.style.position = 'absolute';
    selectedCube.style.width = `${width}px`;
    selectedCube.style.height = `${height}px`;
    selectedCube.style.left = `${left}px`;
    selectedCube.style.top = `${top}px`;

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

    // Visual offsets relative to the cube's positioning origin.
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

    const minX = -visualLeft;
    const minY = -visualTop;
    const maxX = container.clientWidth - visualRight;
    const maxY = container.clientHeight - visualBottom;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

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