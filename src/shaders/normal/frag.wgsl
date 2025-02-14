
@fragment
fn main(
  @location(0) position: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) color: vec3<f32>,
) -> @location(0) vec4<f32> {
  return vec4(normal * 0.5 + 0.5, 1.0);
}