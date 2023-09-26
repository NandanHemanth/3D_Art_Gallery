import * as THREE from 'three';
import { displayPaintingInfo, hidePaintingInfo } from './paintingInfo.js';
import { updateMovement } from './movement.js';

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls
) => {
  const clock = new THREE.Clock();
  let lastUpdateTime = 0;
  const updateInterval = 1000 / 30; // Throttle updates to approximately 30 times per second

  let render = function () {
    const delta = clock.getDelta();
    const currentTime = performance.now();

    // Throttle the updateMovement function
    if (currentTime - lastUpdateTime >= updateInterval) {
      updateMovement(delta, controls, camera, walls);
      lastUpdateTime = currentTime;
    }

    const distanceThreshold = 8;
    let paintingToShow;

    paintings.forEach((painting) => {
      const distanceToPainting = camera.position.distanceTo(painting.position);
      if (distanceToPainting < distanceThreshold) {
        paintingToShow = painting;
      }
    });

    if (paintingToShow) {
      displayPaintingInfo(paintingToShow.userData.info);
    } else {
      hidePaintingInfo();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
};