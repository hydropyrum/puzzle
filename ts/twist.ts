// bug: trivial corners don't turn
// bug: arrow position

import * as THREE from 'three';
import { TrackballControls } from './TrackballControls.js';
import { make_shell, make_cuts, tetrahedron, cube, octahedron, dodecahedron, rhombic_dodecahedron, icosahedron, rhombic_triacontahedron } from './make.js';
import { Cut, find_cuts, find_stops, make_move } from './move.js';
import { PolyGeometry, triangulate_polygeometry } from './piece.js';
import { floathash, pointhash, setdefault } from './util.js';
import * as parse from './parse.js';

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
    const arrow_tail_angle = 90*Math.PI/180;
    const arrow_head_angle = -45*Math.PI/180 + arrow_head_length/2;
    const arrow_tip_angle = -45*Math.PI/180 - arrow_head_length/2;
    function lineto_polar(shape: THREE.Shape, r: number, theta: number) {
        shape.lineTo(r * Math.cos(theta), r * Math.sin(theta));
    }
    arrow_shape.absarc(0, 0, 1+arrow_width/2, arrow_tail_angle, arrow_head_angle, true);
    lineto_polar(arrow_shape, 1+arrow_head_width/2, arrow_head_angle);
    lineto_polar(arrow_shape, 1, arrow_tip_angle);
    lineto_polar(arrow_shape, 1-arrow_head_width/2, arrow_head_angle);
    arrow_shape.absarc(0, 0, 1-arrow_width/2, arrow_head_angle, arrow_tail_angle, false);
    return new THREE.ExtrudeGeometry(arrow_shape, {depth: 0.2, bevelEnabled: false});
} ();

/* Build puzzle */

var puzzle: PolyGeometry[] = [];

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

function draw_puzzle(newpuzzle: PolyGeometry[], scene: THREE.Scene, scale: number) {
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
        piece.object.scale.multiplyScalar(scale);
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

// Canvas controls

var cuts: Cut[] = [];
var raycaster = new THREE.Raycaster();
var mouse: {x: number, y: number} | null = null;

var arrows: THREE.Mesh[] = [];
var mouseover_arrow: THREE.Mesh | null = null;
const arrow_material = new THREE.MeshPhongMaterial({
    transparent: true, opacity: 0.3, side: THREE.DoubleSide});
const mouseover_arrow_material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xFFFFCC),
    transparent: true, opacity: 0.9, side: THREE.DoubleSide});

draw_puzzle(puzzle, scene, 1);

function draw_arrow(cut: Cut, d: number) {
    let arrow = new THREE.Mesh(arrow_geometry, arrow_material);
    arrow.scale.multiplyScalar(0.2);
    var rot = new THREE.Quaternion();
    rot.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cut.plane.normal);
    arrow.position.z = 1.25 + 0.25*d;
    arrow.position.applyQuaternion(rot);
    arrow.quaternion.copy(rot);
    scene.add(arrow);
    arrows.push(arrow);
    arrow = arrow.clone();
    arrow.scale.x *= -1;
    scene.add(arrow);
    arrows.push(arrow);
}

function reverse_cut(cut: Cut) {
    return {
        plane: cut.plane.clone().negate(),
        back: cut.front,
        front: cut.back
    };
}

function draw_arrows(puzzle: PolyGeometry[]) {
    for (let arrow of arrows)
        scene.remove(arrow);
    mouseover_arrow = null;
    arrows = [];
    cuts = find_cuts(puzzle);
    let n = cuts.length;
    // make normals point away from origin; deep cuts go both ways
    for (let i=0; i<n; i++) {
        if (floathash(cuts[i].plane.constant) > 0)
            cuts[i] = reverse_cut(cuts[i]);
        else if (floathash(cuts[i].plane.constant) == 0)
            cuts.push(reverse_cut(cuts[i]));
    }
    cuts.sort((a, b) => b.plane.constant - a.plane.constant);
    let count: {[key: string]: number} = {};
    for (let cut of cuts) {
        let h = pointhash(cut.plane.normal);
        setdefault(count, h, 0);
        draw_arrow(cut, count[h]);
        count[h] += 1;
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
    let rect = renderer.domElement.getBoundingClientRect();
    if (event.buttons != 0) return; // prevent highlighting/clicking while dragging
    if (mouse === null) mouse = {x: 0, y: 0};
    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    highlight_arrow(puzzle, mouse);
}
canvas.addEventListener('mousemove', onmousemove);

canvas.addEventListener('click', function (event: MouseEvent) {
    if (mouseover_arrow !== null) {
        let i_before = arrows.indexOf(mouseover_arrow);
        onmousemove(event);
        if (mouseover_arrow !== null) {
            let i = arrows.indexOf(mouseover_arrow);
            if (i == i_before) {
                let ci = Math.floor(i/2);
                let dir = i%2;
                let angles = find_stops(puzzle, cuts[ci]);
                if (angles.length == 0 || angles.length == 1 && angles[0] == 0)
                    return;
                let zi = angles.findIndex(s => floathash(s) == 0);
                if (dir == 0)
                    zi = (zi-1+angles.length) % angles.length;
                else
                    zi = (zi+1) % angles.length;
                let angle = angles[zi];
                // Ensure that 180-degree turns are in the right direction
                while (dir == 0 && angle > 0) angle -= 2*Math.PI;
                while (dir == 1 && angle < 0) angle += 2*Math.PI;
                begin_move(cuts[ci], angle);
            }
        }
    }
});

/* Process URL and initialize HTML controls */

function new_cut() {
    let cut_menu = document.getElementById("cuts")!;
    let cut_item = cut_menu.firstChild!.cloneNode(true) as HTMLElement;
    cut_item.style.display="block";
    let button = cut_item.getElementsByClassName("delete_cut")[0];
    button.addEventListener('click', function () {
        cut_menu.removeChild(cut_item);
    });
    cut_menu.appendChild(cut_item);
    return cut_item;
}

document.getElementById('new_cut')!.addEventListener('click', e => new_cut());

function apply_cuts() {
    let shell_menu = document.getElementById("shell_menu")! as HTMLSelectElement;
    let shell_shape = shell_menu.options[shell_menu.selectedIndex].value;
    let d = parseFloat((document.getElementById("shell_distance")! as HTMLInputElement).value);

    let planes: THREE.Plane[] = [];
    let inradius, circumradius;
    switch(shell_shape) {
    case "T": planes = tetrahedron(d); break;
    case "C": planes = cube(d); break;
    case "O": planes = octahedron(d); break;
    case "D": planes = dodecahedron(d); break;
    case "I": planes = icosahedron(d); break;
    }
    let shell = make_shell(planes);

    // Find circumradius, which we will scale to 1
    let r = 0;
    for (let v of shell.vertices)
        if (v.length() > r) r = v.length();

    let newpuzzle = [shell];
    let cut_menu = document.getElementById("cuts")!;
    for (let ce of Array.from(cut_menu.children)) {
        // skip first item, which is a dummy item
        if (ce === cut_menu.firstChild) continue;
        let shape = "", distance = 0;
        let se = ce.getElementsByClassName('cut_shape')[0] as HTMLSelectElement;
        shape = se.options[se.selectedIndex].value;
        let de = ce.getElementsByClassName('cut_distance')[0] as HTMLInputElement;
        distance = parseFloat(de.value);
        if (isNaN(distance)) continue;
        switch(shape) {
        case "T": newpuzzle = make_cuts(tetrahedron(distance), newpuzzle); break;
        case "C": newpuzzle = make_cuts(cube(distance), newpuzzle); break;
        case "O": newpuzzle = make_cuts(octahedron(distance), newpuzzle); break;
        case "D": newpuzzle = make_cuts(dodecahedron(distance), newpuzzle); break;
        case "jC": newpuzzle = make_cuts(rhombic_dodecahedron(distance), newpuzzle); break;
        case "I": newpuzzle = make_cuts(icosahedron(distance), newpuzzle); break;
        case "jD": newpuzzle = make_cuts(rhombic_triacontahedron(distance), newpuzzle); break;
        }
    }
    draw_puzzle(newpuzzle, scene, 1/r);
}
document.getElementById('apply_cuts')!.addEventListener('click', e => apply_cuts());

function scramble(n: number) {
    if (n > 0)
        move_random(() => scramble(n-1));
}
document.getElementById('scramble')!.addEventListener('click', function (e) {
    scramble(20);
});

function select_option(select: HTMLSelectElement, value: string) {
    for (let i=0; i<select.options.length; i++)
        if (select.options[i].value == value) {
            select.selectedIndex = i;
            return;
        }
}

/*
  Shells have circumradius 0.5, while cut distances are inradii.
 */

var presets_grouped = [
    {
        label: "Face-turning octahedra",
        options: [
            { label: "Skewb Diamond",
              shell: "O",
              cuts: [{shape: "O", distance: 0}] },
            { label: "Face-turning octahedron",
              shell: "O",
              cuts: [{shape: "O", distance: Math.sqrt(3)/9}] },
        ],
    },
    {
        label: "Corner-turning octahedra",
        options: [
            { label: "PyraDiamond (wrong colors)",
              shell: "O",
              cuts: [{shape: "C", distance: 0}] },
        ],
    },
    {
        label: "Edge-turning octahedra",
        options: [
            { label: "24-Octahedron",
              shell: "O",
              cuts: [{shape: "jC", distance: 0}] },
        ],
    },
    {
        label: "Face-turning dodecahedra",
        options: [
            { label: "Pentultimate",
              shell: "D",
              cuts: [{shape: "D", distance: 0}] },
            { label: "Starminx I",
              shell: "D",
              cuts: [{shape: "D", distance: 0.19 }] }, // to do: exact
            { label: "Pyraminx Crystal",
              shell: "D",
              cuts: [{shape: "D", distance: 0.36 }] }, // to do: exact
            { label: "Megaminx",
              shell: "D",
              cuts: [{shape: "D", distance: (2*Math.sqrt(6)+Math.sqrt(30)) / (3*Math.sqrt(11*Math.sqrt(5)+25))}] },
        ],
    },
    {
        label: "Corner-turning dodecahedra",
        options: [
            { label: "Chopasaurus",
              shell: "D",
              cuts: [{shape: "I", distance: 0}] },
        ],
    },
    {
        label: "Edge-turning dodecahedra",
        options: [
            { label: "Big Chop",
              shell: "D",
              cuts: [{shape: "jD", distance: 0}] },
        ],
    },
    {
        label: "Face-turning icosahedra",
        options: [
            { label: "Radio Chop (Radiolarian 15)",
              shell: "I",
              cuts: [{shape: "I", distance: 0}] },
        ],
    },
    {
        label: "Corner-turning icosahedra",
        options: [
            { label: "Icosamate",
              shell: "I",
              cuts: [{shape: "D", distance: 0 }] },
            { label: "Impossiball (wrong colors)",
              shell: "I",
              cuts: [{shape: "D", distance: 0.447 }] }, // to do: exact
        ]
    },
    {
        label: "Edge-turning icosahedra",
        options: [
            { label: "Deep-cut edge-turning icosahedron",
              shell: "I",
              cuts: [{shape: "jD", distance: 0}] },
        ],
    },

];

const query = parse.parseQuery(window.location.search);
// to do: multiple shell
// to do: shell planes
select_option(document.getElementById("shell_menu")! as HTMLSelectElement,
              (query.shell[0] as parse.Polyhedron).name);
(document.getElementById("shell_distance")! as HTMLInputElement).value = query.shell[0].d.toString();
const cuts_menu = document.getElementById("cuts")!;
while (cuts_menu.childNodes.length > 1)
    cuts_menu.removeChild(cuts_menu.lastChild!);
for (let cut of query.cuts) {
    let ce = new_cut();
    let se = ce.getElementsByClassName('cut_shape')[0] as HTMLSelectElement;
    select_option(se, (cut as parse.Polyhedron).name);
    let de = ce.getElementsByClassName('cut_distance')[0] as HTMLInputElement;
    de.value = cut.d.toString();
}
apply_cuts();

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
