import * as THREE from 'three';
import { TrackballControls } from './TrackballControls.js';
import { make_shell, make_cuts, tetrahedron, cube, octahedron, dodecahedron, rhombic_dodecahedron, icosahedron, rhombic_triacontahedron } from './make.js';
import { Cut, find_cuts, find_stops, make_move } from './move.js';
import { PolyGeometry, triangulate_polygeometry } from './piece.js';
import { floathash, pointhash, setdefault } from './util.js';
import * as parse from './parse.js';

// Set up

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

var render_requested = true;

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
controls.rotateSpeed = 3.0;
controls.noPan = true;
controls.noZoom = true;
controls.addEventListener('change', () => { render_requested = true; });

/*const dlight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
dlight.position.set(0, 2, -camera.position.z);
camera.add(dlight);*/

const alight = new THREE.AmbientLight(0xFFFFFF, 1.5);
scene.add(alight);

/* Build puzzle */

var puzzle: PolyGeometry[] = [];

//const face_material = new THREE.MeshStandardMaterial({
const face_material = new THREE.MeshLambertMaterial({
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
    for (let piece of puzzle)
        if (piece.object)
            scene.remove(piece.object);
    for (let piece of newpuzzle) {
        piece.rot = new THREE.Quaternion();
        piece.object = new THREE.Object3D();
        let g = new THREE.BufferGeometry().fromGeometry(triangulate_polygeometry(piece));
        piece.object.add(new THREE.Mesh(g, face_material));
        piece.object.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edge_material));
        //piece.object.add(new THREE.LineSegments(new THREE.WireframeGeometry(g), wire_material));
        piece.object.scale.multiplyScalar(scale);
        scene.add(piece.object);
    }
    puzzle = newpuzzle;
    draw_arrows();
    render_requested = true;
}

// Canvas controls

var cuts: Cut[] = [];
var raycaster = new THREE.Raycaster();
var mouse: {x: number, y: number} | null = null;

var arrows: THREE.Mesh[] = [];
var mouseover_arrow: THREE.Mesh | null = null;
var click_arrow: THREE.Mesh | null = null;

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
    return new THREE.ExtrudeBufferGeometry(arrow_shape, {depth: 0.2, bevelEnabled: false});
}();

const arrow_material = new THREE.MeshLambertMaterial({
    transparent: true, opacity: 0.3, side: THREE.DoubleSide});
const mouseover_arrow_material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0xFFFFCC),
    transparent: true, opacity: 0.9, side: THREE.DoubleSide});

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

function draw_arrows() {
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
        // bug: if cuts are close, arrows can collide
        let h = pointhash(cut.plane.normal);
        setdefault(count, h, 0);
        draw_arrow(cut, count[h]);
        count[h] += 1;
    }
    // update matrices for raycaster
    for (let arrow of arrows)
        arrow.updateMatrixWorld(true);
    highlight_arrow();
    render_requested = true;
}

function highlight_arrow() {
    let new_arrow: THREE.Mesh|null = null;
    if (mouse !== null) {
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(arrows);
        if (intersects.length > 0)
            new_arrow = intersects[0].object as THREE.Mesh;
    }
    if (new_arrow !== mouseover_arrow) {
        if (mouseover_arrow !== null) {
            mouseover_arrow.material = arrow_material;
        }
        if (new_arrow !== null)
            new_arrow.material = mouseover_arrow_material;
        mouseover_arrow = new_arrow;
        render_requested = true;
    }
}

function set_mouse(x: number, y: number) {
    let rect = renderer.domElement.getBoundingClientRect();
    if (mouse === null) mouse = {x: 0, y: 0};
    mouse.x = (x - rect.left) / rect.width * 2 - 1;
    mouse.y = -(y - rect.top) / rect.height * 2 + 1;
}

canvas.addEventListener('mousemove', function (event: MouseEvent) {
    event.preventDefault();
    // do propagate because TrackballControl's mousemove is on document
    set_mouse(event.clientX, event.clientY);
    highlight_arrow();
}, false);
function ontouchmove(event: TouchEvent) {
    if (event.touches.length != 1) return;
    event.preventDefault();
    event.stopPropagation();
    set_mouse(event.touches[0].clientX, event.touches[0].clientY);
}
canvas.addEventListener('touchmove', ontouchmove, false);

canvas.addEventListener('mousedown', function (event: Event) {
    event.preventDefault();
    event.stopPropagation();
    click_arrow = mouseover_arrow;
}, false);
canvas.addEventListener('touchstart', function (event: TouchEvent) {
    ontouchmove(event);
    highlight_arrow();
    click_arrow = mouseover_arrow;
}, false);

function activate_arrow() {
    highlight_arrow();
    if (mouseover_arrow === null || mouseover_arrow !== click_arrow)
        return;
    let i = arrows.indexOf(mouseover_arrow);
    let ci = Math.floor(i/2);
    let dir = (i%2)*2-1;
    begin_move(ci, dir);
}

function onmouseup(event: Event) {
    event.preventDefault();
    // do propagate because TrackballControl's mouseup is on document
    activate_arrow();
}
canvas.addEventListener('mouseup', onmouseup, false);
canvas.addEventListener('touchend', function (event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    activate_arrow();
    mouse = null;
}, false);

/* URL and form controls */

function new_cut() {
    let cut_menu = document.getElementById("cuts")!;
    let cut_item = cut_menu.firstChild!.cloneNode(true) as HTMLElement;
    cut_item.style.display="block";
    let button = cut_item.getElementsByClassName("delete_cut")[0];
    button.addEventListener('click', function () {
        cut_menu.removeChild(cut_item);
    }, false);
    cut_menu.appendChild(cut_item);
    return cut_item;
}

document.getElementById('new_cut')!.addEventListener('click', e => new_cut(), false);

function apply_cuts() {
    let query: parse.Puzzle = {shell: [], cuts: []};
    let shell_menu = document.getElementById("shell_menu")! as HTMLSelectElement;
    let shell_shape = shell_menu.options[shell_menu.selectedIndex].value;
    let d = parseFloat((document.getElementById("shell_distance")! as HTMLInputElement).value);
    query.shell.push({tag: "polyhedron", name: shell_shape, d: d});

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
        query.cuts.push({tag: "polyhedron", name: shape, d: distance});
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
    render_requested = true;
    console.log("number of pieces:", newpuzzle.length);
    window.history.replaceState({}, 'title', parse.generateQuery(query));
    (document.getElementById('url')! as HTMLInputElement).value = window.location.href;
}
document.getElementById('apply_cuts')!.addEventListener('click', e => apply_cuts(), false);

var random_moves = 0;
function move_random() {
    console.assert(cuts.length > 0, "no available cuts");
    let ci = Math.floor(Math.random()*cuts.length);
    let dir = Math.floor(Math.random()*2)*2-1;
    begin_move(ci, dir);
    random_moves -= 1;
}
document.getElementById('scramble')!.addEventListener('click', function (e) {
    random_moves += 10;
}, false);

function select_option(select: HTMLSelectElement, value: string) {
    for (let i=0; i<select.options.length; i++)
        if (select.options[i].value == value) {
            select.selectedIndex = i;
            return;
        }
}

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
    pieces: number[],
    from_quat: THREE.Quaternion[], step_quat: THREE.Quaternion[], angle: number } | null;

const rad_per_sec = 2*Math.PI;

var cur_move: Move = null;
function begin_move(ci: number, dir: number) {
    let cut = cuts[ci];
    if (cur_move !== null)
        end_move();
    
    let rots = find_stops(puzzle, cut);
    let rot: THREE.Quaternion;
    let angle: number;
    if (rots.length == 0) {
        // No move possible; just do a 360-degree move
        rot = new THREE.Quaternion(0, 0, 0, 1);
    } else {
        let zi: number;
        if (dir < 0) {
            zi = rots.length-1;
            while (floathash(rots[zi].w) == floathash(1) && zi > 0)
                zi -= 1;
        } else {
            zi = 0;
            while (floathash(rots[zi].w) == floathash(1) && zi < rots.length-1)
                zi += 1;
        }
        rot = rots[zi];
    }
    angle = Math.acos(rot.w)*2;
    if (dir < 0) while (angle >= 0) angle -= 2*Math.PI;
    if (dir > 0) while (angle <= 0) angle += 2*Math.PI;
    let urot = new THREE.Quaternion();
    urot.setFromAxisAngle(cut.plane.normal, 1); // rotate 1 radian to avoid problems with exactly 180 degree rotations

    cur_move = {
        cut: cut,
        start_time: null,
        time: Math.abs(angle)/rad_per_sec*1000,
        pieces: cut.front(),
        from_quat: [],
        step_quat: [],
        angle: angle
    };
    for (let i of cur_move!.pieces) {
        cur_move.from_quat.push(puzzle[i].object!.quaternion.clone());
        cur_move.step_quat.push(urot.clone().multiply(puzzle[i].object!.quaternion));
    }
    make_move(puzzle, cut, rot);
    draw_arrows();
}

function end_move() {
    // Snap to final angle
    for (let p of cur_move!.pieces)
        puzzle[p].object!.quaternion.copy(puzzle[p].rot);
    cur_move = null;
    render_requested = true;
}

function render() {
    renderer.render(scene, camera);
    render_requested = false;
    highlight_arrow();
}

function animate(t: number) {
    let size = canvas.clientWidth;
    if (size != canvas.width || size != canvas.height) {
        renderer.setSize(size, size, false);
        render_requested = true;
    }
    
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
        render_requested = true;
    } else if (random_moves > 0) {
        move_random();
    }
    controls.update();
    if (render_requested) render();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);