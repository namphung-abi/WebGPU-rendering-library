
import { Vector3 } from "../math/Vector3";
import { BufferGeometry } from "./BufferGeometry";

class SphereGeometry extends BufferGeometry {
  // eslint-disable-next-line constructor-super
  constructor(radius = 1, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
    const parameters = {
      radius         : radius,
      widthSegments  : widthSegments,
      heightSegments : heightSegments,
      phiStart       : phiStart,
      phiLength      : phiLength,
      thetaStart     : thetaStart,
      thetaLength    : thetaLength,
    };

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    let index = 0;
    const grid = [];

    const vertex = new Vector3();
    const normal = new Vector3();

    // buffers
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // generate vertices, normals and uvs
    for (let iy = 0; iy <= heightSegments; iy++) {

      const verticesRow = [];

      const v = iy / heightSegments;

      // special case for the poles

      let uOffset = 0;

      if (iy === 0 && thetaStart === 0) {

        uOffset = 0.5 / widthSegments;

      }
      else if (iy === heightSegments && thetaEnd === Math.PI) {

        uOffset = -0.5 / widthSegments;

      }

      for (let ix = 0; ix <= widthSegments; ix++) {

        const u = ix / widthSegments;

        // vertex

        vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal

        normal.copy(vertex).normalize();
        normals.push(normal.x, normal.y, normal.z);

        // uv

        uvs.push(u + uOffset, 1 - v);

        verticesRow.push(index++);

      }

      grid.push(verticesRow);

    }

    // indices
    for (let iy = 0; iy < heightSegments; iy++) {

      for (let ix = 0; ix < widthSegments; ix++) {

        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) {
          indices.push(a, b, d);
        }
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
          indices.push(b, c, d);
        }

      }

    }

    super({
      position : new Float32Array(vertices),
      normal   : new Float32Array(normals),
      uv       : new Float32Array(uvs),
      index    : new Uint16Array(indices),
    });

    this.parameters = parameters;
  }
}

export { SphereGeometry };
