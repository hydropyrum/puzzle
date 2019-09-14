import * as THREE from 'three';

// This is just a stub to get things working.

export class TrackballControls extends THREE.EventDispatcher {
    rotateSpeed: number;
    noPan: boolean;
    noZoom: boolean;
    constructor(camera: THREE.Camera, domElement: Element);
    update() : void;
}
