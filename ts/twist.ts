// bug: trivial corners don't turn

import * as THREE from 'three';
import { TrackballControls } from './TrackballControls.js';
import { make_shell, make_cuts, tetrahedron, cube, octahedron, dodecahedron, rhombic_dodecahedron, icosahedron, rhombic_triacontahedron } from './make.js';
import { Cut, find_cuts, find_stops, make_move } from './move.js';
import { PolyGeometry, triangulate_polygeometry } from './piece.js';
import { floathash } from './util.js';

// Set up

const canvas = document.querySelector('#c') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(400, 400);

var scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    15,  // field of view in vertical dimension, in degrees
    1,   // aspect ratio
    0.1, // don't render objects closer than this
    100  // don't render objects further than this
);
camera.position.z = 12;
scene.add(camera);

var controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 5.0;
controls.noPan = true;
controls.noZoom = true;
controls.addEventListener('change', render);

const dlight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
dlight.position.set(0, 2, -camera.position.z);
camera.add(dlight);

const alight = new THREE.AmbientLight(0xFFFFFF, 1.5);
scene.add(alight);

var arrow_geometry = function () {
    var arrow_shape = new THREE.Shape();
    const arrow_width = 0.75, arrow_head_width = 1.5, arrow_head_length = 0.75;
    const arrow_head_angle = -45*Math.PI/180 + arrow_head_length/2;
    const arrow_tip_angle = -45*Math.PI/180 - arrow_head_length/2;
    function lineto_polar(shape: THREE.Shape, r: number, theta: number) {
        shape.lineTo(r * Math.cos(theta), r * Math.sin(theta));
    }
    arrow_shape.absarc(0, 0, 1+arrow_width/2, 225*Math.PI/180, arrow_head_angle, true);
    lineto_polar(arrow_shape, 1+arrow_head_width/2, arrow_head_angle);
    lineto_polar(arrow_shape, 1, arrow_tip_angle);
    lineto_polar(arrow_shape, 1-arrow_head_width/2, arrow_head_angle);
    arrow_shape.absarc(0, 0, 1-arrow_width/2, arrow_head_angle, 225*Math.PI/180, false);
    //return new THREE.ShapeGeometry(arrow_shape);
    return new THREE.ExtrudeGeometry(arrow_shape, {depth: 0.2, bevelEnabled: false});
} ();

/* Build puzzle */

var puzzle = [make_shell(cube(1/Math.sqrt(3)))];

// to do: make make_cuts destructive

//puzzle = cut_tetrahedron(0, puzzle); // same as cut_octahedron(0)
//puzzle = cut_tetrahedron(-5/9, puzzle); // tetra: Pyraminx tips. bug: they don't turn
//puzzle = cut_tetrahedron(-1/9, puzzle); // tetra: Pyraminx
//puzzle = make_cuts(cube(0), puzzle); // tetra: Pyramorphix; cube: 2x2x2; octa: PyraDiamond
//puzzle = cut_cube(Math.sqrt(3)/9, puzzle); // tetra: Mastermorphynx
puzzle = make_cuts(cube(1/Math.sqrt(3)/3), puzzle); // cube: 3x3x3
//const n=10; for (let i=0; i<Math.floor(n/2); i++) puzzle = make_cuts(cube(i/n), puzzle);
//puzzle = cut_rhombic_dodecahedron(0, puzzle); // Little Chop
//puzzle = cut_rhombic_dodecahedron(Math.sqrt(2)/4, puzzle); // Helicopter Cube
//puzzle = cut_octahedron(Math.sqrt(3)/6, puzzle); // cube: Dino Cube; octa: Dino-Octa
//puzzle = cut_octahedron(Math.sqrt(3)/9, puzzle); // octa: face-turning octahedron
//puzzle = make_cuts(octahedron(0), puzzle); // tetra: Halpern-Maier; cube: Skewb; octa: Skewb Diamond

//puzzle = cut_dodecahedron((2*Math.sqrt(6)+Math.sqrt(30)) / (3*Math.sqrt(11*Math.sqrt(5)+25)), puzzle); // dodeca: Megaminx
//puzzle = cut_dodecahedron(0.36, puzzle); // dodeca: Pyraminx Crystal
//puzzle = cut_dodecahedron(0.19, puzzle); // dodeca: star on each face
//puzzle = cut_dodecahedron(0.447, puzzle); // icosa: Impossiball with wrong colors
//puzzle = cut_dodecahedron(0, puzzle); // dodeca: Penultimate; icosa: ?

const face_material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    flatShading: true,
    // https://stackoverflow.com/questions/31539130/display-wireframe-and-solid-color/31541369#31541369
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
    
const edge_material = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});
//const wire_material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 1});

function draw_puzzle(newpuzzle: PolyGeometry[], scene: THREE.Scene) {
    for (let piece of puzzle) // or should there be a separate erase_puzzle()?
        if (piece.object)
            scene.remove(piece.object);
    for (let piece of newpuzzle) {
        piece.rot = new THREE.Quaternion();
        piece.object = new THREE.Object3D();
        let g = triangulate_polygeometry(piece);
        piece.object.add(new THREE.Mesh(g, face_material));
        piece.object.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edge_material));
        //piece.object.add(new THREE.LineSegments(new THREE.WireframeGeometry(g), wire_material));
        scene.add(piece.object);
    }
    draw_arrows(newpuzzle);
    puzzle = newpuzzle;
}

function move_random(callback: () => void) {
    let cuts = find_cuts(puzzle);
    if (cuts.length == 0) {
        console.log("This shouldn't happen!");
        return;
    }
    let cut = cuts[Math.floor(Math.random()*cuts.length)];
    let move_pieces;
    if (Math.floor(Math.random()*2))
        move_pieces = cut.front();
    else
        move_pieces = cut.back();
    let angles = find_stops(puzzle, cut);
    if (angles.length == 0 || angles.length == 1 && angles[0] == 0)
        return callback();
    let zi = angles.findIndex(s => floathash(s) == 0);
    zi += Math.floor(Math.random()*2)*2-1;
    zi = (zi+angles.length) % angles.length;
    let angle = angles[zi];
    begin_move(cut, angle, callback);
}

// Controls

var cuts: Cut[] = [];
var raycaster = new THREE.Raycaster();
var mouse: {x: number, y: number} | null = null;
var rect = renderer.domElement.getBoundingClientRect(); // to do: update if resize

var arrows: THREE.Mesh[] = [];
var mouseover_arrow: THREE.Mesh | null = null;
const arrow_material = new THREE.MeshPhongMaterial({
    transparent: true, opacity: 0.3, side: THREE.DoubleSide});
const mouseover_arrow_material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xFFFFCC),
    transparent: true, opacity: 0.9, side: THREE.DoubleSide});

window.addEventListener('click', onclick);
window.addEventListener('mousemove', onmousemove);

draw_puzzle(puzzle, scene);

function reverse_cut(cut: Cut) {
    return {
        plane: cut.plane.clone().negate(),
        back: cut.front,
        front: cut.back
    };
}

function draw_arrow(cut: Cut) {
    let arrow = new THREE.Mesh(arrow_geometry, arrow_material);
    arrow.scale.multiplyScalar(0.2);
    var rot = new THREE.Quaternion();
    rot.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cut.plane.normal);
    arrow.position.z = 1.1 - cut.plane.constant; // to do: better positioning
    arrow.position.applyQuaternion(rot);
    arrow.quaternion.copy(rot);
    scene.add(arrow);
    arrows.push(arrow);
}

// to do: double side arrow?
function draw_arrows(puzzle: PolyGeometry[]) {
    for (let arrow of arrows)
        scene.remove(arrow);
    mouseover_arrow = null;
    arrows = [];
    cuts = find_cuts(puzzle);
    let n = cuts.length;
    // to do: not very elegant; maybe find_cuts should just return them like this
    for (let i=0; i<n; i++) {
        if (floathash(cuts[i].plane.constant) > 0)
            cuts[i] = reverse_cut(cuts[i]);
        draw_arrow(cuts[i]);
    }
    for (let i=0; i<n; i++) {
        if (floathash(cuts[i].plane.constant) == 0) {
            cuts.push(reverse_cut(cuts[i]));
            draw_arrow(cuts[cuts.length-1]);
        }
    }
    render(); // needed to figure out which one to highlight (not sure why)
    highlight_arrow(puzzle, mouse);
}

function highlight_arrow(puzzle: PolyGeometry[], mouse: {x: number, y: number} | null) {
    if (mouse === null)
        return;
    if (mouseover_arrow !== null)
        mouseover_arrow.material = arrow_material;
    raycaster.setFromCamera(mouse!, camera);
    let intersects = raycaster.intersectObjects(arrows);
    if (intersects.length > 0) {
        mouseover_arrow = intersects[0].object as THREE.Mesh;
        mouseover_arrow.material = mouseover_arrow_material;
    } else {
        mouseover_arrow = null;
    }
}

function onmousemove(event: MouseEvent) {
    if (event.target !== renderer.domElement) return;
    if (mouse === null) mouse = {x: 0, y: 0};
    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    highlight_arrow(puzzle, mouse);
}

function onclick(event: MouseEvent) {
    if (event.target !== renderer.domElement) return;
    onmousemove(event);
    if (mouseover_arrow !== null) {
        let i = arrows.indexOf(mouseover_arrow);
        let angles = find_stops(puzzle, cuts[i]);
        if (angles.length == 0 || angles.length == 1 && angles[0] == 0)
            return;
        let zi = angles.findIndex(s => floathash(s) == 0);
        zi = (zi-1+angles.length) % angles.length;
        let angle = angles[zi];
        begin_move(cuts[i], angle);
    }
}

// Register callbacks for controls

document.getElementById('new_cut')!.addEventListener('click', function (e) {
    let cut_menu = document.getElementById("cuts")!;
    let cut_item = cut_menu.firstChild!.cloneNode(true) as HTMLElement;
    cut_item.style.display="list-item";
    let button = cut_item.getElementsByTagName("button")[0];
    button.addEventListener('click', function () {
        cut_menu.removeChild(cut_item);
    });
    cut_menu.appendChild(cut_item);
});

document.getElementById('apply_cuts')!.addEventListener('click', function (e) {
    let shell_menu = document.getElementById("shell_shape")! as HTMLSelectElement;
    let shell_shape = shell_menu.options[shell_menu.selectedIndex].value;

    let shell: THREE.Plane[] = [];
    let inradius, circumradius;
    switch(shell_shape) {
    case "T": shell = tetrahedron(1/3); break;
    case "C": shell = cube(1/Math.sqrt(3)); break;
    case "O": shell = octahedron(1/Math.sqrt(3)); break;
    case "D":
        inradius = 1/20*Math.sqrt(250+110*Math.sqrt(5));
        circumradius = 1/4*(Math.sqrt(15)+Math.sqrt(3));
        shell = dodecahedron(inradius/circumradius);
        break;
    case "I":
        inradius = 1/12*(3*Math.sqrt(3) + Math.sqrt(15));
        circumradius = 1/4*Math.sqrt(10+2*Math.sqrt(5));
        shell = icosahedron(inradius/circumradius);
        break;
    }
    let newpuzzle = [make_shell(shell)];

    let cut_menu = document.getElementById("cuts")!;
    cut_menu.childNodes.forEach(function (li) {
        // skip first item, which is a dummy item
        if (li === cut_menu.firstChild) return;
        let shape = "", distance = 0;
        li.childNodes.forEach(function (e) {
            let he = e as HTMLSelectElement;
            if (he.className == "cut_shape")
                shape = he.options[he.selectedIndex].value;
            else if (he.className == "cut_distance")
                distance = parseFloat(he.value);
        });
        switch(shape) {
            // to do: dual tetrahedron, or make slider go negative? or is octa good enough?
        case "T": newpuzzle = make_cuts(tetrahedron(distance), newpuzzle); break;
        case "C": newpuzzle = make_cuts(cube(distance), newpuzzle); break;
        case "O": newpuzzle = make_cuts(octahedron(distance), newpuzzle); break;
        case "D": newpuzzle = make_cuts(dodecahedron(distance), newpuzzle); break;
        case "jC": newpuzzle = make_cuts(rhombic_dodecahedron(distance), newpuzzle); break;
        case "I": newpuzzle = make_cuts(icosahedron(distance), newpuzzle); break;
        case "jD": newpuzzle = make_cuts(rhombic_triacontahedron(distance), newpuzzle); break;
        }
    });
    draw_puzzle(newpuzzle, scene);
});

function scramble(n: number) {
    if (n > 0)
        move_random(() => scramble(n-1));
}
document.getElementById('scramble')!.addEventListener('click', function (e) {
    scramble(20);
});

// Animation

type Move = {
    cut: Cut,
    start_time: number | null, time: number,
    callback?: () => void,
    pieces: number[],
    from_quat: THREE.Quaternion[], step_quat: THREE.Quaternion[], angle: number } | null;

const rad_per_sec = 2*Math.PI;

var cur_move: Move = null;
function begin_move(cut: Cut, angle: number, callback?: () => void) {
    let rot = new THREE.Quaternion();
    rot.setFromAxisAngle(cut.plane.normal, 1); // rotate 1 radian to avoid problems with exactly 180 degree rotations

    if (cur_move !== null)
        end_move();
    cur_move = {
        cut: cut,
        start_time: null,
        time: Math.abs(angle)/rad_per_sec*1000,
        callback: callback,
        pieces: cut.front(),
        from_quat: [],
        step_quat: [],
        angle: angle
    };
    for (let i of cur_move!.pieces) {
        cur_move.from_quat.push(puzzle[i].object!.quaternion.clone());
        cur_move.step_quat.push(rot.clone().multiply(puzzle[i].object!.quaternion));
    }
    make_move(puzzle, cut, angle);
}

function end_move() {
    let callback = cur_move!.callback;
    // Snap to final angle
    for (let p of cur_move!.pieces)
        puzzle[p].object!.quaternion.copy(puzzle[p].rot);
    cur_move = null;
    draw_arrows(puzzle);
    if (callback !== undefined) callback();
}

function render() {
    renderer.render(scene, camera);
}

function animate(t: number) {
    if (cur_move !== null) {
        if (cur_move.start_time === null)
            cur_move.start_time = t;
    
        let ti = (t-cur_move.start_time!)/cur_move.time;
        if (ti > 1) {
            end_move();
        } else
            for (let i=0; i<cur_move.pieces.length; i++)
                THREE.Quaternion.slerp(cur_move.from_quat[i],
                                       cur_move.step_quat[i],
                                       puzzle[cur_move.pieces[i]].object!.quaternion,
                                       ti*cur_move.angle);
                                   
    }
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
