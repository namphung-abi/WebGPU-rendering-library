import { Camera } from "./Camera.js";

class PerspectiveCamera extends Camera {
  fov;

  aspect;

  near;

  far;

  constructor(props) {
    super({
      position : props.position,
      lookAt   : props.lookAt,
      up       : props.up,
    });
    this.fov = props.fov ?? 45;
    this.aspect = props.aspect ?? 0.75;
    this.near = props.near ?? 0.1;
    this.far = props.far ?? 1000;
  }

  updateMatrix(device) {
    if (this.needsUpdateViewMatrix) {
      this.viewMatrix.lookAt(this.position, this.lookAt, this.up);
      this.uniform.set(device, Camera.UniformKeys.VIEW_MATRIX, this.viewMatrix.elements.buffer);
      const cameraPosBuffer = this.position.array.buffer;
      this.uniform.set(device, Camera.UniformKeys.CAMERA_POS, cameraPosBuffer);
    }
    if (this.needsUpdateProjectionMatrix) {
      this.projectionMatrix.perspective(this.fov * Math.PI / 180, this.aspect, this.near, this.far);
      this.uniform.set(device, Camera.UniformKeys.PROJECTION_MATRIX, this.projectionMatrix.elements.buffer);
    }
    if (this.needsUpdateViewMatrix || this.needsUpdateProjectionMatrix) {
      const VPInvMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix).invert();
      this.uniform.set(device, Camera.UniformKeys.VIEW_PROJECTION_INVERSE, VPInvMatrix.elements.buffer);
    }
    this.needsUpdateViewMatrix = false;
    this.needsUpdateProjectionMatrix = false;
  }
}

export { PerspectiveCamera };
