import * as THREE from 'three';
/* Tetrahedron */
export function tetrahedron(d: number) {
  // http://dmccooey.com/polyhedra/Tetrahedron.txt
  let C0 = 0.353553390593273762200422181052;
  // C0 = sqrt(2) / 4
  let V0 = new THREE.Vector3( C0, -C0,  C0);
  let V1 = new THREE.Vector3( C0,  C0, -C0);
  let V2 = new THREE.Vector3(-C0,  C0,  C0);
  let V3 = new THREE.Vector3(-C0, -C0, -C0);
  let cuts = [
    // { 0, 1, 2 }
    new THREE.Plane().setFromCoplanarPoints(V0, V1, V2),
    // { 1, 0, 3 }
    new THREE.Plane().setFromCoplanarPoints(V1, V0, V3),
    // { 2, 3, 0 }
    new THREE.Plane().setFromCoplanarPoints(V2, V3, V0),
    // { 3, 2, 1 }
    new THREE.Plane().setFromCoplanarPoints(V3, V2, V1),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Octahedron */
export function octahedron(d: number) {
  // http://dmccooey.com/polyhedra/Octahedron.txt
  let C0 = 0.7071067811865475244008443621048;
  // C0 = sqrt(2) / 2
  let V0 = new THREE.Vector3(0.0, 0.0,  C0);
  let V1 = new THREE.Vector3(0.0, 0.0, -C0);
  let V2 = new THREE.Vector3( C0, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C0, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C0, 0.0);
  let V5 = new THREE.Vector3(0.0, -C0, 0.0);
  let cuts = [
    // { 0, 2, 4 }
    new THREE.Plane().setFromCoplanarPoints(V0, V2, V4),
    // { 0, 4, 3 }
    new THREE.Plane().setFromCoplanarPoints(V0, V4, V3),
    // { 0, 3, 5 }
    new THREE.Plane().setFromCoplanarPoints(V0, V3, V5),
    // { 0, 5, 2 }
    new THREE.Plane().setFromCoplanarPoints(V0, V5, V2),
    // { 1, 2, 5 }
    new THREE.Plane().setFromCoplanarPoints(V1, V2, V5),
    // { 1, 5, 3 }
    new THREE.Plane().setFromCoplanarPoints(V1, V5, V3),
    // { 1, 3, 4 }
    new THREE.Plane().setFromCoplanarPoints(V1, V3, V4),
    // { 1, 4, 2 }
    new THREE.Plane().setFromCoplanarPoints(V1, V4, V2),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Cube */
export function cube(d: number) {
  // http://dmccooey.com/polyhedra/Cube.txt
  let V0 = new THREE.Vector3( 0.5,  0.5,  0.5);
  let V1 = new THREE.Vector3( 0.5,  0.5, -0.5);
  let V2 = new THREE.Vector3( 0.5, -0.5,  0.5);
  let V3 = new THREE.Vector3( 0.5, -0.5, -0.5);
  let V4 = new THREE.Vector3(-0.5,  0.5,  0.5);
  let V5 = new THREE.Vector3(-0.5,  0.5, -0.5);
  let V6 = new THREE.Vector3(-0.5, -0.5,  0.5);
  let V7 = new THREE.Vector3(-0.5, -0.5, -0.5);
  let cuts = [
    // { 0, 1, 5, 4 }
    new THREE.Plane().setFromCoplanarPoints(V0, V1, V5),
    // { 0, 4, 6, 2 }
    new THREE.Plane().setFromCoplanarPoints(V0, V4, V6),
    // { 0, 2, 3, 1 }
    new THREE.Plane().setFromCoplanarPoints(V0, V2, V3),
    // { 7, 3, 2, 6 }
    new THREE.Plane().setFromCoplanarPoints(V7, V3, V2),
    // { 7, 6, 4, 5 }
    new THREE.Plane().setFromCoplanarPoints(V7, V6, V4),
    // { 7, 5, 1, 3 }
    new THREE.Plane().setFromCoplanarPoints(V7, V5, V1),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Icosahedron */
export function icosahedron(d: number) {
  // http://dmccooey.com/polyhedra/Icosahedron.txt
  let C0 = 0.809016994374947424102293417183;
  // C0 = (1 + sqrt(5)) / 4
  let V0 = new THREE.Vector3( 0.5,  0.0,   C0);
  let V1 = new THREE.Vector3( 0.5,  0.0,  -C0);
  let V2 = new THREE.Vector3(-0.5,  0.0,   C0);
  let V3 = new THREE.Vector3(-0.5,  0.0,  -C0);
  let V4 = new THREE.Vector3(  C0,  0.5,  0.0);
  let V5 = new THREE.Vector3(  C0, -0.5,  0.0);
  let V6 = new THREE.Vector3( -C0,  0.5,  0.0);
  let V7 = new THREE.Vector3( -C0, -0.5,  0.0);
  let V8 = new THREE.Vector3( 0.0,   C0,  0.5);
  let V9 = new THREE.Vector3( 0.0,   C0, -0.5);
  let V10 = new THREE.Vector3( 0.0,  -C0,  0.5);
  let V11 = new THREE.Vector3( 0.0,  -C0, -0.5);
  let cuts = [
    // {  0,  2, 10 }
    new THREE.Plane().setFromCoplanarPoints(V0, V2, V10),
    // {  0, 10,  5 }
    new THREE.Plane().setFromCoplanarPoints(V0, V10, V5),
    // {  0,  5,  4 }
    new THREE.Plane().setFromCoplanarPoints(V0, V5, V4),
    // {  0,  4,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V4, V8),
    // {  0,  8,  2 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V2),
    // {  3,  1, 11 }
    new THREE.Plane().setFromCoplanarPoints(V3, V1, V11),
    // {  3, 11,  7 }
    new THREE.Plane().setFromCoplanarPoints(V3, V11, V7),
    // {  3,  7,  6 }
    new THREE.Plane().setFromCoplanarPoints(V3, V7, V6),
    // {  3,  6,  9 }
    new THREE.Plane().setFromCoplanarPoints(V3, V6, V9),
    // {  3,  9,  1 }
    new THREE.Plane().setFromCoplanarPoints(V3, V9, V1),
    // {  2,  6,  7 }
    new THREE.Plane().setFromCoplanarPoints(V2, V6, V7),
    // {  2,  7, 10 }
    new THREE.Plane().setFromCoplanarPoints(V2, V7, V10),
    // { 10,  7, 11 }
    new THREE.Plane().setFromCoplanarPoints(V10, V7, V11),
    // { 10, 11,  5 }
    new THREE.Plane().setFromCoplanarPoints(V10, V11, V5),
    // {  5, 11,  1 }
    new THREE.Plane().setFromCoplanarPoints(V5, V11, V1),
    // {  5,  1,  4 }
    new THREE.Plane().setFromCoplanarPoints(V5, V1, V4),
    // {  4,  1,  9 }
    new THREE.Plane().setFromCoplanarPoints(V4, V1, V9),
    // {  4,  9,  8 }
    new THREE.Plane().setFromCoplanarPoints(V4, V9, V8),
    // {  8,  9,  6 }
    new THREE.Plane().setFromCoplanarPoints(V8, V9, V6),
    // {  8,  6,  2 }
    new THREE.Plane().setFromCoplanarPoints(V8, V6, V2),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Dodecahedron */
export function dodecahedron(d: number) {
  // http://dmccooey.com/polyhedra/Dodecahedron.txt
  let C0 = 0.809016994374947424102293417183;
  // C0 = (1 + sqrt(5)) / 4
  let C1 = 1.30901699437494742410229341718;
  // C1 = (3 + sqrt(5)) / 4
  let V0 = new THREE.Vector3( 0.0,  0.5,   C1);
  let V1 = new THREE.Vector3( 0.0,  0.5,  -C1);
  let V2 = new THREE.Vector3( 0.0, -0.5,   C1);
  let V3 = new THREE.Vector3( 0.0, -0.5,  -C1);
  let V4 = new THREE.Vector3(  C1,  0.0,  0.5);
  let V5 = new THREE.Vector3(  C1,  0.0, -0.5);
  let V6 = new THREE.Vector3( -C1,  0.0,  0.5);
  let V7 = new THREE.Vector3( -C1,  0.0, -0.5);
  let V8 = new THREE.Vector3( 0.5,   C1,  0.0);
  let V9 = new THREE.Vector3( 0.5,  -C1,  0.0);
  let V10 = new THREE.Vector3(-0.5,   C1,  0.0);
  let V11 = new THREE.Vector3(-0.5,  -C1,  0.0);
  let V12 = new THREE.Vector3(  C0,   C0,   C0);
  let V13 = new THREE.Vector3(  C0,   C0,  -C0);
  let V14 = new THREE.Vector3(  C0,  -C0,   C0);
  let V15 = new THREE.Vector3(  C0,  -C0,  -C0);
  let V16 = new THREE.Vector3( -C0,   C0,   C0);
  let V17 = new THREE.Vector3( -C0,   C0,  -C0);
  let V18 = new THREE.Vector3( -C0,  -C0,   C0);
  let V19 = new THREE.Vector3( -C0,  -C0,  -C0);
  let cuts = [
    // {  0,  2, 14,  4, 12 }
    new THREE.Plane().setFromCoplanarPoints(V0, V2, V14),
    // {  0, 12,  8, 10, 16 }
    new THREE.Plane().setFromCoplanarPoints(V0, V12, V8),
    // {  0, 16,  6, 18,  2 }
    new THREE.Plane().setFromCoplanarPoints(V0, V16, V6),
    // {  7,  6, 16, 10, 17 }
    new THREE.Plane().setFromCoplanarPoints(V7, V6, V16),
    // {  7, 17,  1,  3, 19 }
    new THREE.Plane().setFromCoplanarPoints(V7, V17, V1),
    // {  7, 19, 11, 18,  6 }
    new THREE.Plane().setFromCoplanarPoints(V7, V19, V11),
    // {  9, 11, 19,  3, 15 }
    new THREE.Plane().setFromCoplanarPoints(V9, V11, V19),
    // {  9, 15,  5,  4, 14 }
    new THREE.Plane().setFromCoplanarPoints(V9, V15, V5),
    // {  9, 14,  2, 18, 11 }
    new THREE.Plane().setFromCoplanarPoints(V9, V14, V2),
    // { 13,  1, 17, 10,  8 }
    new THREE.Plane().setFromCoplanarPoints(V13, V1, V17),
    // { 13,  8, 12,  4,  5 }
    new THREE.Plane().setFromCoplanarPoints(V13, V8, V12),
    // { 13,  5, 15,  3,  1 }
    new THREE.Plane().setFromCoplanarPoints(V13, V5, V15),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Triakis Tetrahedron */
export function triakisTetrahedron(d: number) {
  // http://dmccooey.com/polyhedra/TriakisTetrahedron.txt
  let C0 = 0.636396103067892771960759925894;
  // C0 = 9 * sqrt(2) / 20
  let C1 = 1.06066017177982128660126654316;
  // C1 = 3 * sqrt(2) / 4
  let V0 = new THREE.Vector3( C1,  C1,  C1);
  let V1 = new THREE.Vector3( C1, -C1, -C1);
  let V2 = new THREE.Vector3(-C1, -C1,  C1);
  let V3 = new THREE.Vector3(-C1,  C1, -C1);
  let V4 = new THREE.Vector3( C0, -C0,  C0);
  let V5 = new THREE.Vector3( C0,  C0, -C0);
  let V6 = new THREE.Vector3(-C0,  C0,  C0);
  let V7 = new THREE.Vector3(-C0, -C0, -C0);
  let cuts = [
    // { 4, 0, 2 }
    new THREE.Plane().setFromCoplanarPoints(V4, V0, V2),
    // { 4, 2, 1 }
    new THREE.Plane().setFromCoplanarPoints(V4, V2, V1),
    // { 4, 1, 0 }
    new THREE.Plane().setFromCoplanarPoints(V4, V1, V0),
    // { 5, 0, 1 }
    new THREE.Plane().setFromCoplanarPoints(V5, V0, V1),
    // { 5, 1, 3 }
    new THREE.Plane().setFromCoplanarPoints(V5, V1, V3),
    // { 5, 3, 0 }
    new THREE.Plane().setFromCoplanarPoints(V5, V3, V0),
    // { 6, 0, 3 }
    new THREE.Plane().setFromCoplanarPoints(V6, V0, V3),
    // { 6, 3, 2 }
    new THREE.Plane().setFromCoplanarPoints(V6, V3, V2),
    // { 6, 2, 0 }
    new THREE.Plane().setFromCoplanarPoints(V6, V2, V0),
    // { 7, 1, 2 }
    new THREE.Plane().setFromCoplanarPoints(V7, V1, V2),
    // { 7, 2, 3 }
    new THREE.Plane().setFromCoplanarPoints(V7, V2, V3),
    // { 7, 3, 1 }
    new THREE.Plane().setFromCoplanarPoints(V7, V3, V1),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Rhombic Dodecahedron */
export function rhombicDodecahedron(d: number) {
  // http://dmccooey.com/polyhedra/RhombicDodecahedron.txt
  let C0 = 0.530330085889910643300633271579;
  // C0 = 3 * sqrt(2) / 8
  let C1 = 1.06066017177982128660126654316;
  // C1 = 3 * sqrt(2) / 4
  let V0 = new THREE.Vector3(0.0, 0.0,  C1);
  let V1 = new THREE.Vector3(0.0, 0.0, -C1);
  let V2 = new THREE.Vector3( C1, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C1, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C1, 0.0);
  let V5 = new THREE.Vector3(0.0, -C1, 0.0);
  let V6 = new THREE.Vector3( C0,  C0,  C0);
  let V7 = new THREE.Vector3( C0,  C0, -C0);
  let V8 = new THREE.Vector3( C0, -C0,  C0);
  let V9 = new THREE.Vector3( C0, -C0, -C0);
  let V10 = new THREE.Vector3(-C0,  C0,  C0);
  let V11 = new THREE.Vector3(-C0,  C0, -C0);
  let V12 = new THREE.Vector3(-C0, -C0,  C0);
  let V13 = new THREE.Vector3(-C0, -C0, -C0);
  let cuts = [
    // {  6,  0,  8,  2 }
    new THREE.Plane().setFromCoplanarPoints(V6, V0, V8),
    // {  6,  2,  7,  4 }
    new THREE.Plane().setFromCoplanarPoints(V6, V2, V7),
    // {  6,  4, 10,  0 }
    new THREE.Plane().setFromCoplanarPoints(V6, V4, V10),
    // {  9,  1,  7,  2 }
    new THREE.Plane().setFromCoplanarPoints(V9, V1, V7),
    // {  9,  2,  8,  5 }
    new THREE.Plane().setFromCoplanarPoints(V9, V2, V8),
    // {  9,  5, 13,  1 }
    new THREE.Plane().setFromCoplanarPoints(V9, V5, V13),
    // { 11,  1, 13,  3 }
    new THREE.Plane().setFromCoplanarPoints(V11, V1, V13),
    // { 11,  3, 10,  4 }
    new THREE.Plane().setFromCoplanarPoints(V11, V3, V10),
    // { 11,  4,  7,  1 }
    new THREE.Plane().setFromCoplanarPoints(V11, V4, V7),
    // { 12,  0, 10,  3 }
    new THREE.Plane().setFromCoplanarPoints(V12, V0, V10),
    // { 12,  3, 13,  5 }
    new THREE.Plane().setFromCoplanarPoints(V12, V3, V13),
    // { 12,  5,  8,  0 }
    new THREE.Plane().setFromCoplanarPoints(V12, V5, V8),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Tetrakis Hexahedron */
export function tetrakisHexahedron(d: number) {
  // http://dmccooey.com/polyhedra/TetrakisHexahedron.txt
  let C0 = 1.06066017177982128660126654316;
  // C0 = 3 * sqrt(2) / 4
  let C1 = 1.59099025766973192990189981474;
  // C1 = 9 * sqrt(2) / 8
  let V0 = new THREE.Vector3(0.0, 0.0,  C1);
  let V1 = new THREE.Vector3(0.0, 0.0, -C1);
  let V2 = new THREE.Vector3( C1, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C1, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C1, 0.0);
  let V5 = new THREE.Vector3(0.0, -C1, 0.0);
  let V6 = new THREE.Vector3( C0,  C0,  C0);
  let V7 = new THREE.Vector3( C0,  C0, -C0);
  let V8 = new THREE.Vector3( C0, -C0,  C0);
  let V9 = new THREE.Vector3( C0, -C0, -C0);
  let V10 = new THREE.Vector3(-C0,  C0,  C0);
  let V11 = new THREE.Vector3(-C0,  C0, -C0);
  let V12 = new THREE.Vector3(-C0, -C0,  C0);
  let V13 = new THREE.Vector3(-C0, -C0, -C0);
  let cuts = [
    // {  0,  6, 10 }
    new THREE.Plane().setFromCoplanarPoints(V0, V6, V10),
    // {  0, 10, 12 }
    new THREE.Plane().setFromCoplanarPoints(V0, V10, V12),
    // {  0, 12,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V12, V8),
    // {  0,  8,  6 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V6),
    // {  1,  7,  9 }
    new THREE.Plane().setFromCoplanarPoints(V1, V7, V9),
    // {  1,  9, 13 }
    new THREE.Plane().setFromCoplanarPoints(V1, V9, V13),
    // {  1, 13, 11 }
    new THREE.Plane().setFromCoplanarPoints(V1, V13, V11),
    // {  1, 11,  7 }
    new THREE.Plane().setFromCoplanarPoints(V1, V11, V7),
    // {  2,  6,  8 }
    new THREE.Plane().setFromCoplanarPoints(V2, V6, V8),
    // {  2,  8,  9 }
    new THREE.Plane().setFromCoplanarPoints(V2, V8, V9),
    // {  2,  9,  7 }
    new THREE.Plane().setFromCoplanarPoints(V2, V9, V7),
    // {  2,  7,  6 }
    new THREE.Plane().setFromCoplanarPoints(V2, V7, V6),
    // {  3, 10, 11 }
    new THREE.Plane().setFromCoplanarPoints(V3, V10, V11),
    // {  3, 11, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V11, V13),
    // {  3, 13, 12 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V12),
    // {  3, 12, 10 }
    new THREE.Plane().setFromCoplanarPoints(V3, V12, V10),
    // {  4,  6,  7 }
    new THREE.Plane().setFromCoplanarPoints(V4, V6, V7),
    // {  4,  7, 11 }
    new THREE.Plane().setFromCoplanarPoints(V4, V7, V11),
    // {  4, 11, 10 }
    new THREE.Plane().setFromCoplanarPoints(V4, V11, V10),
    // {  4, 10,  6 }
    new THREE.Plane().setFromCoplanarPoints(V4, V10, V6),
    // {  5,  8, 12 }
    new THREE.Plane().setFromCoplanarPoints(V5, V8, V12),
    // {  5, 12, 13 }
    new THREE.Plane().setFromCoplanarPoints(V5, V12, V13),
    // {  5, 13,  9 }
    new THREE.Plane().setFromCoplanarPoints(V5, V13, V9),
    // {  5,  9,  8 }
    new THREE.Plane().setFromCoplanarPoints(V5, V9, V8),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Triakis Octahedron */
export function triakisOctahedron(d: number) {
  // http://dmccooey.com/polyhedra/TriakisOctahedron.txt
  let C0 = 2.41421356237309504880168872421;
  // C0 = 1 + sqrt(2)
  let V0 = new THREE.Vector3( 0.0,  0.0,   C0);
  let V1 = new THREE.Vector3( 0.0,  0.0,  -C0);
  let V2 = new THREE.Vector3(  C0,  0.0,  0.0);
  let V3 = new THREE.Vector3( -C0,  0.0,  0.0);
  let V4 = new THREE.Vector3( 0.0,   C0,  0.0);
  let V5 = new THREE.Vector3( 0.0,  -C0,  0.0);
  let V6 = new THREE.Vector3( 1.0,  1.0,  1.0);
  let V7 = new THREE.Vector3( 1.0,  1.0, -1.0);
  let V8 = new THREE.Vector3( 1.0, -1.0,  1.0);
  let V9 = new THREE.Vector3( 1.0, -1.0, -1.0);
  let V10 = new THREE.Vector3(-1.0,  1.0,  1.0);
  let V11 = new THREE.Vector3(-1.0,  1.0, -1.0);
  let V12 = new THREE.Vector3(-1.0, -1.0,  1.0);
  let V13 = new THREE.Vector3(-1.0, -1.0, -1.0);
  let cuts = [
    // {  6,  0,  2 }
    new THREE.Plane().setFromCoplanarPoints(V6, V0, V2),
    // {  6,  2,  4 }
    new THREE.Plane().setFromCoplanarPoints(V6, V2, V4),
    // {  6,  4,  0 }
    new THREE.Plane().setFromCoplanarPoints(V6, V4, V0),
    // {  7,  1,  4 }
    new THREE.Plane().setFromCoplanarPoints(V7, V1, V4),
    // {  7,  4,  2 }
    new THREE.Plane().setFromCoplanarPoints(V7, V4, V2),
    // {  7,  2,  1 }
    new THREE.Plane().setFromCoplanarPoints(V7, V2, V1),
    // {  8,  0,  5 }
    new THREE.Plane().setFromCoplanarPoints(V8, V0, V5),
    // {  8,  5,  2 }
    new THREE.Plane().setFromCoplanarPoints(V8, V5, V2),
    // {  8,  2,  0 }
    new THREE.Plane().setFromCoplanarPoints(V8, V2, V0),
    // {  9,  1,  2 }
    new THREE.Plane().setFromCoplanarPoints(V9, V1, V2),
    // {  9,  2,  5 }
    new THREE.Plane().setFromCoplanarPoints(V9, V2, V5),
    // {  9,  5,  1 }
    new THREE.Plane().setFromCoplanarPoints(V9, V5, V1),
    // { 10,  0,  4 }
    new THREE.Plane().setFromCoplanarPoints(V10, V0, V4),
    // { 10,  4,  3 }
    new THREE.Plane().setFromCoplanarPoints(V10, V4, V3),
    // { 10,  3,  0 }
    new THREE.Plane().setFromCoplanarPoints(V10, V3, V0),
    // { 11,  1,  3 }
    new THREE.Plane().setFromCoplanarPoints(V11, V1, V3),
    // { 11,  3,  4 }
    new THREE.Plane().setFromCoplanarPoints(V11, V3, V4),
    // { 11,  4,  1 }
    new THREE.Plane().setFromCoplanarPoints(V11, V4, V1),
    // { 12,  0,  3 }
    new THREE.Plane().setFromCoplanarPoints(V12, V0, V3),
    // { 12,  3,  5 }
    new THREE.Plane().setFromCoplanarPoints(V12, V3, V5),
    // { 12,  5,  0 }
    new THREE.Plane().setFromCoplanarPoints(V12, V5, V0),
    // { 13,  1,  5 }
    new THREE.Plane().setFromCoplanarPoints(V13, V1, V5),
    // { 13,  5,  3 }
    new THREE.Plane().setFromCoplanarPoints(V13, V5, V3),
    // { 13,  3,  1 }
    new THREE.Plane().setFromCoplanarPoints(V13, V3, V1),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Deltoidal Icositetrahedron */
export function deltoidalIcositetrahedron(d: number) {
  // http://dmccooey.com/polyhedra/DeltoidalIcositetrahedron.txt
  let C0 = 0.773459080339013578400241246316;
  // C0 = (4 + sqrt(2)) / 7
  let C1 = 1.41421356237309504880168872421;
  // C1 = sqrt(2)
  let V0 = new THREE.Vector3( 0.0,  0.0,   C1);
  let V1 = new THREE.Vector3( 0.0,  0.0,  -C1);
  let V2 = new THREE.Vector3(  C1,  0.0,  0.0);
  let V3 = new THREE.Vector3( -C1,  0.0,  0.0);
  let V4 = new THREE.Vector3( 0.0,   C1,  0.0);
  let V5 = new THREE.Vector3( 0.0,  -C1,  0.0);
  let V6 = new THREE.Vector3( 1.0,  0.0,  1.0);
  let V7 = new THREE.Vector3( 1.0,  0.0, -1.0);
  let V8 = new THREE.Vector3(-1.0,  0.0,  1.0);
  let V9 = new THREE.Vector3(-1.0,  0.0, -1.0);
  let V10 = new THREE.Vector3( 1.0,  1.0,  0.0);
  let V11 = new THREE.Vector3( 1.0, -1.0,  0.0);
  let V12 = new THREE.Vector3(-1.0,  1.0,  0.0);
  let V13 = new THREE.Vector3(-1.0, -1.0,  0.0);
  let V14 = new THREE.Vector3( 0.0,  1.0,  1.0);
  let V15 = new THREE.Vector3( 0.0,  1.0, -1.0);
  let V16 = new THREE.Vector3( 0.0, -1.0,  1.0);
  let V17 = new THREE.Vector3( 0.0, -1.0, -1.0);
  let V18 = new THREE.Vector3(  C0,   C0,   C0);
  let V19 = new THREE.Vector3(  C0,   C0,  -C0);
  let V20 = new THREE.Vector3(  C0,  -C0,   C0);
  let V21 = new THREE.Vector3(  C0,  -C0,  -C0);
  let V22 = new THREE.Vector3( -C0,   C0,   C0);
  let V23 = new THREE.Vector3( -C0,   C0,  -C0);
  let V24 = new THREE.Vector3( -C0,  -C0,   C0);
  let V25 = new THREE.Vector3( -C0,  -C0,  -C0);
  let cuts = [
    // {  0,  6, 18, 14 }
    new THREE.Plane().setFromCoplanarPoints(V0, V6, V18),
    // {  0, 14, 22,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V14, V22),
    // {  0,  8, 24, 16 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V24),
    // {  0, 16, 20,  6 }
    new THREE.Plane().setFromCoplanarPoints(V0, V16, V20),
    // {  1,  9, 23, 15 }
    new THREE.Plane().setFromCoplanarPoints(V1, V9, V23),
    // {  1, 15, 19,  7 }
    new THREE.Plane().setFromCoplanarPoints(V1, V15, V19),
    // {  1,  7, 21, 17 }
    new THREE.Plane().setFromCoplanarPoints(V1, V7, V21),
    // {  1, 17, 25,  9 }
    new THREE.Plane().setFromCoplanarPoints(V1, V17, V25),
    // {  2,  7, 19, 10 }
    new THREE.Plane().setFromCoplanarPoints(V2, V7, V19),
    // {  2, 10, 18,  6 }
    new THREE.Plane().setFromCoplanarPoints(V2, V10, V18),
    // {  2,  6, 20, 11 }
    new THREE.Plane().setFromCoplanarPoints(V2, V6, V20),
    // {  2, 11, 21,  7 }
    new THREE.Plane().setFromCoplanarPoints(V2, V11, V21),
    // {  3,  8, 22, 12 }
    new THREE.Plane().setFromCoplanarPoints(V3, V8, V22),
    // {  3, 12, 23,  9 }
    new THREE.Plane().setFromCoplanarPoints(V3, V12, V23),
    // {  3,  9, 25, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V9, V25),
    // {  3, 13, 24,  8 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V24),
    // {  4, 10, 19, 15 }
    new THREE.Plane().setFromCoplanarPoints(V4, V10, V19),
    // {  4, 15, 23, 12 }
    new THREE.Plane().setFromCoplanarPoints(V4, V15, V23),
    // {  4, 12, 22, 14 }
    new THREE.Plane().setFromCoplanarPoints(V4, V12, V22),
    // {  4, 14, 18, 10 }
    new THREE.Plane().setFromCoplanarPoints(V4, V14, V18),
    // {  5, 11, 20, 16 }
    new THREE.Plane().setFromCoplanarPoints(V5, V11, V20),
    // {  5, 16, 24, 13 }
    new THREE.Plane().setFromCoplanarPoints(V5, V16, V24),
    // {  5, 13, 25, 17 }
    new THREE.Plane().setFromCoplanarPoints(V5, V13, V25),
    // {  5, 17, 21, 11 }
    new THREE.Plane().setFromCoplanarPoints(V5, V17, V21),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Pentagonal Icositetrahedron (dextro) */
export function rpentagonalIcositetrahedron(d: number) {
  // http://dmccooey.com/polyhedra/RpentagonalIcositetrahedron.txt
  let C0 = 0.218796643000480441021525033712;
  let C1 = 0.740183741369857222808508165943;
  let C2 = 1.02365617811269018236347687527;
  let C3 = 1.36141015192644253450100912043;
  // C0 = sqrt(6 * (cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))) - 6)) / 12
  // C1 = sqrt(6 * (6 + cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))))) / 12
  // C2 = sqrt(6 * (18 + cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))))) / 12
  // C3 = sqrt(6 * (14+cbrt(2*(1777+33*sqrt(33)))+cbrt(2*(1777-33*sqrt(33))))) / 12
  let V0 = new THREE.Vector3(0.0, 0.0,  C3);
  let V1 = new THREE.Vector3(0.0, 0.0, -C3);
  let V2 = new THREE.Vector3( C3, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C3, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C3, 0.0);
  let V5 = new THREE.Vector3(0.0, -C3, 0.0);
  let V6 = new THREE.Vector3( C1, -C0,  C2);
  let V7 = new THREE.Vector3( C1,  C0, -C2);
  let V8 = new THREE.Vector3(-C1,  C0,  C2);
  let V9 = new THREE.Vector3(-C1, -C0, -C2);
  let V10 = new THREE.Vector3( C2, -C1,  C0);
  let V11 = new THREE.Vector3( C2,  C1, -C0);
  let V12 = new THREE.Vector3(-C2,  C1,  C0);
  let V13 = new THREE.Vector3(-C2, -C1, -C0);
  let V14 = new THREE.Vector3( C0, -C2,  C1);
  let V15 = new THREE.Vector3( C0,  C2, -C1);
  let V16 = new THREE.Vector3(-C0,  C2,  C1);
  let V17 = new THREE.Vector3(-C0, -C2, -C1);
  let V18 = new THREE.Vector3( C0,  C1,  C2);
  let V19 = new THREE.Vector3( C0, -C1, -C2);
  let V20 = new THREE.Vector3(-C0, -C1,  C2);
  let V21 = new THREE.Vector3(-C0,  C1, -C2);
  let V22 = new THREE.Vector3( C2,  C0,  C1);
  let V23 = new THREE.Vector3( C2, -C0, -C1);
  let V24 = new THREE.Vector3(-C2, -C0,  C1);
  let V25 = new THREE.Vector3(-C2,  C0, -C1);
  let V26 = new THREE.Vector3( C1,  C2,  C0);
  let V27 = new THREE.Vector3( C1, -C2, -C0);
  let V28 = new THREE.Vector3(-C1, -C2,  C0);
  let V29 = new THREE.Vector3(-C1,  C2, -C0);
  let V30 = new THREE.Vector3( C1,  C1,  C1);
  let V31 = new THREE.Vector3( C1,  C1, -C1);
  let V32 = new THREE.Vector3( C1, -C1,  C1);
  let V33 = new THREE.Vector3( C1, -C1, -C1);
  let V34 = new THREE.Vector3(-C1,  C1,  C1);
  let V35 = new THREE.Vector3(-C1,  C1, -C1);
  let V36 = new THREE.Vector3(-C1, -C1,  C1);
  let V37 = new THREE.Vector3(-C1, -C1, -C1);
  let cuts = [
    // {  0,  6, 22, 30, 18 }
    new THREE.Plane().setFromCoplanarPoints(V0, V6, V22),
    // {  0, 18, 16, 34,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V18, V16),
    // {  0,  8, 24, 36, 20 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V24),
    // {  0, 20, 14, 32,  6 }
    new THREE.Plane().setFromCoplanarPoints(V0, V20, V14),
    // {  1,  7, 23, 33, 19 }
    new THREE.Plane().setFromCoplanarPoints(V1, V7, V23),
    // {  1, 19, 17, 37,  9 }
    new THREE.Plane().setFromCoplanarPoints(V1, V19, V17),
    // {  1,  9, 25, 35, 21 }
    new THREE.Plane().setFromCoplanarPoints(V1, V9, V25),
    // {  1, 21, 15, 31,  7 }
    new THREE.Plane().setFromCoplanarPoints(V1, V21, V15),
    // {  2, 10, 27, 33, 23 }
    new THREE.Plane().setFromCoplanarPoints(V2, V10, V27),
    // {  2, 23,  7, 31, 11 }
    new THREE.Plane().setFromCoplanarPoints(V2, V23, V7),
    // {  2, 11, 26, 30, 22 }
    new THREE.Plane().setFromCoplanarPoints(V2, V11, V26),
    // {  2, 22,  6, 32, 10 }
    new THREE.Plane().setFromCoplanarPoints(V2, V22, V6),
    // {  3, 12, 29, 35, 25 }
    new THREE.Plane().setFromCoplanarPoints(V3, V12, V29),
    // {  3, 25,  9, 37, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V25, V9),
    // {  3, 13, 28, 36, 24 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V28),
    // {  3, 24,  8, 34, 12 }
    new THREE.Plane().setFromCoplanarPoints(V3, V24, V8),
    // {  4, 15, 21, 35, 29 }
    new THREE.Plane().setFromCoplanarPoints(V4, V15, V21),
    // {  4, 29, 12, 34, 16 }
    new THREE.Plane().setFromCoplanarPoints(V4, V29, V12),
    // {  4, 16, 18, 30, 26 }
    new THREE.Plane().setFromCoplanarPoints(V4, V16, V18),
    // {  4, 26, 11, 31, 15 }
    new THREE.Plane().setFromCoplanarPoints(V4, V26, V11),
    // {  5, 14, 20, 36, 28 }
    new THREE.Plane().setFromCoplanarPoints(V5, V14, V20),
    // {  5, 28, 13, 37, 17 }
    new THREE.Plane().setFromCoplanarPoints(V5, V28, V13),
    // {  5, 17, 19, 33, 27 }
    new THREE.Plane().setFromCoplanarPoints(V5, V17, V19),
    // {  5, 27, 10, 32, 14 }
    new THREE.Plane().setFromCoplanarPoints(V5, V27, V10),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Pentagonal Icositetrahedron (laevo) */
export function lpentagonalIcositetrahedron(d: number) {
  // http://dmccooey.com/polyhedra/LpentagonalIcositetrahedron.txt
  let C0 = 0.218796643000480441021525033712;
  let C1 = 0.740183741369857222808508165943;
  let C2 = 1.02365617811269018236347687527;
  let C3 = 1.36141015192644253450100912043;
  // C0 = sqrt(6 * (cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))) - 6)) / 12
  // C1 = sqrt(6 * (6 + cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))))) / 12
  // C2 = sqrt(6 * (18 + cbrt(6*(9 + sqrt(33))) + cbrt(6*(9 - sqrt(33))))) / 12
  // C3 = sqrt(6 * (14+cbrt(2*(1777+33*sqrt(33)))+cbrt(2*(1777-33*sqrt(33))))) / 12
  let V0 = new THREE.Vector3(0.0, 0.0, -C3);
  let V1 = new THREE.Vector3(0.0, 0.0,  C3);
  let V2 = new THREE.Vector3(-C3, 0.0, 0.0);
  let V3 = new THREE.Vector3( C3, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0, -C3, 0.0);
  let V5 = new THREE.Vector3(0.0,  C3, 0.0);
  let V6 = new THREE.Vector3(-C1,  C0, -C2);
  let V7 = new THREE.Vector3(-C1, -C0,  C2);
  let V8 = new THREE.Vector3( C1, -C0, -C2);
  let V9 = new THREE.Vector3( C1,  C0,  C2);
  let V10 = new THREE.Vector3(-C2,  C1, -C0);
  let V11 = new THREE.Vector3(-C2, -C1,  C0);
  let V12 = new THREE.Vector3( C2, -C1, -C0);
  let V13 = new THREE.Vector3( C2,  C1,  C0);
  let V14 = new THREE.Vector3(-C0,  C2, -C1);
  let V15 = new THREE.Vector3(-C0, -C2,  C1);
  let V16 = new THREE.Vector3( C0, -C2, -C1);
  let V17 = new THREE.Vector3( C0,  C2,  C1);
  let V18 = new THREE.Vector3(-C0, -C1, -C2);
  let V19 = new THREE.Vector3(-C0,  C1,  C2);
  let V20 = new THREE.Vector3( C0,  C1, -C2);
  let V21 = new THREE.Vector3( C0, -C1,  C2);
  let V22 = new THREE.Vector3(-C2, -C0, -C1);
  let V23 = new THREE.Vector3(-C2,  C0,  C1);
  let V24 = new THREE.Vector3( C2,  C0, -C1);
  let V25 = new THREE.Vector3( C2, -C0,  C1);
  let V26 = new THREE.Vector3(-C1, -C2, -C0);
  let V27 = new THREE.Vector3(-C1,  C2,  C0);
  let V28 = new THREE.Vector3( C1,  C2, -C0);
  let V29 = new THREE.Vector3( C1, -C2,  C0);
  let V30 = new THREE.Vector3(-C1, -C1, -C1);
  let V31 = new THREE.Vector3(-C1, -C1,  C1);
  let V32 = new THREE.Vector3(-C1,  C1, -C1);
  let V33 = new THREE.Vector3(-C1,  C1,  C1);
  let V34 = new THREE.Vector3( C1, -C1, -C1);
  let V35 = new THREE.Vector3( C1, -C1,  C1);
  let V36 = new THREE.Vector3( C1,  C1, -C1);
  let V37 = new THREE.Vector3( C1,  C1,  C1);
  let cuts = [
    // {  0, 18, 30, 22,  6 }
    new THREE.Plane().setFromCoplanarPoints(V0, V18, V30),
    // {  0,  8, 34, 16, 18 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V34),
    // {  0, 20, 36, 24,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V20, V36),
    // {  0,  6, 32, 14, 20 }
    new THREE.Plane().setFromCoplanarPoints(V0, V6, V32),
    // {  1, 19, 33, 23,  7 }
    new THREE.Plane().setFromCoplanarPoints(V1, V19, V33),
    // {  1,  9, 37, 17, 19 }
    new THREE.Plane().setFromCoplanarPoints(V1, V9, V37),
    // {  1, 21, 35, 25,  9 }
    new THREE.Plane().setFromCoplanarPoints(V1, V21, V35),
    // {  1,  7, 31, 15, 21 }
    new THREE.Plane().setFromCoplanarPoints(V1, V7, V31),
    // {  2, 23, 33, 27, 10 }
    new THREE.Plane().setFromCoplanarPoints(V2, V23, V33),
    // {  2, 11, 31,  7, 23 }
    new THREE.Plane().setFromCoplanarPoints(V2, V11, V31),
    // {  2, 22, 30, 26, 11 }
    new THREE.Plane().setFromCoplanarPoints(V2, V22, V30),
    // {  2, 10, 32,  6, 22 }
    new THREE.Plane().setFromCoplanarPoints(V2, V10, V32),
    // {  3, 25, 35, 29, 12 }
    new THREE.Plane().setFromCoplanarPoints(V3, V25, V35),
    // {  3, 13, 37,  9, 25 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V37),
    // {  3, 24, 36, 28, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V24, V36),
    // {  3, 12, 34,  8, 24 }
    new THREE.Plane().setFromCoplanarPoints(V3, V12, V34),
    // {  4, 29, 35, 21, 15 }
    new THREE.Plane().setFromCoplanarPoints(V4, V29, V35),
    // {  4, 16, 34, 12, 29 }
    new THREE.Plane().setFromCoplanarPoints(V4, V16, V34),
    // {  4, 26, 30, 18, 16 }
    new THREE.Plane().setFromCoplanarPoints(V4, V26, V30),
    // {  4, 15, 31, 11, 26 }
    new THREE.Plane().setFromCoplanarPoints(V4, V15, V31),
    // {  5, 28, 36, 20, 14 }
    new THREE.Plane().setFromCoplanarPoints(V5, V28, V36),
    // {  5, 17, 37, 13, 28 }
    new THREE.Plane().setFromCoplanarPoints(V5, V17, V37),
    // {  5, 27, 33, 19, 17 }
    new THREE.Plane().setFromCoplanarPoints(V5, V27, V33),
    // {  5, 14, 32, 10, 27 }
    new THREE.Plane().setFromCoplanarPoints(V5, V14, V32),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Rhombic Triacontahedron */
export function rhombicTriacontahedron(d: number) {
  // http://dmccooey.com/polyhedra/RhombicTriacontahedron.txt
  let C0 = 0.559016994374947424102293417183;
  // C0 = sqrt(5) / 4
  let C1 = 0.904508497187473712051146708591;
  // C1 = (5 + sqrt(5)) / 8
  let C2 = 1.46352549156242113615344012577;
  // C2 = (5 + 3 * sqrt(5)) / 8
  let V0 = new THREE.Vector3( C1, 0.0,  C2);
  let V1 = new THREE.Vector3( C1, 0.0, -C2);
  let V2 = new THREE.Vector3(-C1, 0.0,  C2);
  let V3 = new THREE.Vector3(-C1, 0.0, -C2);
  let V4 = new THREE.Vector3( C2,  C1, 0.0);
  let V5 = new THREE.Vector3( C2, -C1, 0.0);
  let V6 = new THREE.Vector3(-C2,  C1, 0.0);
  let V7 = new THREE.Vector3(-C2, -C1, 0.0);
  let V8 = new THREE.Vector3(0.0,  C2,  C1);
  let V9 = new THREE.Vector3(0.0,  C2, -C1);
  let V10 = new THREE.Vector3(0.0, -C2,  C1);
  let V11 = new THREE.Vector3(0.0, -C2, -C1);
  let V12 = new THREE.Vector3(0.0,  C0,  C2);
  let V13 = new THREE.Vector3(0.0,  C0, -C2);
  let V14 = new THREE.Vector3(0.0, -C0,  C2);
  let V15 = new THREE.Vector3(0.0, -C0, -C2);
  let V16 = new THREE.Vector3( C2, 0.0,  C0);
  let V17 = new THREE.Vector3( C2, 0.0, -C0);
  let V18 = new THREE.Vector3(-C2, 0.0,  C0);
  let V19 = new THREE.Vector3(-C2, 0.0, -C0);
  let V20 = new THREE.Vector3( C0,  C2, 0.0);
  let V21 = new THREE.Vector3( C0, -C2, 0.0);
  let V22 = new THREE.Vector3(-C0,  C2, 0.0);
  let V23 = new THREE.Vector3(-C0, -C2, 0.0);
  let V24 = new THREE.Vector3( C1,  C1,  C1);
  let V25 = new THREE.Vector3( C1,  C1, -C1);
  let V26 = new THREE.Vector3( C1, -C1,  C1);
  let V27 = new THREE.Vector3( C1, -C1, -C1);
  let V28 = new THREE.Vector3(-C1,  C1,  C1);
  let V29 = new THREE.Vector3(-C1,  C1, -C1);
  let V30 = new THREE.Vector3(-C1, -C1,  C1);
  let V31 = new THREE.Vector3(-C1, -C1, -C1);
  let cuts = [
    // {  0, 12,  2, 14 }
    new THREE.Plane().setFromCoplanarPoints(V0, V12, V2),
    // {  0, 14, 10, 26 }
    new THREE.Plane().setFromCoplanarPoints(V0, V14, V10),
    // {  0, 26,  5, 16 }
    new THREE.Plane().setFromCoplanarPoints(V0, V26, V5),
    // {  1, 13,  9, 25 }
    new THREE.Plane().setFromCoplanarPoints(V1, V13, V9),
    // {  1, 25,  4, 17 }
    new THREE.Plane().setFromCoplanarPoints(V1, V25, V4),
    // {  1, 17,  5, 27 }
    new THREE.Plane().setFromCoplanarPoints(V1, V17, V5),
    // {  2, 28,  6, 18 }
    new THREE.Plane().setFromCoplanarPoints(V2, V28, V6),
    // {  2, 18,  7, 30 }
    new THREE.Plane().setFromCoplanarPoints(V2, V18, V7),
    // {  2, 30, 10, 14 }
    new THREE.Plane().setFromCoplanarPoints(V2, V30, V10),
    // {  3, 19,  6, 29 }
    new THREE.Plane().setFromCoplanarPoints(V3, V19, V6),
    // {  3, 29,  9, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V29, V9),
    // {  3, 13,  1, 15 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V1),
    // {  4, 20,  8, 24 }
    new THREE.Plane().setFromCoplanarPoints(V4, V20, V8),
    // {  4, 24,  0, 16 }
    new THREE.Plane().setFromCoplanarPoints(V4, V24, V0),
    // {  4, 16,  5, 17 }
    new THREE.Plane().setFromCoplanarPoints(V4, V16, V5),
    // {  7, 18,  6, 19 }
    new THREE.Plane().setFromCoplanarPoints(V7, V18, V6),
    // {  7, 19,  3, 31 }
    new THREE.Plane().setFromCoplanarPoints(V7, V19, V3),
    // {  7, 31, 11, 23 }
    new THREE.Plane().setFromCoplanarPoints(V7, V31, V11),
    // {  8, 22,  6, 28 }
    new THREE.Plane().setFromCoplanarPoints(V8, V22, V6),
    // {  8, 28,  2, 12 }
    new THREE.Plane().setFromCoplanarPoints(V8, V28, V2),
    // {  8, 12,  0, 24 }
    new THREE.Plane().setFromCoplanarPoints(V8, V12, V0),
    // {  9, 29,  6, 22 }
    new THREE.Plane().setFromCoplanarPoints(V9, V29, V6),
    // {  9, 22,  8, 20 }
    new THREE.Plane().setFromCoplanarPoints(V9, V22, V8),
    // {  9, 20,  4, 25 }
    new THREE.Plane().setFromCoplanarPoints(V9, V20, V4),
    // { 10, 30,  7, 23 }
    new THREE.Plane().setFromCoplanarPoints(V10, V30, V7),
    // { 10, 23, 11, 21 }
    new THREE.Plane().setFromCoplanarPoints(V10, V23, V11),
    // { 10, 21,  5, 26 }
    new THREE.Plane().setFromCoplanarPoints(V10, V21, V5),
    // { 11, 31,  3, 15 }
    new THREE.Plane().setFromCoplanarPoints(V11, V31, V3),
    // { 11, 15,  1, 27 }
    new THREE.Plane().setFromCoplanarPoints(V11, V15, V1),
    // { 11, 27,  5, 21 }
    new THREE.Plane().setFromCoplanarPoints(V11, V27, V5),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Disdyakis Dodecahedron */
export function disdyakisDodecahedron(d: number) {
  // http://dmccooey.com/polyhedra/DisdyakisDodecahedron.txt
  let C0 = 1.41421356237309504880168872421;
  // C0 = sqrt(2)
  let C1 = 1.64075448203408147040144747789;
  // C1 = (3 + 6 * sqrt(2)) / 7
  let C2 = 2.67541743733683649131645693113;
  // C2 = (6 + 9 * sqrt(2)) / 7
  let V0 = new THREE.Vector3(0.0, 0.0,  C2);
  let V1 = new THREE.Vector3(0.0, 0.0, -C2);
  let V2 = new THREE.Vector3( C2, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C2, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C2, 0.0);
  let V5 = new THREE.Vector3(0.0, -C2, 0.0);
  let V6 = new THREE.Vector3( C1, 0.0,  C1);
  let V7 = new THREE.Vector3( C1, 0.0, -C1);
  let V8 = new THREE.Vector3(-C1, 0.0,  C1);
  let V9 = new THREE.Vector3(-C1, 0.0, -C1);
  let V10 = new THREE.Vector3( C1,  C1, 0.0);
  let V11 = new THREE.Vector3( C1, -C1, 0.0);
  let V12 = new THREE.Vector3(-C1,  C1, 0.0);
  let V13 = new THREE.Vector3(-C1, -C1, 0.0);
  let V14 = new THREE.Vector3(0.0,  C1,  C1);
  let V15 = new THREE.Vector3(0.0,  C1, -C1);
  let V16 = new THREE.Vector3(0.0, -C1,  C1);
  let V17 = new THREE.Vector3(0.0, -C1, -C1);
  let V18 = new THREE.Vector3( C0,  C0,  C0);
  let V19 = new THREE.Vector3( C0,  C0, -C0);
  let V20 = new THREE.Vector3( C0, -C0,  C0);
  let V21 = new THREE.Vector3( C0, -C0, -C0);
  let V22 = new THREE.Vector3(-C0,  C0,  C0);
  let V23 = new THREE.Vector3(-C0,  C0, -C0);
  let V24 = new THREE.Vector3(-C0, -C0,  C0);
  let V25 = new THREE.Vector3(-C0, -C0, -C0);
  let cuts = [
    // {  0,  6, 18 }
    new THREE.Plane().setFromCoplanarPoints(V0, V6, V18),
    // {  0, 18, 14 }
    new THREE.Plane().setFromCoplanarPoints(V0, V18, V14),
    // {  0, 14, 22 }
    new THREE.Plane().setFromCoplanarPoints(V0, V14, V22),
    // {  0, 22,  8 }
    new THREE.Plane().setFromCoplanarPoints(V0, V22, V8),
    // {  0,  8, 24 }
    new THREE.Plane().setFromCoplanarPoints(V0, V8, V24),
    // {  0, 24, 16 }
    new THREE.Plane().setFromCoplanarPoints(V0, V24, V16),
    // {  0, 16, 20 }
    new THREE.Plane().setFromCoplanarPoints(V0, V16, V20),
    // {  0, 20,  6 }
    new THREE.Plane().setFromCoplanarPoints(V0, V20, V6),
    // {  1,  7, 21 }
    new THREE.Plane().setFromCoplanarPoints(V1, V7, V21),
    // {  1, 21, 17 }
    new THREE.Plane().setFromCoplanarPoints(V1, V21, V17),
    // {  1, 17, 25 }
    new THREE.Plane().setFromCoplanarPoints(V1, V17, V25),
    // {  1, 25,  9 }
    new THREE.Plane().setFromCoplanarPoints(V1, V25, V9),
    // {  1,  9, 23 }
    new THREE.Plane().setFromCoplanarPoints(V1, V9, V23),
    // {  1, 23, 15 }
    new THREE.Plane().setFromCoplanarPoints(V1, V23, V15),
    // {  1, 15, 19 }
    new THREE.Plane().setFromCoplanarPoints(V1, V15, V19),
    // {  1, 19,  7 }
    new THREE.Plane().setFromCoplanarPoints(V1, V19, V7),
    // {  2,  6, 20 }
    new THREE.Plane().setFromCoplanarPoints(V2, V6, V20),
    // {  2, 20, 11 }
    new THREE.Plane().setFromCoplanarPoints(V2, V20, V11),
    // {  2, 11, 21 }
    new THREE.Plane().setFromCoplanarPoints(V2, V11, V21),
    // {  2, 21,  7 }
    new THREE.Plane().setFromCoplanarPoints(V2, V21, V7),
    // {  2,  7, 19 }
    new THREE.Plane().setFromCoplanarPoints(V2, V7, V19),
    // {  2, 19, 10 }
    new THREE.Plane().setFromCoplanarPoints(V2, V19, V10),
    // {  2, 10, 18 }
    new THREE.Plane().setFromCoplanarPoints(V2, V10, V18),
    // {  2, 18,  6 }
    new THREE.Plane().setFromCoplanarPoints(V2, V18, V6),
    // {  3,  8, 22 }
    new THREE.Plane().setFromCoplanarPoints(V3, V8, V22),
    // {  3, 22, 12 }
    new THREE.Plane().setFromCoplanarPoints(V3, V22, V12),
    // {  3, 12, 23 }
    new THREE.Plane().setFromCoplanarPoints(V3, V12, V23),
    // {  3, 23,  9 }
    new THREE.Plane().setFromCoplanarPoints(V3, V23, V9),
    // {  3,  9, 25 }
    new THREE.Plane().setFromCoplanarPoints(V3, V9, V25),
    // {  3, 25, 13 }
    new THREE.Plane().setFromCoplanarPoints(V3, V25, V13),
    // {  3, 13, 24 }
    new THREE.Plane().setFromCoplanarPoints(V3, V13, V24),
    // {  3, 24,  8 }
    new THREE.Plane().setFromCoplanarPoints(V3, V24, V8),
    // {  4, 10, 19 }
    new THREE.Plane().setFromCoplanarPoints(V4, V10, V19),
    // {  4, 19, 15 }
    new THREE.Plane().setFromCoplanarPoints(V4, V19, V15),
    // {  4, 15, 23 }
    new THREE.Plane().setFromCoplanarPoints(V4, V15, V23),
    // {  4, 23, 12 }
    new THREE.Plane().setFromCoplanarPoints(V4, V23, V12),
    // {  4, 12, 22 }
    new THREE.Plane().setFromCoplanarPoints(V4, V12, V22),
    // {  4, 22, 14 }
    new THREE.Plane().setFromCoplanarPoints(V4, V22, V14),
    // {  4, 14, 18 }
    new THREE.Plane().setFromCoplanarPoints(V4, V14, V18),
    // {  4, 18, 10 }
    new THREE.Plane().setFromCoplanarPoints(V4, V18, V10),
    // {  5, 11, 20 }
    new THREE.Plane().setFromCoplanarPoints(V5, V11, V20),
    // {  5, 20, 16 }
    new THREE.Plane().setFromCoplanarPoints(V5, V20, V16),
    // {  5, 16, 24 }
    new THREE.Plane().setFromCoplanarPoints(V5, V16, V24),
    // {  5, 24, 13 }
    new THREE.Plane().setFromCoplanarPoints(V5, V24, V13),
    // {  5, 13, 25 }
    new THREE.Plane().setFromCoplanarPoints(V5, V13, V25),
    // {  5, 25, 17 }
    new THREE.Plane().setFromCoplanarPoints(V5, V25, V17),
    // {  5, 17, 21 }
    new THREE.Plane().setFromCoplanarPoints(V5, V17, V21),
    // {  5, 21, 11 }
    new THREE.Plane().setFromCoplanarPoints(V5, V21, V11),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Pentakis Dodecahedron */
export function pentakisDodecahedron(d: number) {
  // http://dmccooey.com/polyhedra/PentakisDodecahedron.txt
  let C0 = 0.927050983124842272306880251548;
  // C0 = 3 * (sqrt(5) - 1) / 4
  let C1 = 1.33058699733550141141687582919;
  // C1 = 9 * (9 + sqrt(5)) / 76
  let C2 = 2.15293498667750705708437914596;
  // C2 = 9 * (7 + 5 * sqrt(5)) / 76
  let C3 = 2.427050983124842272306880251548;
  // C3 = 3 * (1 + sqrt(5)) / 4
  let V0 = new THREE.Vector3( 0.0,   C0,   C3);
  let V1 = new THREE.Vector3( 0.0,   C0,  -C3);
  let V2 = new THREE.Vector3( 0.0,  -C0,   C3);
  let V3 = new THREE.Vector3( 0.0,  -C0,  -C3);
  let V4 = new THREE.Vector3(  C3,  0.0,   C0);
  let V5 = new THREE.Vector3(  C3,  0.0,  -C0);
  let V6 = new THREE.Vector3( -C3,  0.0,   C0);
  let V7 = new THREE.Vector3( -C3,  0.0,  -C0);
  let V8 = new THREE.Vector3(  C0,   C3,  0.0);
  let V9 = new THREE.Vector3(  C0,  -C3,  0.0);
  let V10 = new THREE.Vector3( -C0,   C3,  0.0);
  let V11 = new THREE.Vector3( -C0,  -C3,  0.0);
  let V12 = new THREE.Vector3(  C1,  0.0,   C2);
  let V13 = new THREE.Vector3(  C1,  0.0,  -C2);
  let V14 = new THREE.Vector3( -C1,  0.0,   C2);
  let V15 = new THREE.Vector3( -C1,  0.0,  -C2);
  let V16 = new THREE.Vector3(  C2,   C1,  0.0);
  let V17 = new THREE.Vector3(  C2,  -C1,  0.0);
  let V18 = new THREE.Vector3( -C2,   C1,  0.0);
  let V19 = new THREE.Vector3( -C2,  -C1,  0.0);
  let V20 = new THREE.Vector3( 0.0,   C2,   C1);
  let V21 = new THREE.Vector3( 0.0,   C2,  -C1);
  let V22 = new THREE.Vector3( 0.0,  -C2,   C1);
  let V23 = new THREE.Vector3( 0.0,  -C2,  -C1);
  let V24 = new THREE.Vector3( 1.5,  1.5,  1.5);
  let V25 = new THREE.Vector3( 1.5,  1.5, -1.5);
  let V26 = new THREE.Vector3( 1.5, -1.5,  1.5);
  let V27 = new THREE.Vector3( 1.5, -1.5, -1.5);
  let V28 = new THREE.Vector3(-1.5,  1.5,  1.5);
  let V29 = new THREE.Vector3(-1.5,  1.5, -1.5);
  let V30 = new THREE.Vector3(-1.5, -1.5,  1.5);
  let V31 = new THREE.Vector3(-1.5, -1.5, -1.5);
  let cuts = [
    // { 12,  0,  2 }
    new THREE.Plane().setFromCoplanarPoints(V12, V0, V2),
    // { 12,  2, 26 }
    new THREE.Plane().setFromCoplanarPoints(V12, V2, V26),
    // { 12, 26,  4 }
    new THREE.Plane().setFromCoplanarPoints(V12, V26, V4),
    // { 12,  4, 24 }
    new THREE.Plane().setFromCoplanarPoints(V12, V4, V24),
    // { 12, 24,  0 }
    new THREE.Plane().setFromCoplanarPoints(V12, V24, V0),
    // { 13,  3,  1 }
    new THREE.Plane().setFromCoplanarPoints(V13, V3, V1),
    // { 13,  1, 25 }
    new THREE.Plane().setFromCoplanarPoints(V13, V1, V25),
    // { 13, 25,  5 }
    new THREE.Plane().setFromCoplanarPoints(V13, V25, V5),
    // { 13,  5, 27 }
    new THREE.Plane().setFromCoplanarPoints(V13, V5, V27),
    // { 13, 27,  3 }
    new THREE.Plane().setFromCoplanarPoints(V13, V27, V3),
    // { 14,  2,  0 }
    new THREE.Plane().setFromCoplanarPoints(V14, V2, V0),
    // { 14,  0, 28 }
    new THREE.Plane().setFromCoplanarPoints(V14, V0, V28),
    // { 14, 28,  6 }
    new THREE.Plane().setFromCoplanarPoints(V14, V28, V6),
    // { 14,  6, 30 }
    new THREE.Plane().setFromCoplanarPoints(V14, V6, V30),
    // { 14, 30,  2 }
    new THREE.Plane().setFromCoplanarPoints(V14, V30, V2),
    // { 15,  1,  3 }
    new THREE.Plane().setFromCoplanarPoints(V15, V1, V3),
    // { 15,  3, 31 }
    new THREE.Plane().setFromCoplanarPoints(V15, V3, V31),
    // { 15, 31,  7 }
    new THREE.Plane().setFromCoplanarPoints(V15, V31, V7),
    // { 15,  7, 29 }
    new THREE.Plane().setFromCoplanarPoints(V15, V7, V29),
    // { 15, 29,  1 }
    new THREE.Plane().setFromCoplanarPoints(V15, V29, V1),
    // { 16,  4,  5 }
    new THREE.Plane().setFromCoplanarPoints(V16, V4, V5),
    // { 16,  5, 25 }
    new THREE.Plane().setFromCoplanarPoints(V16, V5, V25),
    // { 16, 25,  8 }
    new THREE.Plane().setFromCoplanarPoints(V16, V25, V8),
    // { 16,  8, 24 }
    new THREE.Plane().setFromCoplanarPoints(V16, V8, V24),
    // { 16, 24,  4 }
    new THREE.Plane().setFromCoplanarPoints(V16, V24, V4),
    // { 17,  5,  4 }
    new THREE.Plane().setFromCoplanarPoints(V17, V5, V4),
    // { 17,  4, 26 }
    new THREE.Plane().setFromCoplanarPoints(V17, V4, V26),
    // { 17, 26,  9 }
    new THREE.Plane().setFromCoplanarPoints(V17, V26, V9),
    // { 17,  9, 27 }
    new THREE.Plane().setFromCoplanarPoints(V17, V9, V27),
    // { 17, 27,  5 }
    new THREE.Plane().setFromCoplanarPoints(V17, V27, V5),
    // { 18,  7,  6 }
    new THREE.Plane().setFromCoplanarPoints(V18, V7, V6),
    // { 18,  6, 28 }
    new THREE.Plane().setFromCoplanarPoints(V18, V6, V28),
    // { 18, 28, 10 }
    new THREE.Plane().setFromCoplanarPoints(V18, V28, V10),
    // { 18, 10, 29 }
    new THREE.Plane().setFromCoplanarPoints(V18, V10, V29),
    // { 18, 29,  7 }
    new THREE.Plane().setFromCoplanarPoints(V18, V29, V7),
    // { 19,  6,  7 }
    new THREE.Plane().setFromCoplanarPoints(V19, V6, V7),
    // { 19,  7, 31 }
    new THREE.Plane().setFromCoplanarPoints(V19, V7, V31),
    // { 19, 31, 11 }
    new THREE.Plane().setFromCoplanarPoints(V19, V31, V11),
    // { 19, 11, 30 }
    new THREE.Plane().setFromCoplanarPoints(V19, V11, V30),
    // { 19, 30,  6 }
    new THREE.Plane().setFromCoplanarPoints(V19, V30, V6),
    // { 20,  8, 10 }
    new THREE.Plane().setFromCoplanarPoints(V20, V8, V10),
    // { 20, 10, 28 }
    new THREE.Plane().setFromCoplanarPoints(V20, V10, V28),
    // { 20, 28,  0 }
    new THREE.Plane().setFromCoplanarPoints(V20, V28, V0),
    // { 20,  0, 24 }
    new THREE.Plane().setFromCoplanarPoints(V20, V0, V24),
    // { 20, 24,  8 }
    new THREE.Plane().setFromCoplanarPoints(V20, V24, V8),
    // { 21, 10,  8 }
    new THREE.Plane().setFromCoplanarPoints(V21, V10, V8),
    // { 21,  8, 25 }
    new THREE.Plane().setFromCoplanarPoints(V21, V8, V25),
    // { 21, 25,  1 }
    new THREE.Plane().setFromCoplanarPoints(V21, V25, V1),
    // { 21,  1, 29 }
    new THREE.Plane().setFromCoplanarPoints(V21, V1, V29),
    // { 21, 29, 10 }
    new THREE.Plane().setFromCoplanarPoints(V21, V29, V10),
    // { 22, 11,  9 }
    new THREE.Plane().setFromCoplanarPoints(V22, V11, V9),
    // { 22,  9, 26 }
    new THREE.Plane().setFromCoplanarPoints(V22, V9, V26),
    // { 22, 26,  2 }
    new THREE.Plane().setFromCoplanarPoints(V22, V26, V2),
    // { 22,  2, 30 }
    new THREE.Plane().setFromCoplanarPoints(V22, V2, V30),
    // { 22, 30, 11 }
    new THREE.Plane().setFromCoplanarPoints(V22, V30, V11),
    // { 23,  9, 11 }
    new THREE.Plane().setFromCoplanarPoints(V23, V9, V11),
    // { 23, 11, 31 }
    new THREE.Plane().setFromCoplanarPoints(V23, V11, V31),
    // { 23, 31,  3 }
    new THREE.Plane().setFromCoplanarPoints(V23, V31, V3),
    // { 23,  3, 27 }
    new THREE.Plane().setFromCoplanarPoints(V23, V3, V27),
    // { 23, 27,  9 }
    new THREE.Plane().setFromCoplanarPoints(V23, V27, V9),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Triakis Icosahedron */
export function triakisIcosahedron(d: number) {
  // http://dmccooey.com/polyhedra/TriakisIcosahedron.txt
  let C0 = 1.04955317926133973822831518963;
  // C0 = 5 * (7 + sqrt(5)) / 44
  let C1 = 1.69821271704535895291326075851;
  // C1 = 5 * (3 + 2 * sqrt(5)) / 22
  let C2 = 1.80901699437494742410229341718;
  // C2 = (5 + sqrt(5)) / 4
  let C3 = 2.74776589630669869114157594814;
  // C3 = 5 * (13 + 5 * sqrt(5)) / 44
  let C4 = 2.927050983124842272306880251548;
  // C4 = (5 + 3 * sqrt(5)) / 4
  let V0 = new THREE.Vector3( C2, 0.0,  C4);
  let V1 = new THREE.Vector3( C2, 0.0, -C4);
  let V2 = new THREE.Vector3(-C2, 0.0,  C4);
  let V3 = new THREE.Vector3(-C2, 0.0, -C4);
  let V4 = new THREE.Vector3( C4,  C2, 0.0);
  let V5 = new THREE.Vector3( C4, -C2, 0.0);
  let V6 = new THREE.Vector3(-C4,  C2, 0.0);
  let V7 = new THREE.Vector3(-C4, -C2, 0.0);
  let V8 = new THREE.Vector3(0.0,  C4,  C2);
  let V9 = new THREE.Vector3(0.0,  C4, -C2);
  let V10 = new THREE.Vector3(0.0, -C4,  C2);
  let V11 = new THREE.Vector3(0.0, -C4, -C2);
  let V12 = new THREE.Vector3(0.0,  C0,  C3);
  let V13 = new THREE.Vector3(0.0,  C0, -C3);
  let V14 = new THREE.Vector3(0.0, -C0,  C3);
  let V15 = new THREE.Vector3(0.0, -C0, -C3);
  let V16 = new THREE.Vector3( C3, 0.0,  C0);
  let V17 = new THREE.Vector3( C3, 0.0, -C0);
  let V18 = new THREE.Vector3(-C3, 0.0,  C0);
  let V19 = new THREE.Vector3(-C3, 0.0, -C0);
  let V20 = new THREE.Vector3( C0,  C3, 0.0);
  let V21 = new THREE.Vector3( C0, -C3, 0.0);
  let V22 = new THREE.Vector3(-C0,  C3, 0.0);
  let V23 = new THREE.Vector3(-C0, -C3, 0.0);
  let V24 = new THREE.Vector3( C1,  C1,  C1);
  let V25 = new THREE.Vector3( C1,  C1, -C1);
  let V26 = new THREE.Vector3( C1, -C1,  C1);
  let V27 = new THREE.Vector3( C1, -C1, -C1);
  let V28 = new THREE.Vector3(-C1,  C1,  C1);
  let V29 = new THREE.Vector3(-C1,  C1, -C1);
  let V30 = new THREE.Vector3(-C1, -C1,  C1);
  let V31 = new THREE.Vector3(-C1, -C1, -C1);
  let cuts = [
    // { 12,  0,  8 }
    new THREE.Plane().setFromCoplanarPoints(V12, V0, V8),
    // { 12,  8,  2 }
    new THREE.Plane().setFromCoplanarPoints(V12, V8, V2),
    // { 12,  2,  0 }
    new THREE.Plane().setFromCoplanarPoints(V12, V2, V0),
    // { 13,  1,  3 }
    new THREE.Plane().setFromCoplanarPoints(V13, V1, V3),
    // { 13,  3,  9 }
    new THREE.Plane().setFromCoplanarPoints(V13, V3, V9),
    // { 13,  9,  1 }
    new THREE.Plane().setFromCoplanarPoints(V13, V9, V1),
    // { 14,  0,  2 }
    new THREE.Plane().setFromCoplanarPoints(V14, V0, V2),
    // { 14,  2, 10 }
    new THREE.Plane().setFromCoplanarPoints(V14, V2, V10),
    // { 14, 10,  0 }
    new THREE.Plane().setFromCoplanarPoints(V14, V10, V0),
    // { 15,  1, 11 }
    new THREE.Plane().setFromCoplanarPoints(V15, V1, V11),
    // { 15, 11,  3 }
    new THREE.Plane().setFromCoplanarPoints(V15, V11, V3),
    // { 15,  3,  1 }
    new THREE.Plane().setFromCoplanarPoints(V15, V3, V1),
    // { 16,  0,  5 }
    new THREE.Plane().setFromCoplanarPoints(V16, V0, V5),
    // { 16,  5,  4 }
    new THREE.Plane().setFromCoplanarPoints(V16, V5, V4),
    // { 16,  4,  0 }
    new THREE.Plane().setFromCoplanarPoints(V16, V4, V0),
    // { 17,  1,  4 }
    new THREE.Plane().setFromCoplanarPoints(V17, V1, V4),
    // { 17,  4,  5 }
    new THREE.Plane().setFromCoplanarPoints(V17, V4, V5),
    // { 17,  5,  1 }
    new THREE.Plane().setFromCoplanarPoints(V17, V5, V1),
    // { 18,  2,  6 }
    new THREE.Plane().setFromCoplanarPoints(V18, V2, V6),
    // { 18,  6,  7 }
    new THREE.Plane().setFromCoplanarPoints(V18, V6, V7),
    // { 18,  7,  2 }
    new THREE.Plane().setFromCoplanarPoints(V18, V7, V2),
    // { 19,  3,  7 }
    new THREE.Plane().setFromCoplanarPoints(V19, V3, V7),
    // { 19,  7,  6 }
    new THREE.Plane().setFromCoplanarPoints(V19, V7, V6),
    // { 19,  6,  3 }
    new THREE.Plane().setFromCoplanarPoints(V19, V6, V3),
    // { 20,  4,  9 }
    new THREE.Plane().setFromCoplanarPoints(V20, V4, V9),
    // { 20,  9,  8 }
    new THREE.Plane().setFromCoplanarPoints(V20, V9, V8),
    // { 20,  8,  4 }
    new THREE.Plane().setFromCoplanarPoints(V20, V8, V4),
    // { 21,  5, 10 }
    new THREE.Plane().setFromCoplanarPoints(V21, V5, V10),
    // { 21, 10, 11 }
    new THREE.Plane().setFromCoplanarPoints(V21, V10, V11),
    // { 21, 11,  5 }
    new THREE.Plane().setFromCoplanarPoints(V21, V11, V5),
    // { 22,  6,  8 }
    new THREE.Plane().setFromCoplanarPoints(V22, V6, V8),
    // { 22,  8,  9 }
    new THREE.Plane().setFromCoplanarPoints(V22, V8, V9),
    // { 22,  9,  6 }
    new THREE.Plane().setFromCoplanarPoints(V22, V9, V6),
    // { 23,  7, 11 }
    new THREE.Plane().setFromCoplanarPoints(V23, V7, V11),
    // { 23, 11, 10 }
    new THREE.Plane().setFromCoplanarPoints(V23, V11, V10),
    // { 23, 10,  7 }
    new THREE.Plane().setFromCoplanarPoints(V23, V10, V7),
    // { 24,  0,  4 }
    new THREE.Plane().setFromCoplanarPoints(V24, V0, V4),
    // { 24,  4,  8 }
    new THREE.Plane().setFromCoplanarPoints(V24, V4, V8),
    // { 24,  8,  0 }
    new THREE.Plane().setFromCoplanarPoints(V24, V8, V0),
    // { 25,  1,  9 }
    new THREE.Plane().setFromCoplanarPoints(V25, V1, V9),
    // { 25,  9,  4 }
    new THREE.Plane().setFromCoplanarPoints(V25, V9, V4),
    // { 25,  4,  1 }
    new THREE.Plane().setFromCoplanarPoints(V25, V4, V1),
    // { 26,  0, 10 }
    new THREE.Plane().setFromCoplanarPoints(V26, V0, V10),
    // { 26, 10,  5 }
    new THREE.Plane().setFromCoplanarPoints(V26, V10, V5),
    // { 26,  5,  0 }
    new THREE.Plane().setFromCoplanarPoints(V26, V5, V0),
    // { 27,  1,  5 }
    new THREE.Plane().setFromCoplanarPoints(V27, V1, V5),
    // { 27,  5, 11 }
    new THREE.Plane().setFromCoplanarPoints(V27, V5, V11),
    // { 27, 11,  1 }
    new THREE.Plane().setFromCoplanarPoints(V27, V11, V1),
    // { 28,  2,  8 }
    new THREE.Plane().setFromCoplanarPoints(V28, V2, V8),
    // { 28,  8,  6 }
    new THREE.Plane().setFromCoplanarPoints(V28, V8, V6),
    // { 28,  6,  2 }
    new THREE.Plane().setFromCoplanarPoints(V28, V6, V2),
    // { 29,  3,  6 }
    new THREE.Plane().setFromCoplanarPoints(V29, V3, V6),
    // { 29,  6,  9 }
    new THREE.Plane().setFromCoplanarPoints(V29, V6, V9),
    // { 29,  9,  3 }
    new THREE.Plane().setFromCoplanarPoints(V29, V9, V3),
    // { 30,  2,  7 }
    new THREE.Plane().setFromCoplanarPoints(V30, V2, V7),
    // { 30,  7, 10 }
    new THREE.Plane().setFromCoplanarPoints(V30, V7, V10),
    // { 30, 10,  2 }
    new THREE.Plane().setFromCoplanarPoints(V30, V10, V2),
    // { 31,  3, 11 }
    new THREE.Plane().setFromCoplanarPoints(V31, V3, V11),
    // { 31, 11,  7 }
    new THREE.Plane().setFromCoplanarPoints(V31, V11, V7),
    // { 31,  7,  3 }
    new THREE.Plane().setFromCoplanarPoints(V31, V7, V3),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Deltoidal Hexecontahedron */
export function deltoidalHexecontahedron(d: number) {
  // http://dmccooey.com/polyhedra/DeltoidalHexecontahedron.txt
  let C0 = 0.690983005625052575897706582817;
  // C0 = (5 - sqrt(5)) / 4
  let C1 = 0.783457635340899531654962439488;
  // C1 = (15 + sqrt(5)) / 22
  let C2 = 1.11803398874989484820458683437;
  // C2 = sqrt(5) / 2
  let C3 = 1.20601132958329828273486227812;
  // C3 = (5 + sqrt(5)) / 6
  let C4 = 1.26766108272719625323969951590;
  // C4 = (5 + 4 * sqrt(5)) / 11
  let C5 = 1.80901699437494742410229341718;
  // C5 = (5 + sqrt(5)) / 4
  let C6 = 1.95136732208322818153792016770;
  // C6 = (5 + 3 * sqrt(5)) / 6
  let C7 = 2.05111871806809578489466195539;
  // C7 = (25 + 9 * sqrt(5)) / 22
  let C8 = 2.23606797749978969640917366873;
  // C8 = sqrt(5)
  let V0 = new THREE.Vector3(0.0, 0.0,  C8);
  let V1 = new THREE.Vector3(0.0, 0.0, -C8);
  let V2 = new THREE.Vector3( C8, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C8, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C8, 0.0);
  let V5 = new THREE.Vector3(0.0, -C8, 0.0);
  let V6 = new THREE.Vector3(0.0,  C1,  C7);
  let V7 = new THREE.Vector3(0.0,  C1, -C7);
  let V8 = new THREE.Vector3(0.0, -C1,  C7);
  let V9 = new THREE.Vector3(0.0, -C1, -C7);
  let V10 = new THREE.Vector3( C7, 0.0,  C1);
  let V11 = new THREE.Vector3( C7, 0.0, -C1);
  let V12 = new THREE.Vector3(-C7, 0.0,  C1);
  let V13 = new THREE.Vector3(-C7, 0.0, -C1);
  let V14 = new THREE.Vector3( C1,  C7, 0.0);
  let V15 = new THREE.Vector3( C1, -C7, 0.0);
  let V16 = new THREE.Vector3(-C1,  C7, 0.0);
  let V17 = new THREE.Vector3(-C1, -C7, 0.0);
  let V18 = new THREE.Vector3( C3, 0.0,  C6);
  let V19 = new THREE.Vector3( C3, 0.0, -C6);
  let V20 = new THREE.Vector3(-C3, 0.0,  C6);
  let V21 = new THREE.Vector3(-C3, 0.0, -C6);
  let V22 = new THREE.Vector3( C6,  C3, 0.0);
  let V23 = new THREE.Vector3( C6, -C3, 0.0);
  let V24 = new THREE.Vector3(-C6,  C3, 0.0);
  let V25 = new THREE.Vector3(-C6, -C3, 0.0);
  let V26 = new THREE.Vector3(0.0,  C6,  C3);
  let V27 = new THREE.Vector3(0.0,  C6, -C3);
  let V28 = new THREE.Vector3(0.0, -C6,  C3);
  let V29 = new THREE.Vector3(0.0, -C6, -C3);
  let V30 = new THREE.Vector3( C0,  C2,  C5);
  let V31 = new THREE.Vector3( C0,  C2, -C5);
  let V32 = new THREE.Vector3( C0, -C2,  C5);
  let V33 = new THREE.Vector3( C0, -C2, -C5);
  let V34 = new THREE.Vector3(-C0,  C2,  C5);
  let V35 = new THREE.Vector3(-C0,  C2, -C5);
  let V36 = new THREE.Vector3(-C0, -C2,  C5);
  let V37 = new THREE.Vector3(-C0, -C2, -C5);
  let V38 = new THREE.Vector3( C5,  C0,  C2);
  let V39 = new THREE.Vector3( C5,  C0, -C2);
  let V40 = new THREE.Vector3( C5, -C0,  C2);
  let V41 = new THREE.Vector3( C5, -C0, -C2);
  let V42 = new THREE.Vector3(-C5,  C0,  C2);
  let V43 = new THREE.Vector3(-C5,  C0, -C2);
  let V44 = new THREE.Vector3(-C5, -C0,  C2);
  let V45 = new THREE.Vector3(-C5, -C0, -C2);
  let V46 = new THREE.Vector3( C2,  C5,  C0);
  let V47 = new THREE.Vector3( C2,  C5, -C0);
  let V48 = new THREE.Vector3( C2, -C5,  C0);
  let V49 = new THREE.Vector3( C2, -C5, -C0);
  let V50 = new THREE.Vector3(-C2,  C5,  C0);
  let V51 = new THREE.Vector3(-C2,  C5, -C0);
  let V52 = new THREE.Vector3(-C2, -C5,  C0);
  let V53 = new THREE.Vector3(-C2, -C5, -C0);
  let V54 = new THREE.Vector3( C4,  C4,  C4);
  let V55 = new THREE.Vector3( C4,  C4, -C4);
  let V56 = new THREE.Vector3( C4, -C4,  C4);
  let V57 = new THREE.Vector3( C4, -C4, -C4);
  let V58 = new THREE.Vector3(-C4,  C4,  C4);
  let V59 = new THREE.Vector3(-C4,  C4, -C4);
  let V60 = new THREE.Vector3(-C4, -C4,  C4);
  let V61 = new THREE.Vector3(-C4, -C4, -C4);
  let cuts = [
    // { 18,  0,  8, 32 }
    new THREE.Plane().setFromCoplanarPoints(V18, V0, V8),
    // { 18, 32, 56, 40 }
    new THREE.Plane().setFromCoplanarPoints(V18, V32, V56),
    // { 18, 40, 10, 38 }
    new THREE.Plane().setFromCoplanarPoints(V18, V40, V10),
    // { 18, 38, 54, 30 }
    new THREE.Plane().setFromCoplanarPoints(V18, V38, V54),
    // { 18, 30,  6,  0 }
    new THREE.Plane().setFromCoplanarPoints(V18, V30, V6),
    // { 19,  1,  7, 31 }
    new THREE.Plane().setFromCoplanarPoints(V19, V1, V7),
    // { 19, 31, 55, 39 }
    new THREE.Plane().setFromCoplanarPoints(V19, V31, V55),
    // { 19, 39, 11, 41 }
    new THREE.Plane().setFromCoplanarPoints(V19, V39, V11),
    // { 19, 41, 57, 33 }
    new THREE.Plane().setFromCoplanarPoints(V19, V41, V57),
    // { 19, 33,  9,  1 }
    new THREE.Plane().setFromCoplanarPoints(V19, V33, V9),
    // { 20,  0,  6, 34 }
    new THREE.Plane().setFromCoplanarPoints(V20, V0, V6),
    // { 20, 34, 58, 42 }
    new THREE.Plane().setFromCoplanarPoints(V20, V34, V58),
    // { 20, 42, 12, 44 }
    new THREE.Plane().setFromCoplanarPoints(V20, V42, V12),
    // { 20, 44, 60, 36 }
    new THREE.Plane().setFromCoplanarPoints(V20, V44, V60),
    // { 20, 36,  8,  0 }
    new THREE.Plane().setFromCoplanarPoints(V20, V36, V8),
    // { 21,  1,  9, 37 }
    new THREE.Plane().setFromCoplanarPoints(V21, V1, V9),
    // { 21, 37, 61, 45 }
    new THREE.Plane().setFromCoplanarPoints(V21, V37, V61),
    // { 21, 45, 13, 43 }
    new THREE.Plane().setFromCoplanarPoints(V21, V45, V13),
    // { 21, 43, 59, 35 }
    new THREE.Plane().setFromCoplanarPoints(V21, V43, V59),
    // { 21, 35,  7,  1 }
    new THREE.Plane().setFromCoplanarPoints(V21, V35, V7),
    // { 22,  2, 11, 39 }
    new THREE.Plane().setFromCoplanarPoints(V22, V2, V11),
    // { 22, 39, 55, 47 }
    new THREE.Plane().setFromCoplanarPoints(V22, V39, V55),
    // { 22, 47, 14, 46 }
    new THREE.Plane().setFromCoplanarPoints(V22, V47, V14),
    // { 22, 46, 54, 38 }
    new THREE.Plane().setFromCoplanarPoints(V22, V46, V54),
    // { 22, 38, 10,  2 }
    new THREE.Plane().setFromCoplanarPoints(V22, V38, V10),
    // { 23,  2, 10, 40 }
    new THREE.Plane().setFromCoplanarPoints(V23, V2, V10),
    // { 23, 40, 56, 48 }
    new THREE.Plane().setFromCoplanarPoints(V23, V40, V56),
    // { 23, 48, 15, 49 }
    new THREE.Plane().setFromCoplanarPoints(V23, V48, V15),
    // { 23, 49, 57, 41 }
    new THREE.Plane().setFromCoplanarPoints(V23, V49, V57),
    // { 23, 41, 11,  2 }
    new THREE.Plane().setFromCoplanarPoints(V23, V41, V11),
    // { 24,  3, 12, 42 }
    new THREE.Plane().setFromCoplanarPoints(V24, V3, V12),
    // { 24, 42, 58, 50 }
    new THREE.Plane().setFromCoplanarPoints(V24, V42, V58),
    // { 24, 50, 16, 51 }
    new THREE.Plane().setFromCoplanarPoints(V24, V50, V16),
    // { 24, 51, 59, 43 }
    new THREE.Plane().setFromCoplanarPoints(V24, V51, V59),
    // { 24, 43, 13,  3 }
    new THREE.Plane().setFromCoplanarPoints(V24, V43, V13),
    // { 25,  3, 13, 45 }
    new THREE.Plane().setFromCoplanarPoints(V25, V3, V13),
    // { 25, 45, 61, 53 }
    new THREE.Plane().setFromCoplanarPoints(V25, V45, V61),
    // { 25, 53, 17, 52 }
    new THREE.Plane().setFromCoplanarPoints(V25, V53, V17),
    // { 25, 52, 60, 44 }
    new THREE.Plane().setFromCoplanarPoints(V25, V52, V60),
    // { 25, 44, 12,  3 }
    new THREE.Plane().setFromCoplanarPoints(V25, V44, V12),
    // { 26,  4, 16, 50 }
    new THREE.Plane().setFromCoplanarPoints(V26, V4, V16),
    // { 26, 50, 58, 34 }
    new THREE.Plane().setFromCoplanarPoints(V26, V50, V58),
    // { 26, 34,  6, 30 }
    new THREE.Plane().setFromCoplanarPoints(V26, V34, V6),
    // { 26, 30, 54, 46 }
    new THREE.Plane().setFromCoplanarPoints(V26, V30, V54),
    // { 26, 46, 14,  4 }
    new THREE.Plane().setFromCoplanarPoints(V26, V46, V14),
    // { 27,  4, 14, 47 }
    new THREE.Plane().setFromCoplanarPoints(V27, V4, V14),
    // { 27, 47, 55, 31 }
    new THREE.Plane().setFromCoplanarPoints(V27, V47, V55),
    // { 27, 31,  7, 35 }
    new THREE.Plane().setFromCoplanarPoints(V27, V31, V7),
    // { 27, 35, 59, 51 }
    new THREE.Plane().setFromCoplanarPoints(V27, V35, V59),
    // { 27, 51, 16,  4 }
    new THREE.Plane().setFromCoplanarPoints(V27, V51, V16),
    // { 28,  5, 15, 48 }
    new THREE.Plane().setFromCoplanarPoints(V28, V5, V15),
    // { 28, 48, 56, 32 }
    new THREE.Plane().setFromCoplanarPoints(V28, V48, V56),
    // { 28, 32,  8, 36 }
    new THREE.Plane().setFromCoplanarPoints(V28, V32, V8),
    // { 28, 36, 60, 52 }
    new THREE.Plane().setFromCoplanarPoints(V28, V36, V60),
    // { 28, 52, 17,  5 }
    new THREE.Plane().setFromCoplanarPoints(V28, V52, V17),
    // { 29,  5, 17, 53 }
    new THREE.Plane().setFromCoplanarPoints(V29, V5, V17),
    // { 29, 53, 61, 37 }
    new THREE.Plane().setFromCoplanarPoints(V29, V53, V61),
    // { 29, 37,  9, 33 }
    new THREE.Plane().setFromCoplanarPoints(V29, V37, V9),
    // { 29, 33, 57, 49 }
    new THREE.Plane().setFromCoplanarPoints(V29, V33, V57),
    // { 29, 49, 15,  5 }
    new THREE.Plane().setFromCoplanarPoints(V29, V49, V15),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Pentagonal Hexecontahedron (laevo) */
export function lpentagonalHexecontahedron(d: number) {
  // http://dmccooey.com/polyhedra/LpentagonalHexecontahedron.txt
  let C0 = 0.192893711352359022108262546061;
  let C1 = 0.218483370127321224365534157111;
  let C2 = 0.374821658114562295266609516608;
  let C3 = 0.567715369466921317374872062669;
  let C4 = 0.728335176957191477360671629838;
  let C5 = 0.755467260516595579705585253517;
  let C6 = 0.824957552676275846265811111988;
  let C7 = 0.921228888309550499468934175898;
  let C8 = 0.959987701391583803994339068107;
  let C9 = 1.13706613386050418840961998424;
  let C10 = 1.16712343647533397917215468549;
  let C11 = 1.22237170490362309266282747264;
  let C12 = 1.27209628257581214613814794036;
  let C13 = 1.52770307085850512136921113078;
  let C14 = 1.64691794069037444140475745697;
  let C15 = 1.74618644098582634573474528789;
  let C16 = 1.86540131081769566577029161408;
  let C17 = 1.88844538928366915418351670356;
  let C18 = 1.97783896542021867236841272616;
  let C19 = 2.097053835252087992403959052348;
  // C0 = phi * sqrt(3 - (x^2)) / 2
  // C1 = phi * sqrt((x - 1 - (1/x)) * phi) / (2 * x)
  // C2 = phi * sqrt((x - 1 - (1/x)) * phi) / 2
  // C3 = (x^2) * phi * sqrt(3 - (x^2)) / 2
  // C4 = phi * sqrt(1 - x + (1 + phi) / x) / 2
  // C5 = sqrt(x * (x + phi) + 1) / (2 * x)
  // C6 = sqrt((x + 2) * phi + 2) / (2 * x)
  // C7 = sqrt(-(x^2) * (2 + phi) + x * (1 + 3 * phi) + 4) / 2
  // C8 = (1 + phi) * sqrt(1 + (1/x)) / (2 * x)
  // C9 = sqrt(2 + 3 * phi - 2 * x + (3/x)) / 2
  // C10 = sqrt((x^2)*(392 + 225*phi) + x*(249 + 670*phi) + (470 + 157*phi))/62
  // C11 = phi * sqrt(x * (x + phi) + 1) / (2 * x)
  // C12 = phi * sqrt((x^2) + x + 1 + phi) / (2 * x)
  // C13 = phi * sqrt((x^2) + 2 * x * phi + 2) / (2 * x)
  // C14 = sqrt((x^2) * (1 + 2 * phi) - phi) / 2
  // C15 = phi * sqrt((x^2) + x) / 2
  // C16 = (phi^3) * sqrt(x * (x + phi) + 1) / (2 * (x^2))
  // C17 = sqrt((x^2)*(617 + 842*phi) + x*(919 + 1589*phi) + (627 + 784*phi))/62
  // C18 = (phi^2) * sqrt(x * (x + phi) + 1) / (2 * x)
  // C19 = phi * sqrt(x * (x + phi) + 1) / 2
  // WHERE:  phi = (1 + sqrt(5)) / 2
  //         x = cbrt((phi + sqrt(phi-5/27))/2) + cbrt((phi - sqrt(phi-5/27))/2)
  let V0 = new THREE.Vector3( -C0,  -C1, -C19);
  let V1 = new THREE.Vector3( -C0,   C1,  C19);
  let V2 = new THREE.Vector3(  C0,   C1, -C19);
  let V3 = new THREE.Vector3(  C0,  -C1,  C19);
  let V4 = new THREE.Vector3(-C19,  -C0,  -C1);
  let V5 = new THREE.Vector3(-C19,   C0,   C1);
  let V6 = new THREE.Vector3( C19,   C0,  -C1);
  let V7 = new THREE.Vector3( C19,  -C0,   C1);
  let V8 = new THREE.Vector3( -C1, -C19,  -C0);
  let V9 = new THREE.Vector3( -C1,  C19,   C0);
  let V10 = new THREE.Vector3(  C1,  C19,  -C0);
  let V11 = new THREE.Vector3(  C1, -C19,   C0);
  let V12 = new THREE.Vector3( 0.0,  -C5, -C18);
  let V13 = new THREE.Vector3( 0.0,  -C5,  C18);
  let V14 = new THREE.Vector3( 0.0,   C5, -C18);
  let V15 = new THREE.Vector3( 0.0,   C5,  C18);
  let V16 = new THREE.Vector3(-C18,  0.0,  -C5);
  let V17 = new THREE.Vector3(-C18,  0.0,   C5);
  let V18 = new THREE.Vector3( C18,  0.0,  -C5);
  let V19 = new THREE.Vector3( C18,  0.0,   C5);
  let V20 = new THREE.Vector3( -C5, -C18,  0.0);
  let V21 = new THREE.Vector3( -C5,  C18,  0.0);
  let V22 = new THREE.Vector3(  C5, -C18,  0.0);
  let V23 = new THREE.Vector3(  C5,  C18,  0.0);
  let V24 = new THREE.Vector3(-C10,  0.0, -C17);
  let V25 = new THREE.Vector3(-C10,  0.0,  C17);
  let V26 = new THREE.Vector3( C10,  0.0, -C17);
  let V27 = new THREE.Vector3( C10,  0.0,  C17);
  let V28 = new THREE.Vector3(-C17, -C10,  0.0);
  let V29 = new THREE.Vector3(-C17,  C10,  0.0);
  let V30 = new THREE.Vector3( C17, -C10,  0.0);
  let V31 = new THREE.Vector3( C17,  C10,  0.0);
  let V32 = new THREE.Vector3( 0.0, -C17, -C10);
  let V33 = new THREE.Vector3( 0.0, -C17,  C10);
  let V34 = new THREE.Vector3( 0.0,  C17, -C10);
  let V35 = new THREE.Vector3( 0.0,  C17,  C10);
  let V36 = new THREE.Vector3( -C3,   C6, -C16);
  let V37 = new THREE.Vector3( -C3,  -C6,  C16);
  let V38 = new THREE.Vector3(  C3,  -C6, -C16);
  let V39 = new THREE.Vector3(  C3,   C6,  C16);
  let V40 = new THREE.Vector3(-C16,   C3,  -C6);
  let V41 = new THREE.Vector3(-C16,  -C3,   C6);
  let V42 = new THREE.Vector3( C16,  -C3,  -C6);
  let V43 = new THREE.Vector3( C16,   C3,   C6);
  let V44 = new THREE.Vector3( -C6,  C16,  -C3);
  let V45 = new THREE.Vector3( -C6, -C16,   C3);
  let V46 = new THREE.Vector3(  C6, -C16,  -C3);
  let V47 = new THREE.Vector3(  C6,  C16,   C3);
  let V48 = new THREE.Vector3( -C2,  -C9, -C15);
  let V49 = new THREE.Vector3( -C2,   C9,  C15);
  let V50 = new THREE.Vector3(  C2,   C9, -C15);
  let V51 = new THREE.Vector3(  C2,  -C9,  C15);
  let V52 = new THREE.Vector3(-C15,  -C2,  -C9);
  let V53 = new THREE.Vector3(-C15,   C2,   C9);
  let V54 = new THREE.Vector3( C15,   C2,  -C9);
  let V55 = new THREE.Vector3( C15,  -C2,   C9);
  let V56 = new THREE.Vector3( -C9, -C15,  -C2);
  let V57 = new THREE.Vector3( -C9,  C15,   C2);
  let V58 = new THREE.Vector3(  C9,  C15,  -C2);
  let V59 = new THREE.Vector3(  C9, -C15,   C2);
  let V60 = new THREE.Vector3( -C7,  -C8, -C14);
  let V61 = new THREE.Vector3( -C7,   C8,  C14);
  let V62 = new THREE.Vector3(  C7,   C8, -C14);
  let V63 = new THREE.Vector3(  C7,  -C8,  C14);
  let V64 = new THREE.Vector3(-C14,  -C7,  -C8);
  let V65 = new THREE.Vector3(-C14,   C7,   C8);
  let V66 = new THREE.Vector3( C14,   C7,  -C8);
  let V67 = new THREE.Vector3( C14,  -C7,   C8);
  let V68 = new THREE.Vector3( -C8, -C14,  -C7);
  let V69 = new THREE.Vector3( -C8,  C14,   C7);
  let V70 = new THREE.Vector3(  C8,  C14,  -C7);
  let V71 = new THREE.Vector3(  C8, -C14,   C7);
  let V72 = new THREE.Vector3( -C4,  C12, -C13);
  let V73 = new THREE.Vector3( -C4, -C12,  C13);
  let V74 = new THREE.Vector3(  C4, -C12, -C13);
  let V75 = new THREE.Vector3(  C4,  C12,  C13);
  let V76 = new THREE.Vector3(-C13,   C4, -C12);
  let V77 = new THREE.Vector3(-C13,  -C4,  C12);
  let V78 = new THREE.Vector3( C13,  -C4, -C12);
  let V79 = new THREE.Vector3( C13,   C4,  C12);
  let V80 = new THREE.Vector3(-C12,  C13,  -C4);
  let V81 = new THREE.Vector3(-C12, -C13,   C4);
  let V82 = new THREE.Vector3( C12, -C13,  -C4);
  let V83 = new THREE.Vector3( C12,  C13,   C4);
  let V84 = new THREE.Vector3(-C11, -C11, -C11);
  let V85 = new THREE.Vector3(-C11, -C11,  C11);
  let V86 = new THREE.Vector3(-C11,  C11, -C11);
  let V87 = new THREE.Vector3(-C11,  C11,  C11);
  let V88 = new THREE.Vector3( C11, -C11, -C11);
  let V89 = new THREE.Vector3( C11, -C11,  C11);
  let V90 = new THREE.Vector3( C11,  C11, -C11);
  let V91 = new THREE.Vector3( C11,  C11,  C11);
  let cuts = [
    // { 24, 36, 14,  2,  0 }
    new THREE.Plane().setFromCoplanarPoints(V24, V36, V14),
    // { 24, 76, 86, 72, 36 }
    new THREE.Plane().setFromCoplanarPoints(V24, V76, V86),
    // { 24, 52, 16, 40, 76 }
    new THREE.Plane().setFromCoplanarPoints(V24, V52, V16),
    // { 24, 60, 84, 64, 52 }
    new THREE.Plane().setFromCoplanarPoints(V24, V60, V84),
    // { 24,  0, 12, 48, 60 }
    new THREE.Plane().setFromCoplanarPoints(V24, V0, V12),
    // { 25, 37, 13,  3,  1 }
    new THREE.Plane().setFromCoplanarPoints(V25, V37, V13),
    // { 25, 77, 85, 73, 37 }
    new THREE.Plane().setFromCoplanarPoints(V25, V77, V85),
    // { 25, 53, 17, 41, 77 }
    new THREE.Plane().setFromCoplanarPoints(V25, V53, V17),
    // { 25, 61, 87, 65, 53 }
    new THREE.Plane().setFromCoplanarPoints(V25, V61, V87),
    // { 25,  1, 15, 49, 61 }
    new THREE.Plane().setFromCoplanarPoints(V25, V1, V15),
    // { 26, 38, 12,  0,  2 }
    new THREE.Plane().setFromCoplanarPoints(V26, V38, V12),
    // { 26, 78, 88, 74, 38 }
    new THREE.Plane().setFromCoplanarPoints(V26, V78, V88),
    // { 26, 54, 18, 42, 78 }
    new THREE.Plane().setFromCoplanarPoints(V26, V54, V18),
    // { 26, 62, 90, 66, 54 }
    new THREE.Plane().setFromCoplanarPoints(V26, V62, V90),
    // { 26,  2, 14, 50, 62 }
    new THREE.Plane().setFromCoplanarPoints(V26, V2, V14),
    // { 27, 39, 15,  1,  3 }
    new THREE.Plane().setFromCoplanarPoints(V27, V39, V15),
    // { 27, 79, 91, 75, 39 }
    new THREE.Plane().setFromCoplanarPoints(V27, V79, V91),
    // { 27, 55, 19, 43, 79 }
    new THREE.Plane().setFromCoplanarPoints(V27, V55, V19),
    // { 27, 63, 89, 67, 55 }
    new THREE.Plane().setFromCoplanarPoints(V27, V63, V89),
    // { 27,  3, 13, 51, 63 }
    new THREE.Plane().setFromCoplanarPoints(V27, V3, V13),
    // { 28, 41, 17,  5,  4 }
    new THREE.Plane().setFromCoplanarPoints(V28, V41, V17),
    // { 28, 81, 85, 77, 41 }
    new THREE.Plane().setFromCoplanarPoints(V28, V81, V85),
    // { 28, 56, 20, 45, 81 }
    new THREE.Plane().setFromCoplanarPoints(V28, V56, V20),
    // { 28, 64, 84, 68, 56 }
    new THREE.Plane().setFromCoplanarPoints(V28, V64, V84),
    // { 28,  4, 16, 52, 64 }
    new THREE.Plane().setFromCoplanarPoints(V28, V4, V16),
    // { 29, 40, 16,  4,  5 }
    new THREE.Plane().setFromCoplanarPoints(V29, V40, V16),
    // { 29, 80, 86, 76, 40 }
    new THREE.Plane().setFromCoplanarPoints(V29, V80, V86),
    // { 29, 57, 21, 44, 80 }
    new THREE.Plane().setFromCoplanarPoints(V29, V57, V21),
    // { 29, 65, 87, 69, 57 }
    new THREE.Plane().setFromCoplanarPoints(V29, V65, V87),
    // { 29,  5, 17, 53, 65 }
    new THREE.Plane().setFromCoplanarPoints(V29, V5, V17),
    // { 30, 42, 18,  6,  7 }
    new THREE.Plane().setFromCoplanarPoints(V30, V42, V18),
    // { 30, 82, 88, 78, 42 }
    new THREE.Plane().setFromCoplanarPoints(V30, V82, V88),
    // { 30, 59, 22, 46, 82 }
    new THREE.Plane().setFromCoplanarPoints(V30, V59, V22),
    // { 30, 67, 89, 71, 59 }
    new THREE.Plane().setFromCoplanarPoints(V30, V67, V89),
    // { 30,  7, 19, 55, 67 }
    new THREE.Plane().setFromCoplanarPoints(V30, V7, V19),
    // { 31, 43, 19,  7,  6 }
    new THREE.Plane().setFromCoplanarPoints(V31, V43, V19),
    // { 31, 83, 91, 79, 43 }
    new THREE.Plane().setFromCoplanarPoints(V31, V83, V91),
    // { 31, 58, 23, 47, 83 }
    new THREE.Plane().setFromCoplanarPoints(V31, V58, V23),
    // { 31, 66, 90, 70, 58 }
    new THREE.Plane().setFromCoplanarPoints(V31, V66, V90),
    // { 31,  6, 18, 54, 66 }
    new THREE.Plane().setFromCoplanarPoints(V31, V6, V18),
    // { 32, 46, 22, 11,  8 }
    new THREE.Plane().setFromCoplanarPoints(V32, V46, V22),
    // { 32, 74, 88, 82, 46 }
    new THREE.Plane().setFromCoplanarPoints(V32, V74, V88),
    // { 32, 48, 12, 38, 74 }
    new THREE.Plane().setFromCoplanarPoints(V32, V48, V12),
    // { 32, 68, 84, 60, 48 }
    new THREE.Plane().setFromCoplanarPoints(V32, V68, V84),
    // { 32,  8, 20, 56, 68 }
    new THREE.Plane().setFromCoplanarPoints(V32, V8, V20),
    // { 33, 45, 20,  8, 11 }
    new THREE.Plane().setFromCoplanarPoints(V33, V45, V20),
    // { 33, 73, 85, 81, 45 }
    new THREE.Plane().setFromCoplanarPoints(V33, V73, V85),
    // { 33, 51, 13, 37, 73 }
    new THREE.Plane().setFromCoplanarPoints(V33, V51, V13),
    // { 33, 71, 89, 63, 51 }
    new THREE.Plane().setFromCoplanarPoints(V33, V71, V89),
    // { 33, 11, 22, 59, 71 }
    new THREE.Plane().setFromCoplanarPoints(V33, V11, V22),
    // { 34, 44, 21,  9, 10 }
    new THREE.Plane().setFromCoplanarPoints(V34, V44, V21),
    // { 34, 72, 86, 80, 44 }
    new THREE.Plane().setFromCoplanarPoints(V34, V72, V86),
    // { 34, 50, 14, 36, 72 }
    new THREE.Plane().setFromCoplanarPoints(V34, V50, V14),
    // { 34, 70, 90, 62, 50 }
    new THREE.Plane().setFromCoplanarPoints(V34, V70, V90),
    // { 34, 10, 23, 58, 70 }
    new THREE.Plane().setFromCoplanarPoints(V34, V10, V23),
    // { 35, 47, 23, 10,  9 }
    new THREE.Plane().setFromCoplanarPoints(V35, V47, V23),
    // { 35, 75, 91, 83, 47 }
    new THREE.Plane().setFromCoplanarPoints(V35, V75, V91),
    // { 35, 49, 15, 39, 75 }
    new THREE.Plane().setFromCoplanarPoints(V35, V49, V15),
    // { 35, 69, 87, 61, 49 }
    new THREE.Plane().setFromCoplanarPoints(V35, V69, V87),
    // { 35,  9, 21, 57, 69 }
    new THREE.Plane().setFromCoplanarPoints(V35, V9, V21),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Pentagonal Hexecontahedron (dextro) */
export function rpentagonalHexecontahedron(d: number) {
  // http://dmccooey.com/polyhedra/RpentagonalHexecontahedron.txt
  let C0 = 0.192893711352359022108262546061;
  let C1 = 0.218483370127321224365534157111;
  let C2 = 0.374821658114562295266609516608;
  let C3 = 0.567715369466921317374872062669;
  let C4 = 0.728335176957191477360671629838;
  let C5 = 0.755467260516595579705585253517;
  let C6 = 0.824957552676275846265811111988;
  let C7 = 0.921228888309550499468934175898;
  let C8 = 0.959987701391583803994339068107;
  let C9 = 1.13706613386050418840961998424;
  let C10 = 1.16712343647533397917215468549;
  let C11 = 1.22237170490362309266282747264;
  let C12 = 1.27209628257581214613814794036;
  let C13 = 1.52770307085850512136921113078;
  let C14 = 1.64691794069037444140475745697;
  let C15 = 1.74618644098582634573474528789;
  let C16 = 1.86540131081769566577029161408;
  let C17 = 1.88844538928366915418351670356;
  let C18 = 1.97783896542021867236841272616;
  let C19 = 2.097053835252087992403959052348;
  // C0 = phi * sqrt(3 - (x^2)) / 2
  // C1 = phi * sqrt((x - 1 - (1/x)) * phi) / (2 * x)
  // C2 = phi * sqrt((x - 1 - (1/x)) * phi) / 2
  // C3 = (x^2) * phi * sqrt(3 - (x^2)) / 2
  // C4 = phi * sqrt(1 - x + (1 + phi) / x) / 2
  // C5 = sqrt(x * (x + phi) + 1) / (2 * x)
  // C6 = sqrt((x + 2) * phi + 2) / (2 * x)
  // C7 = sqrt(-(x^2) * (2 + phi) + x * (1 + 3 * phi) + 4) / 2
  // C8 = (1 + phi) * sqrt(1 + (1/x)) / (2 * x)
  // C9 = sqrt(2 + 3 * phi - 2 * x + (3/x)) / 2
  // C10 = sqrt((x^2)*(392 + 225*phi) + x*(249 + 670*phi) + (470 + 157*phi))/62
  // C11 = phi * sqrt(x * (x + phi) + 1) / (2 * x)
  // C12 = phi * sqrt((x^2) + x + 1 + phi) / (2 * x)
  // C13 = phi * sqrt((x^2) + 2 * x * phi + 2) / (2 * x)
  // C14 = sqrt((x^2) * (1 + 2 * phi) - phi) / 2
  // C15 = phi * sqrt((x^2) + x) / 2
  // C16 = (phi^3) * sqrt(x * (x + phi) + 1) / (2 * (x^2))
  // C17 = sqrt((x^2)*(617 + 842*phi) + x*(919 + 1589*phi) + (627 + 784*phi))/62
  // C18 = (phi^2) * sqrt(x * (x + phi) + 1) / (2 * x)
  // C19 = phi * sqrt(x * (x + phi) + 1) / 2
  // WHERE:  phi = (1 + sqrt(5)) / 2
  //         x = cbrt((phi + sqrt(phi-5/27))/2) + cbrt((phi - sqrt(phi-5/27))/2)
  let V0 = new THREE.Vector3(  C0,   C1,  C19);
  let V1 = new THREE.Vector3(  C0,  -C1, -C19);
  let V2 = new THREE.Vector3( -C0,  -C1,  C19);
  let V3 = new THREE.Vector3( -C0,   C1, -C19);
  let V4 = new THREE.Vector3( C19,   C0,   C1);
  let V5 = new THREE.Vector3( C19,  -C0,  -C1);
  let V6 = new THREE.Vector3(-C19,  -C0,   C1);
  let V7 = new THREE.Vector3(-C19,   C0,  -C1);
  let V8 = new THREE.Vector3(  C1,  C19,   C0);
  let V9 = new THREE.Vector3(  C1, -C19,  -C0);
  let V10 = new THREE.Vector3( -C1, -C19,   C0);
  let V11 = new THREE.Vector3( -C1,  C19,  -C0);
  let V12 = new THREE.Vector3( 0.0,   C5,  C18);
  let V13 = new THREE.Vector3( 0.0,   C5, -C18);
  let V14 = new THREE.Vector3( 0.0,  -C5,  C18);
  let V15 = new THREE.Vector3( 0.0,  -C5, -C18);
  let V16 = new THREE.Vector3( C18,  0.0,   C5);
  let V17 = new THREE.Vector3( C18,  0.0,  -C5);
  let V18 = new THREE.Vector3(-C18,  0.0,   C5);
  let V19 = new THREE.Vector3(-C18,  0.0,  -C5);
  let V20 = new THREE.Vector3(  C5,  C18,  0.0);
  let V21 = new THREE.Vector3(  C5, -C18,  0.0);
  let V22 = new THREE.Vector3( -C5,  C18,  0.0);
  let V23 = new THREE.Vector3( -C5, -C18,  0.0);
  let V24 = new THREE.Vector3( C10,  0.0,  C17);
  let V25 = new THREE.Vector3( C10,  0.0, -C17);
  let V26 = new THREE.Vector3(-C10,  0.0,  C17);
  let V27 = new THREE.Vector3(-C10,  0.0, -C17);
  let V28 = new THREE.Vector3( C17,  C10,  0.0);
  let V29 = new THREE.Vector3( C17, -C10,  0.0);
  let V30 = new THREE.Vector3(-C17,  C10,  0.0);
  let V31 = new THREE.Vector3(-C17, -C10,  0.0);
  let V32 = new THREE.Vector3( 0.0,  C17,  C10);
  let V33 = new THREE.Vector3( 0.0,  C17, -C10);
  let V34 = new THREE.Vector3( 0.0, -C17,  C10);
  let V35 = new THREE.Vector3( 0.0, -C17, -C10);
  let V36 = new THREE.Vector3(  C3,  -C6,  C16);
  let V37 = new THREE.Vector3(  C3,   C6, -C16);
  let V38 = new THREE.Vector3( -C3,   C6,  C16);
  let V39 = new THREE.Vector3( -C3,  -C6, -C16);
  let V40 = new THREE.Vector3( C16,  -C3,   C6);
  let V41 = new THREE.Vector3( C16,   C3,  -C6);
  let V42 = new THREE.Vector3(-C16,   C3,   C6);
  let V43 = new THREE.Vector3(-C16,  -C3,  -C6);
  let V44 = new THREE.Vector3(  C6, -C16,   C3);
  let V45 = new THREE.Vector3(  C6,  C16,  -C3);
  let V46 = new THREE.Vector3( -C6,  C16,   C3);
  let V47 = new THREE.Vector3( -C6, -C16,  -C3);
  let V48 = new THREE.Vector3(  C2,   C9,  C15);
  let V49 = new THREE.Vector3(  C2,  -C9, -C15);
  let V50 = new THREE.Vector3( -C2,  -C9,  C15);
  let V51 = new THREE.Vector3( -C2,   C9, -C15);
  let V52 = new THREE.Vector3( C15,   C2,   C9);
  let V53 = new THREE.Vector3( C15,  -C2,  -C9);
  let V54 = new THREE.Vector3(-C15,  -C2,   C9);
  let V55 = new THREE.Vector3(-C15,   C2,  -C9);
  let V56 = new THREE.Vector3(  C9,  C15,   C2);
  let V57 = new THREE.Vector3(  C9, -C15,  -C2);
  let V58 = new THREE.Vector3( -C9, -C15,   C2);
  let V59 = new THREE.Vector3( -C9,  C15,  -C2);
  let V60 = new THREE.Vector3(  C7,   C8,  C14);
  let V61 = new THREE.Vector3(  C7,  -C8, -C14);
  let V62 = new THREE.Vector3( -C7,  -C8,  C14);
  let V63 = new THREE.Vector3( -C7,   C8, -C14);
  let V64 = new THREE.Vector3( C14,   C7,   C8);
  let V65 = new THREE.Vector3( C14,  -C7,  -C8);
  let V66 = new THREE.Vector3(-C14,  -C7,   C8);
  let V67 = new THREE.Vector3(-C14,   C7,  -C8);
  let V68 = new THREE.Vector3(  C8,  C14,   C7);
  let V69 = new THREE.Vector3(  C8, -C14,  -C7);
  let V70 = new THREE.Vector3( -C8, -C14,   C7);
  let V71 = new THREE.Vector3( -C8,  C14,  -C7);
  let V72 = new THREE.Vector3(  C4, -C12,  C13);
  let V73 = new THREE.Vector3(  C4,  C12, -C13);
  let V74 = new THREE.Vector3( -C4,  C12,  C13);
  let V75 = new THREE.Vector3( -C4, -C12, -C13);
  let V76 = new THREE.Vector3( C13,  -C4,  C12);
  let V77 = new THREE.Vector3( C13,   C4, -C12);
  let V78 = new THREE.Vector3(-C13,   C4,  C12);
  let V79 = new THREE.Vector3(-C13,  -C4, -C12);
  let V80 = new THREE.Vector3( C12, -C13,   C4);
  let V81 = new THREE.Vector3( C12,  C13,  -C4);
  let V82 = new THREE.Vector3(-C12,  C13,   C4);
  let V83 = new THREE.Vector3(-C12, -C13,  -C4);
  let V84 = new THREE.Vector3( C11,  C11,  C11);
  let V85 = new THREE.Vector3( C11,  C11, -C11);
  let V86 = new THREE.Vector3( C11, -C11,  C11);
  let V87 = new THREE.Vector3( C11, -C11, -C11);
  let V88 = new THREE.Vector3(-C11,  C11,  C11);
  let V89 = new THREE.Vector3(-C11,  C11, -C11);
  let V90 = new THREE.Vector3(-C11, -C11,  C11);
  let V91 = new THREE.Vector3(-C11, -C11, -C11);
  let cuts = [
    // { 24,  0,  2, 14, 36 }
    new THREE.Plane().setFromCoplanarPoints(V24, V0, V2),
    // { 24, 36, 72, 86, 76 }
    new THREE.Plane().setFromCoplanarPoints(V24, V36, V72),
    // { 24, 76, 40, 16, 52 }
    new THREE.Plane().setFromCoplanarPoints(V24, V76, V40),
    // { 24, 52, 64, 84, 60 }
    new THREE.Plane().setFromCoplanarPoints(V24, V52, V64),
    // { 24, 60, 48, 12,  0 }
    new THREE.Plane().setFromCoplanarPoints(V24, V60, V48),
    // { 25,  1,  3, 13, 37 }
    new THREE.Plane().setFromCoplanarPoints(V25, V1, V3),
    // { 25, 37, 73, 85, 77 }
    new THREE.Plane().setFromCoplanarPoints(V25, V37, V73),
    // { 25, 77, 41, 17, 53 }
    new THREE.Plane().setFromCoplanarPoints(V25, V77, V41),
    // { 25, 53, 65, 87, 61 }
    new THREE.Plane().setFromCoplanarPoints(V25, V53, V65),
    // { 25, 61, 49, 15,  1 }
    new THREE.Plane().setFromCoplanarPoints(V25, V61, V49),
    // { 26,  2,  0, 12, 38 }
    new THREE.Plane().setFromCoplanarPoints(V26, V2, V0),
    // { 26, 38, 74, 88, 78 }
    new THREE.Plane().setFromCoplanarPoints(V26, V38, V74),
    // { 26, 78, 42, 18, 54 }
    new THREE.Plane().setFromCoplanarPoints(V26, V78, V42),
    // { 26, 54, 66, 90, 62 }
    new THREE.Plane().setFromCoplanarPoints(V26, V54, V66),
    // { 26, 62, 50, 14,  2 }
    new THREE.Plane().setFromCoplanarPoints(V26, V62, V50),
    // { 27,  3,  1, 15, 39 }
    new THREE.Plane().setFromCoplanarPoints(V27, V3, V1),
    // { 27, 39, 75, 91, 79 }
    new THREE.Plane().setFromCoplanarPoints(V27, V39, V75),
    // { 27, 79, 43, 19, 55 }
    new THREE.Plane().setFromCoplanarPoints(V27, V79, V43),
    // { 27, 55, 67, 89, 63 }
    new THREE.Plane().setFromCoplanarPoints(V27, V55, V67),
    // { 27, 63, 51, 13,  3 }
    new THREE.Plane().setFromCoplanarPoints(V27, V63, V51),
    // { 28,  4,  5, 17, 41 }
    new THREE.Plane().setFromCoplanarPoints(V28, V4, V5),
    // { 28, 41, 77, 85, 81 }
    new THREE.Plane().setFromCoplanarPoints(V28, V41, V77),
    // { 28, 81, 45, 20, 56 }
    new THREE.Plane().setFromCoplanarPoints(V28, V81, V45),
    // { 28, 56, 68, 84, 64 }
    new THREE.Plane().setFromCoplanarPoints(V28, V56, V68),
    // { 28, 64, 52, 16,  4 }
    new THREE.Plane().setFromCoplanarPoints(V28, V64, V52),
    // { 29,  5,  4, 16, 40 }
    new THREE.Plane().setFromCoplanarPoints(V29, V5, V4),
    // { 29, 40, 76, 86, 80 }
    new THREE.Plane().setFromCoplanarPoints(V29, V40, V76),
    // { 29, 80, 44, 21, 57 }
    new THREE.Plane().setFromCoplanarPoints(V29, V80, V44),
    // { 29, 57, 69, 87, 65 }
    new THREE.Plane().setFromCoplanarPoints(V29, V57, V69),
    // { 29, 65, 53, 17,  5 }
    new THREE.Plane().setFromCoplanarPoints(V29, V65, V53),
    // { 30,  7,  6, 18, 42 }
    new THREE.Plane().setFromCoplanarPoints(V30, V7, V6),
    // { 30, 42, 78, 88, 82 }
    new THREE.Plane().setFromCoplanarPoints(V30, V42, V78),
    // { 30, 82, 46, 22, 59 }
    new THREE.Plane().setFromCoplanarPoints(V30, V82, V46),
    // { 30, 59, 71, 89, 67 }
    new THREE.Plane().setFromCoplanarPoints(V30, V59, V71),
    // { 30, 67, 55, 19,  7 }
    new THREE.Plane().setFromCoplanarPoints(V30, V67, V55),
    // { 31,  6,  7, 19, 43 }
    new THREE.Plane().setFromCoplanarPoints(V31, V6, V7),
    // { 31, 43, 79, 91, 83 }
    new THREE.Plane().setFromCoplanarPoints(V31, V43, V79),
    // { 31, 83, 47, 23, 58 }
    new THREE.Plane().setFromCoplanarPoints(V31, V83, V47),
    // { 31, 58, 70, 90, 66 }
    new THREE.Plane().setFromCoplanarPoints(V31, V58, V70),
    // { 31, 66, 54, 18,  6 }
    new THREE.Plane().setFromCoplanarPoints(V31, V66, V54),
    // { 32,  8, 11, 22, 46 }
    new THREE.Plane().setFromCoplanarPoints(V32, V8, V11),
    // { 32, 46, 82, 88, 74 }
    new THREE.Plane().setFromCoplanarPoints(V32, V46, V82),
    // { 32, 74, 38, 12, 48 }
    new THREE.Plane().setFromCoplanarPoints(V32, V74, V38),
    // { 32, 48, 60, 84, 68 }
    new THREE.Plane().setFromCoplanarPoints(V32, V48, V60),
    // { 32, 68, 56, 20,  8 }
    new THREE.Plane().setFromCoplanarPoints(V32, V68, V56),
    // { 33, 11,  8, 20, 45 }
    new THREE.Plane().setFromCoplanarPoints(V33, V11, V8),
    // { 33, 45, 81, 85, 73 }
    new THREE.Plane().setFromCoplanarPoints(V33, V45, V81),
    // { 33, 73, 37, 13, 51 }
    new THREE.Plane().setFromCoplanarPoints(V33, V73, V37),
    // { 33, 51, 63, 89, 71 }
    new THREE.Plane().setFromCoplanarPoints(V33, V51, V63),
    // { 33, 71, 59, 22, 11 }
    new THREE.Plane().setFromCoplanarPoints(V33, V71, V59),
    // { 34, 10,  9, 21, 44 }
    new THREE.Plane().setFromCoplanarPoints(V34, V10, V9),
    // { 34, 44, 80, 86, 72 }
    new THREE.Plane().setFromCoplanarPoints(V34, V44, V80),
    // { 34, 72, 36, 14, 50 }
    new THREE.Plane().setFromCoplanarPoints(V34, V72, V36),
    // { 34, 50, 62, 90, 70 }
    new THREE.Plane().setFromCoplanarPoints(V34, V50, V62),
    // { 34, 70, 58, 23, 10 }
    new THREE.Plane().setFromCoplanarPoints(V34, V70, V58),
    // { 35,  9, 10, 23, 47 }
    new THREE.Plane().setFromCoplanarPoints(V35, V9, V10),
    // { 35, 47, 83, 91, 75 }
    new THREE.Plane().setFromCoplanarPoints(V35, V47, V83),
    // { 35, 75, 39, 15, 49 }
    new THREE.Plane().setFromCoplanarPoints(V35, V75, V39),
    // { 35, 49, 61, 87, 69 }
    new THREE.Plane().setFromCoplanarPoints(V35, V49, V61),
    // { 35, 69, 57, 21,  9 }
    new THREE.Plane().setFromCoplanarPoints(V35, V69, V57),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

/* Disdyakis Triacontahedron */
export function disdyakisTriacontahedron(d: number) {
  // http://dmccooey.com/polyhedra/DisdyakisTriacontahedron.txt
  let C0 = 1.17518645301134929748244365923;
  // C0 = 3 * (15 + sqrt(5)) / 44
  let C1 = 1.38196601125010515179541316563;
  // C1 = (5 - sqrt(5)) / 2
  let C2 = 1.901491624090794379859549273853;
  // C2 = 3 * (5 + 4 * sqrt(5)) / 22
  let C3 = 2.17082039324993690892275210062;
  // C3 = 3 * (5 + sqrt(5)) / 10
  let C4 = 2.23606797749978969640917366873;
  // C4 = sqrt(5)
  let C5 = 3.07667807710214367734199293309;
  // C5 = (75 + 27 * sqrt(5)) / 44
  let C6 = 3.51246117974981072676825630186;
  // C6 = (15 + 9 * sqrt(5)) / 10
  let C7 = 3.61803398874989484820458683437;
  // C7 = (5 + sqrt(5)) / 2
  let C8 = 3.80298324818158875971909854771;
  // C8 = 3 * (5 + 4 * sqrt(5)) / 11
  let V0 = new THREE.Vector3(0.0, 0.0,  C8);
  let V1 = new THREE.Vector3(0.0, 0.0, -C8);
  let V2 = new THREE.Vector3( C8, 0.0, 0.0);
  let V3 = new THREE.Vector3(-C8, 0.0, 0.0);
  let V4 = new THREE.Vector3(0.0,  C8, 0.0);
  let V5 = new THREE.Vector3(0.0, -C8, 0.0);
  let V6 = new THREE.Vector3(0.0,  C1,  C7);
  let V7 = new THREE.Vector3(0.0,  C1, -C7);
  let V8 = new THREE.Vector3(0.0, -C1,  C7);
  let V9 = new THREE.Vector3(0.0, -C1, -C7);
  let V10 = new THREE.Vector3( C7, 0.0,  C1);
  let V11 = new THREE.Vector3( C7, 0.0, -C1);
  let V12 = new THREE.Vector3(-C7, 0.0,  C1);
  let V13 = new THREE.Vector3(-C7, 0.0, -C1);
  let V14 = new THREE.Vector3( C1,  C7, 0.0);
  let V15 = new THREE.Vector3( C1, -C7, 0.0);
  let V16 = new THREE.Vector3(-C1,  C7, 0.0);
  let V17 = new THREE.Vector3(-C1, -C7, 0.0);
  let V18 = new THREE.Vector3( C3, 0.0,  C6);
  let V19 = new THREE.Vector3( C3, 0.0, -C6);
  let V20 = new THREE.Vector3(-C3, 0.0,  C6);
  let V21 = new THREE.Vector3(-C3, 0.0, -C6);
  let V22 = new THREE.Vector3( C6,  C3, 0.0);
  let V23 = new THREE.Vector3( C6, -C3, 0.0);
  let V24 = new THREE.Vector3(-C6,  C3, 0.0);
  let V25 = new THREE.Vector3(-C6, -C3, 0.0);
  let V26 = new THREE.Vector3(0.0,  C6,  C3);
  let V27 = new THREE.Vector3(0.0,  C6, -C3);
  let V28 = new THREE.Vector3(0.0, -C6,  C3);
  let V29 = new THREE.Vector3(0.0, -C6, -C3);
  let V30 = new THREE.Vector3( C0,  C2,  C5);
  let V31 = new THREE.Vector3( C0,  C2, -C5);
  let V32 = new THREE.Vector3( C0, -C2,  C5);
  let V33 = new THREE.Vector3( C0, -C2, -C5);
  let V34 = new THREE.Vector3(-C0,  C2,  C5);
  let V35 = new THREE.Vector3(-C0,  C2, -C5);
  let V36 = new THREE.Vector3(-C0, -C2,  C5);
  let V37 = new THREE.Vector3(-C0, -C2, -C5);
  let V38 = new THREE.Vector3( C5,  C0,  C2);
  let V39 = new THREE.Vector3( C5,  C0, -C2);
  let V40 = new THREE.Vector3( C5, -C0,  C2);
  let V41 = new THREE.Vector3( C5, -C0, -C2);
  let V42 = new THREE.Vector3(-C5,  C0,  C2);
  let V43 = new THREE.Vector3(-C5,  C0, -C2);
  let V44 = new THREE.Vector3(-C5, -C0,  C2);
  let V45 = new THREE.Vector3(-C5, -C0, -C2);
  let V46 = new THREE.Vector3( C2,  C5,  C0);
  let V47 = new THREE.Vector3( C2,  C5, -C0);
  let V48 = new THREE.Vector3( C2, -C5,  C0);
  let V49 = new THREE.Vector3( C2, -C5, -C0);
  let V50 = new THREE.Vector3(-C2,  C5,  C0);
  let V51 = new THREE.Vector3(-C2,  C5, -C0);
  let V52 = new THREE.Vector3(-C2, -C5,  C0);
  let V53 = new THREE.Vector3(-C2, -C5, -C0);
  let V54 = new THREE.Vector3( C4,  C4,  C4);
  let V55 = new THREE.Vector3( C4,  C4, -C4);
  let V56 = new THREE.Vector3( C4, -C4,  C4);
  let V57 = new THREE.Vector3( C4, -C4, -C4);
  let V58 = new THREE.Vector3(-C4,  C4,  C4);
  let V59 = new THREE.Vector3(-C4,  C4, -C4);
  let V60 = new THREE.Vector3(-C4, -C4,  C4);
  let V61 = new THREE.Vector3(-C4, -C4, -C4);
  let cuts = [
    // { 18,  0,  8 }
    new THREE.Plane().setFromCoplanarPoints(V18, V0, V8),
    // { 18,  8, 32 }
    new THREE.Plane().setFromCoplanarPoints(V18, V8, V32),
    // { 18, 32, 56 }
    new THREE.Plane().setFromCoplanarPoints(V18, V32, V56),
    // { 18, 56, 40 }
    new THREE.Plane().setFromCoplanarPoints(V18, V56, V40),
    // { 18, 40, 10 }
    new THREE.Plane().setFromCoplanarPoints(V18, V40, V10),
    // { 18, 10, 38 }
    new THREE.Plane().setFromCoplanarPoints(V18, V10, V38),
    // { 18, 38, 54 }
    new THREE.Plane().setFromCoplanarPoints(V18, V38, V54),
    // { 18, 54, 30 }
    new THREE.Plane().setFromCoplanarPoints(V18, V54, V30),
    // { 18, 30,  6 }
    new THREE.Plane().setFromCoplanarPoints(V18, V30, V6),
    // { 18,  6,  0 }
    new THREE.Plane().setFromCoplanarPoints(V18, V6, V0),
    // { 19,  1,  7 }
    new THREE.Plane().setFromCoplanarPoints(V19, V1, V7),
    // { 19,  7, 31 }
    new THREE.Plane().setFromCoplanarPoints(V19, V7, V31),
    // { 19, 31, 55 }
    new THREE.Plane().setFromCoplanarPoints(V19, V31, V55),
    // { 19, 55, 39 }
    new THREE.Plane().setFromCoplanarPoints(V19, V55, V39),
    // { 19, 39, 11 }
    new THREE.Plane().setFromCoplanarPoints(V19, V39, V11),
    // { 19, 11, 41 }
    new THREE.Plane().setFromCoplanarPoints(V19, V11, V41),
    // { 19, 41, 57 }
    new THREE.Plane().setFromCoplanarPoints(V19, V41, V57),
    // { 19, 57, 33 }
    new THREE.Plane().setFromCoplanarPoints(V19, V57, V33),
    // { 19, 33,  9 }
    new THREE.Plane().setFromCoplanarPoints(V19, V33, V9),
    // { 19,  9,  1 }
    new THREE.Plane().setFromCoplanarPoints(V19, V9, V1),
    // { 20,  0,  6 }
    new THREE.Plane().setFromCoplanarPoints(V20, V0, V6),
    // { 20,  6, 34 }
    new THREE.Plane().setFromCoplanarPoints(V20, V6, V34),
    // { 20, 34, 58 }
    new THREE.Plane().setFromCoplanarPoints(V20, V34, V58),
    // { 20, 58, 42 }
    new THREE.Plane().setFromCoplanarPoints(V20, V58, V42),
    // { 20, 42, 12 }
    new THREE.Plane().setFromCoplanarPoints(V20, V42, V12),
    // { 20, 12, 44 }
    new THREE.Plane().setFromCoplanarPoints(V20, V12, V44),
    // { 20, 44, 60 }
    new THREE.Plane().setFromCoplanarPoints(V20, V44, V60),
    // { 20, 60, 36 }
    new THREE.Plane().setFromCoplanarPoints(V20, V60, V36),
    // { 20, 36,  8 }
    new THREE.Plane().setFromCoplanarPoints(V20, V36, V8),
    // { 20,  8,  0 }
    new THREE.Plane().setFromCoplanarPoints(V20, V8, V0),
    // { 21,  1,  9 }
    new THREE.Plane().setFromCoplanarPoints(V21, V1, V9),
    // { 21,  9, 37 }
    new THREE.Plane().setFromCoplanarPoints(V21, V9, V37),
    // { 21, 37, 61 }
    new THREE.Plane().setFromCoplanarPoints(V21, V37, V61),
    // { 21, 61, 45 }
    new THREE.Plane().setFromCoplanarPoints(V21, V61, V45),
    // { 21, 45, 13 }
    new THREE.Plane().setFromCoplanarPoints(V21, V45, V13),
    // { 21, 13, 43 }
    new THREE.Plane().setFromCoplanarPoints(V21, V13, V43),
    // { 21, 43, 59 }
    new THREE.Plane().setFromCoplanarPoints(V21, V43, V59),
    // { 21, 59, 35 }
    new THREE.Plane().setFromCoplanarPoints(V21, V59, V35),
    // { 21, 35,  7 }
    new THREE.Plane().setFromCoplanarPoints(V21, V35, V7),
    // { 21,  7,  1 }
    new THREE.Plane().setFromCoplanarPoints(V21, V7, V1),
    // { 22,  2, 11 }
    new THREE.Plane().setFromCoplanarPoints(V22, V2, V11),
    // { 22, 11, 39 }
    new THREE.Plane().setFromCoplanarPoints(V22, V11, V39),
    // { 22, 39, 55 }
    new THREE.Plane().setFromCoplanarPoints(V22, V39, V55),
    // { 22, 55, 47 }
    new THREE.Plane().setFromCoplanarPoints(V22, V55, V47),
    // { 22, 47, 14 }
    new THREE.Plane().setFromCoplanarPoints(V22, V47, V14),
    // { 22, 14, 46 }
    new THREE.Plane().setFromCoplanarPoints(V22, V14, V46),
    // { 22, 46, 54 }
    new THREE.Plane().setFromCoplanarPoints(V22, V46, V54),
    // { 22, 54, 38 }
    new THREE.Plane().setFromCoplanarPoints(V22, V54, V38),
    // { 22, 38, 10 }
    new THREE.Plane().setFromCoplanarPoints(V22, V38, V10),
    // { 22, 10,  2 }
    new THREE.Plane().setFromCoplanarPoints(V22, V10, V2),
    // { 23,  2, 10 }
    new THREE.Plane().setFromCoplanarPoints(V23, V2, V10),
    // { 23, 10, 40 }
    new THREE.Plane().setFromCoplanarPoints(V23, V10, V40),
    // { 23, 40, 56 }
    new THREE.Plane().setFromCoplanarPoints(V23, V40, V56),
    // { 23, 56, 48 }
    new THREE.Plane().setFromCoplanarPoints(V23, V56, V48),
    // { 23, 48, 15 }
    new THREE.Plane().setFromCoplanarPoints(V23, V48, V15),
    // { 23, 15, 49 }
    new THREE.Plane().setFromCoplanarPoints(V23, V15, V49),
    // { 23, 49, 57 }
    new THREE.Plane().setFromCoplanarPoints(V23, V49, V57),
    // { 23, 57, 41 }
    new THREE.Plane().setFromCoplanarPoints(V23, V57, V41),
    // { 23, 41, 11 }
    new THREE.Plane().setFromCoplanarPoints(V23, V41, V11),
    // { 23, 11,  2 }
    new THREE.Plane().setFromCoplanarPoints(V23, V11, V2),
    // { 24,  3, 12 }
    new THREE.Plane().setFromCoplanarPoints(V24, V3, V12),
    // { 24, 12, 42 }
    new THREE.Plane().setFromCoplanarPoints(V24, V12, V42),
    // { 24, 42, 58 }
    new THREE.Plane().setFromCoplanarPoints(V24, V42, V58),
    // { 24, 58, 50 }
    new THREE.Plane().setFromCoplanarPoints(V24, V58, V50),
    // { 24, 50, 16 }
    new THREE.Plane().setFromCoplanarPoints(V24, V50, V16),
    // { 24, 16, 51 }
    new THREE.Plane().setFromCoplanarPoints(V24, V16, V51),
    // { 24, 51, 59 }
    new THREE.Plane().setFromCoplanarPoints(V24, V51, V59),
    // { 24, 59, 43 }
    new THREE.Plane().setFromCoplanarPoints(V24, V59, V43),
    // { 24, 43, 13 }
    new THREE.Plane().setFromCoplanarPoints(V24, V43, V13),
    // { 24, 13,  3 }
    new THREE.Plane().setFromCoplanarPoints(V24, V13, V3),
    // { 25,  3, 13 }
    new THREE.Plane().setFromCoplanarPoints(V25, V3, V13),
    // { 25, 13, 45 }
    new THREE.Plane().setFromCoplanarPoints(V25, V13, V45),
    // { 25, 45, 61 }
    new THREE.Plane().setFromCoplanarPoints(V25, V45, V61),
    // { 25, 61, 53 }
    new THREE.Plane().setFromCoplanarPoints(V25, V61, V53),
    // { 25, 53, 17 }
    new THREE.Plane().setFromCoplanarPoints(V25, V53, V17),
    // { 25, 17, 52 }
    new THREE.Plane().setFromCoplanarPoints(V25, V17, V52),
    // { 25, 52, 60 }
    new THREE.Plane().setFromCoplanarPoints(V25, V52, V60),
    // { 25, 60, 44 }
    new THREE.Plane().setFromCoplanarPoints(V25, V60, V44),
    // { 25, 44, 12 }
    new THREE.Plane().setFromCoplanarPoints(V25, V44, V12),
    // { 25, 12,  3 }
    new THREE.Plane().setFromCoplanarPoints(V25, V12, V3),
    // { 26,  4, 16 }
    new THREE.Plane().setFromCoplanarPoints(V26, V4, V16),
    // { 26, 16, 50 }
    new THREE.Plane().setFromCoplanarPoints(V26, V16, V50),
    // { 26, 50, 58 }
    new THREE.Plane().setFromCoplanarPoints(V26, V50, V58),
    // { 26, 58, 34 }
    new THREE.Plane().setFromCoplanarPoints(V26, V58, V34),
    // { 26, 34,  6 }
    new THREE.Plane().setFromCoplanarPoints(V26, V34, V6),
    // { 26,  6, 30 }
    new THREE.Plane().setFromCoplanarPoints(V26, V6, V30),
    // { 26, 30, 54 }
    new THREE.Plane().setFromCoplanarPoints(V26, V30, V54),
    // { 26, 54, 46 }
    new THREE.Plane().setFromCoplanarPoints(V26, V54, V46),
    // { 26, 46, 14 }
    new THREE.Plane().setFromCoplanarPoints(V26, V46, V14),
    // { 26, 14,  4 }
    new THREE.Plane().setFromCoplanarPoints(V26, V14, V4),
    // { 27,  4, 14 }
    new THREE.Plane().setFromCoplanarPoints(V27, V4, V14),
    // { 27, 14, 47 }
    new THREE.Plane().setFromCoplanarPoints(V27, V14, V47),
    // { 27, 47, 55 }
    new THREE.Plane().setFromCoplanarPoints(V27, V47, V55),
    // { 27, 55, 31 }
    new THREE.Plane().setFromCoplanarPoints(V27, V55, V31),
    // { 27, 31,  7 }
    new THREE.Plane().setFromCoplanarPoints(V27, V31, V7),
    // { 27,  7, 35 }
    new THREE.Plane().setFromCoplanarPoints(V27, V7, V35),
    // { 27, 35, 59 }
    new THREE.Plane().setFromCoplanarPoints(V27, V35, V59),
    // { 27, 59, 51 }
    new THREE.Plane().setFromCoplanarPoints(V27, V59, V51),
    // { 27, 51, 16 }
    new THREE.Plane().setFromCoplanarPoints(V27, V51, V16),
    // { 27, 16,  4 }
    new THREE.Plane().setFromCoplanarPoints(V27, V16, V4),
    // { 28,  5, 15 }
    new THREE.Plane().setFromCoplanarPoints(V28, V5, V15),
    // { 28, 15, 48 }
    new THREE.Plane().setFromCoplanarPoints(V28, V15, V48),
    // { 28, 48, 56 }
    new THREE.Plane().setFromCoplanarPoints(V28, V48, V56),
    // { 28, 56, 32 }
    new THREE.Plane().setFromCoplanarPoints(V28, V56, V32),
    // { 28, 32,  8 }
    new THREE.Plane().setFromCoplanarPoints(V28, V32, V8),
    // { 28,  8, 36 }
    new THREE.Plane().setFromCoplanarPoints(V28, V8, V36),
    // { 28, 36, 60 }
    new THREE.Plane().setFromCoplanarPoints(V28, V36, V60),
    // { 28, 60, 52 }
    new THREE.Plane().setFromCoplanarPoints(V28, V60, V52),
    // { 28, 52, 17 }
    new THREE.Plane().setFromCoplanarPoints(V28, V52, V17),
    // { 28, 17,  5 }
    new THREE.Plane().setFromCoplanarPoints(V28, V17, V5),
    // { 29,  5, 17 }
    new THREE.Plane().setFromCoplanarPoints(V29, V5, V17),
    // { 29, 17, 53 }
    new THREE.Plane().setFromCoplanarPoints(V29, V17, V53),
    // { 29, 53, 61 }
    new THREE.Plane().setFromCoplanarPoints(V29, V53, V61),
    // { 29, 61, 37 }
    new THREE.Plane().setFromCoplanarPoints(V29, V61, V37),
    // { 29, 37,  9 }
    new THREE.Plane().setFromCoplanarPoints(V29, V37, V9),
    // { 29,  9, 33 }
    new THREE.Plane().setFromCoplanarPoints(V29, V9, V33),
    // { 29, 33, 57 }
    new THREE.Plane().setFromCoplanarPoints(V29, V33, V57),
    // { 29, 57, 49 }
    new THREE.Plane().setFromCoplanarPoints(V29, V57, V49),
    // { 29, 49, 15 }
    new THREE.Plane().setFromCoplanarPoints(V29, V49, V15),
    // { 29, 15,  5 }
    new THREE.Plane().setFromCoplanarPoints(V29, V15, V5),
  ];
  cuts.forEach(function (p: THREE.Plane) { p.constant = -d; });
  return cuts;
}

