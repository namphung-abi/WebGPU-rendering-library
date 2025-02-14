import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

class OrbitControl {
  camera;

  canvas;

  target = Vector3.ZERO;

  rotateAzimuthFactor = 2;

  rotatePolarFactor = 2;

  zoomFactor = 1.0;

  _radius = 0;

  _azimuthAngle = 0;

  _polarAngle = 0;

  _disableRotateCallback;

  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this._init();
  }

  _init() {
    const p0 = this.camera.lookAt;
    const p1 = this.camera.position;
    const p01 = p1.clone().sub(p0);
    this._radius = p01.length();
    this._azimuthAngle = Math.atan(p01.x / p01.z);
    this._polarAngle = Math.acos(p01.y / this._radius);
    let isActive = false;
    const startPos = Vector2.ZERO;
    const currentPos = Vector2.ZERO;
    const deltaPos = Vector2.ZERO;
    const onMouseDown = (ev) => {
      startPos.set(ev.x, ev.y);
      isActive = true;
    };
    const onMouseUp = () => {
      isActive = false;
    };
    const onMouseMove = (ev) => {
      if (isActive) {
        currentPos.set(ev.x, ev.y);
        deltaPos.set(currentPos.x - startPos.x, currentPos.y - startPos.y);
        startPos.copy(currentPos);
        deltaPos.div(new Vector2(this.canvas.clientWidth, this.canvas.clientHeight));
        this._azimuthAngle -= deltaPos.x * this.rotateAzimuthFactor * Math.PI;
        this._polarAngle -= deltaPos.y * this.rotatePolarFactor * Math.PI;
        this._polarAngle = Math.min(Math.max(this._polarAngle, 0.1), Math.PI - 0.1);
      }
    };
    const onMouseWheel = (ev) => {
      this._radius += ev.deltaY * this.zoomFactor * 0.01;
      this._radius = Math.max(this._radius, 0);
    };
    this.canvas.addEventListener("mousedown", onMouseDown);
    this.canvas.addEventListener("mouseup", onMouseUp);
    this.canvas.addEventListener("mousemove", onMouseMove);
    this.canvas.addEventListener("wheel", onMouseWheel);
    this._disableRotateCallback = () => {
      this.canvas.removeEventListener("mousedown", onMouseDown);
      this.canvas.removeEventListener("mouseup", onMouseUp);
      this.canvas.removeEventListener("mousemove", onMouseMove);
      this.canvas.removeEventListener("wheel", onMouseWheel);
    };
  }

  _disableRotate() {
    this._disableRotateCallback?.();
  }

  update() {
    const sinTheta = Math.sin(this._polarAngle);
    const cosTheta = Math.cos(this._polarAngle);
    const sinPhi = Math.sin(this._azimuthAngle);
    const cosPhi = Math.cos(this._azimuthAngle);
    this.camera.position.x = this._radius * sinTheta * sinPhi + this.target.x;
    this.camera.position.y = this._radius * cosTheta + this.target.y;
    this.camera.position.z = this._radius * sinTheta * cosPhi + this.target.z;
    this.camera.needsUpdateViewMatrix = true;
  }

  destory() {
    this._disableRotate();
  }
}

export { OrbitControl };
