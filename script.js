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

    selectedCube.style.position = 'absolute';
    selectedCube.style.width = `${selectedCube.offsetWidth}px`;
    selectedCube.style.height = `${selectedCube.offsetHeight}px`;
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

    // Calculate the transformed cube's offsets from its untransformed origin.
    const offsetLeft = cubeRect.left -
        (containerLeft + selectedCube.offsetLeft);

    const offsetTop = cubeRect.top -
        (containerTop + selectedCube.offsetTop);

    const offsetRight = cubeRect.right -
        (containerLeft + selectedCube.offsetLeft);

    const offsetBottom = cubeRect.bottom -
        (containerTop + selectedCube.offsetTop);

    let x = event.clientX - containerLeft - offsetX;
    let y = event.clientY - containerTop - offsetY;

    // Constrain the transformed bounding box to the container.
    x = Math.max(-offsetLeft, Math.min(
        x,
        container.clientWidth - offsetRight
    ));

    y = Math.max(-offsetTop, Math.min(
        y,
        container.clientHeight - offsetBottom
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