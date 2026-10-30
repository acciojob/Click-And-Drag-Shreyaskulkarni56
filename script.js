/* -------------------------------------------------
   Wrap everything in DOMContentLoaded so the DOM
   is ready before we query for elements.
------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('.container');
  const cubes = document.querySelectorAll('.cube');

  let selectedCube = null;
  let offsetX = 0;
  let offsetY = 0;

  /* -------------------------------------------------
     Attach the mousedown listener to each cube.
  ------------------------------------------------- */
  cubes.forEach(cube => {
    cube.addEventListener('mousedown', startDrag);
  });

  /* -------------------------------------------------
     startDrag – runs only when the user actually
     clicks on a cube.
  ------------------------------------------------- */
  function startDrag(event) {
    event.preventDefault();               // stop text‑selection etc.
    selectedCube = event.currentTarget;

    // Add the class that makes the cube absolute.
    selectedCube.classList.add('dragging');

    // After the class is added, the element is already
    // positioned absolutely, so we can read its rect.
    const cubeRect = selectedCube.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Offsets from the mouse pointer to the cube's top‑left.
    offsetX = event.clientX - cubeRect.left;
    offsetY = event.clientY - cubeRect.top;

    // Compute where the cube should sit *inside* the container.
    const left = cubeRect.left - containerRect.left - container.clientLeft;
    const top  = cubeRect.top  - containerRect.top  - container.clientTop;

    // Preserve original size (grid gives each cube a width/height).
    selectedCube.style.width  = `${selectedCube.offsetWidth}px`;
    selectedCube.style.height = `${selectedCube.offsetHeight}px`;
    selectedCube.style.left   = `${left}px`;
    selectedCube.style.top    = `${top}px`;

    // Listen for mouse movement / release.
    document.addEventListener('mousemove', dragCube);
    document.addEventListener('mouseup', stopDrag);
  }

  /* -------------------------------------------------
     dragCube – moves the selected cube while respecting
     the container boundaries.
  ------------------------------------------------- */
  function dragCube(event) {
    if (!selectedCube) return;

    const containerRect = container.getBoundingClientRect();
    const cubeRect = selectedCube.getBoundingClientRect();

    const containerLeft = containerRect.left + container.clientLeft;
    const containerTop  = containerRect.top  + container.clientTop;

    // Visual offsets help us clamp the movement.
    const visualLeft   = cubeRect.left   - (containerLeft + selectedCube.offsetLeft);
    const visualTop    = cubeRect.top    - (containerTop  + selectedCube.offsetTop);
    const visualRight  = cubeRect.right  - (containerLeft + selectedCube.offsetLeft);
    const visualBottom = cubeRect.bottom - (containerTop  + selectedCube.offsetTop);

    // Desired new coordinates based on mouse position.
    let x = event.clientX - containerLeft - offsetX;
    let y = event.clientY - containerTop  - offsetY;

    // Clamp so the cube never leaves the container.
    x = Math.max(-visualLeft, Math.min(x, container.clientWidth  - visualRight));
    y = Math.max(-visualTop, Math.min(y, container.clientHeight - visualBottom));

    selectedCube.style.left = `${x}px`;
    selectedCube.style.top  = `${y}px`;
  }

  /* -------------------------------------------------
     stopDrag – clean up when the mouse button is released.
  ------------------------------------------------- */
  function stopDrag() {
    if (selectedCube) {
      selectedCube.classList.remove('dragging');
      selectedCube = null;
    }
    document.removeEventListener('mousemove', dragCube);
    document.removeEventListener('mouseup', stopDrag);
  }

}); // end DOMContentLoaded