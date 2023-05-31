import * as THREE from 'three';
import { TrackballControls } from './TrackballControls';
import { make_shell, make_cuts, polyhedron } from './make';
import { Puzzle, Cut, find_cuts, find_stops, make_move } from './move';
import { PolyGeometry } from './piece';
import { ExactPlane, ExactVector3, ExactQuaternion } from './math';
import { AlgebraicNumber } from './exact';
import { setdefault } from './util';
import * as parse from './parse';

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

var puzzle = new Puzzle();

const face_material = new THREE.MeshLambertMaterial({
    flatShading: true,
    vertexColors: true,
    // https://stackoverflow.com/questions/31539130/display-wireframe-and-solid-color/31541369#31541369
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
    
const edge_material = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});
//const wire_material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 1});

function draw_puzzle(newPuzzle: Puzzle, scene: THREE.Scene, scale: number): void {
    for (let piece of puzzle.pieces)
        if (piece.object)
            scene.remove(piece.object);
    puzzle = newPuzzle;
    for (let piece of puzzle.pieces) {
        piece.object = new THREE.Object3D();
        let g = piece.toThree();
        piece.object.add(new THREE.Mesh(g, face_material));
        piece.object.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edge_material));
        //piece.object.add(new THREE.LineSegments(new THREE.WireframeGeometry(g), wire_material));
        piece.object.scale.multiplyScalar(scale);

        scene.add(piece.object);
    }
    draw_arrows();
    render_requested = true;
}

// Canvas controls

var grips: Cut[] = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

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
    return new THREE.ExtrudeGeometry(arrow_shape, {depth: 0.2, bevelEnabled: false});
}();

const arrow_material = new THREE.MeshLambertMaterial({
    transparent: true, opacity: 0.3, side: THREE.DoubleSide});
const mouseover_arrow_material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(0xFFFFCC),
    transparent: true, opacity: 0.9, side: THREE.DoubleSide});

function draw_arrow(cut: Cut, d: number): void {
    let arrow = new THREE.Mesh(arrow_geometry, arrow_material);
    arrow.scale.multiplyScalar(0.2);
    var rot = new THREE.Quaternion();
    rot.setFromUnitVectors(new THREE.Vector3(0, 0, 1), puzzle.global_rot.apply(cut.plane.normal).toThree().normalize());
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

function draw_arrows(): void {
    // remove old arrows
    for (let arrow of arrows)
        scene.remove(arrow);
    mouseover_arrow = null;
    arrows = [];

    // compute new grips
    // make normals point away from origin; deep cuts go both ways
    console.time('grips found in');
    grips = []
    for (let cut of find_cuts(puzzle)) {
        if (cut.plane.constant.sign() <= 0)
            grips.push(cut);
        if (cut.plane.constant.sign() >= 0)
            grips.push(cut.neg());
    }
    console.timeEnd('grips found in');

    // draw new arrows, linking each to a cut
    grips.sort((a, b) => b.plane.constant.compare(a.plane.constant));
    let count: {[key: string]: number} = {};
    for (let cut of grips) {
        // bug: if cuts are close, arrows can collide
        let h = String(cut.plane.normal);
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

function highlight_arrow(): void {
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

function set_mouse(x: number, y: number): void {
    let rect = renderer.domElement.getBoundingClientRect();
    mouse.x = (x - rect.left) / rect.width * 2 - 1;
    mouse.y = -(y - rect.top) / rect.height * 2 + 1;
}

canvas.addEventListener('mousemove', function (event: MouseEvent) {
    event.preventDefault();
    // do propagate because TrackballControl's mousemove is on document
    set_mouse(event.clientX, event.clientY);
    highlight_arrow();
}, false);
function ontouchmove(event: TouchEvent): void {
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

function activate_arrow(): void {
    highlight_arrow();
    if (mouseover_arrow === null || mouseover_arrow !== click_arrow)
        return;
    let i = arrows.indexOf(mouseover_arrow);
    let ci = Math.floor(i/2);
    let dir = (i%2)*2-1;
    begin_move(ci, dir);
}

function onmouseup(event: Event): void {
    event.preventDefault();
    // do propagate because TrackballControl's mouseup is on document
    activate_arrow();
}
canvas.addEventListener('mouseup', onmouseup, false);
canvas.addEventListener('touchend', function (event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    activate_arrow();
}, false);

/* URL and form controls */

// model
let recipe: parse.Puzzle = parse.parseQuery(window.location.search);

// view as URL
function set_url(recipe: parse.Puzzle): void {
    window.history.replaceState({}, 'title', parse.generateQuery(recipe));
    (document.getElementById('url')! as HTMLInputElement).value = window.location.href;
}

// view as form

/* Make an <option> of a <select> as if the user had selected it */
function select_option(select: HTMLSelectElement, value: string): void {
    for (let i=0; i<select.options.length; i++)
        if (select.options[i].value == value) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change'));
            return;
        }
}

class RecipeForm {
    shells_list: HTMLElement;
    cuts_list: HTMLElement;
    constructor() {
        this.shells_list = document.getElementById("shells")!;
        this.cuts_list = document.getElementById("cuts")!;
    }
    
    private static add_item(list: HTMLElement): HTMLElement {
        // Add new item to HTML
        let item = list.getElementsByClassName('prototype')[0].cloneNode(true) as HTMLElement;
        item.classList.remove('prototype');
        item.style.display = "block";
        let select = item.getElementsByClassName("shape")[0] as HTMLSelectElement;
        select.addEventListener('change', function () {
            let normal = item.getElementsByClassName("normal")[0]!.parentElement!;
            normal.style.display = select.value == "plane" ? "block" : "none";
        }, false);
        let button = item.getElementsByClassName("delete_cut")[0];
        button.addEventListener('click', function () {
            list.removeChild(item);
        }, false);
        list.appendChild(item);
        return item;
    }
    
    private static set_item(item: HTMLElement, shape: parse.Shape): void {
        let se = item.getElementsByClassName('shape')[0] as HTMLSelectElement;
        if (shape.tag == "polyhedron") {
            select_option(se, shape.name);
        } else if (shape.tag == "plane") {
            select_option(se, "plane");
            let ne = item.getElementsByClassName('normal')[0] as HTMLInputElement;
            ne.value = shape.a + ',' + shape.b + ',' + shape.c;
        }
        let de = item.getElementsByClassName('scale')[0] as HTMLInputElement;
        de.value = shape.d;
    }

    private static get_items(list: HTMLElement): HTMLElement[] {
        let items: HTMLElement[] = [];
        for (let item of Array.from(list.children)) {
            if (item.classList.contains('prototype')) continue;
            if (!(item.classList.contains('shell') || item.classList.contains('cut'))) continue;
            items.push(item as HTMLElement);
        }
        return items;
    }
    
    private static item_to_shape(item: HTMLElement): parse.Shape|null {
        let se = item.getElementsByClassName('shape')[0] as HTMLSelectElement;
        let shape = se.options[se.selectedIndex].value;
        let de = item.getElementsByClassName('scale')[0] as HTMLInputElement;
        let help = item.getElementsByClassName('help')[0] as HTMLElement;
        help.style.display = "none";
        try {
            let scale = de.value;
            if (shape == "plane") {
                let normal = item.getElementsByClassName('normal')[0] as HTMLInputElement;
                let coeffs = normal.value.split(',');
                if (coeffs.length != 3)
                    throw new parse.ParseError('normal vector should be of the form <i>x</i>,<i>y</i>,<i>z</i>');
                coeffs.map(parse.parseReal);
                parse.parseReal(scale);
                return {tag: "plane", a: coeffs[0], b: coeffs[1], c: coeffs[2], d: scale};
            } else {
                parse.parseReal(scale);
                return {tag: "polyhedron", name: shape, d: scale};
            }
        } catch (e) {
            if (e instanceof parse.ParseError) {
                help.style.display = "block";
                help.innerHTML = e.message;
                return null;
            } else {
                throw e;
            }
        }
    }
    
    add_shell(shape?: parse.Shape) {
        let item = RecipeForm.add_item(this.shells_list);
        if (shape !== undefined) RecipeForm.set_item(item, shape);
    }
    add_cut(shape?: parse.Shape) {
        let item = RecipeForm.add_item(this.cuts_list);
        if (shape !== undefined) RecipeForm.set_item(item, shape);
    }
    
    get_recipe(): parse.Puzzle|null {
        let p: parse.Puzzle = { shell: [], cuts: [] };
        for (let item of RecipeForm.get_items(this.shells_list)) {
            let s = RecipeForm.item_to_shape(item);
            if (s === null) return null;
            p.shell.push(s);
        }
        for (let item of RecipeForm.get_items(this.cuts_list)) {
            let s = RecipeForm.item_to_shape(item);
            if (s === null) return null;
            p.cuts.push(s);
        }
        return p;
    }

    set_from_recipe(recipe: parse.Puzzle) {
        for (let shape of recipe.shell)
            this.add_shell(shape);
        for (let shape of recipe.cuts)
            this.add_cut(shape);
    }
};

var recipeForm = new RecipeForm();
recipeForm.set_from_recipe(recipe);

function shapes_to_planes(shapes: parse.Shape[]): ExactPlane[] {
    let planes: ExactPlane[] = [];
    for (let s of shapes) {
        switch (s.tag) {
            case "plane":
                planes.push(new ExactPlane(new ExactVector3(parse.parseReal(s.a),
                                                            parse.parseReal(s.b),
                                                            parse.parseReal(s.c)),
                                           parse.parseReal(s.d)));
                break;
            case "polyhedron":
                planes.push(...polyhedron(s.name, parse.parseReal(s.d)));
                break;
        }
    }
    return planes;
}

function apply_cuts(): void {
    let maybeRecipe = recipeForm.get_recipe();
    if (maybeRecipe === null) return;
    recipe = maybeRecipe;

    set_url(recipe);

    let shell = make_shell(shapes_to_planes(recipe.shell));
    let cutplanes = shapes_to_planes(recipe.cuts);

    console.time('pieces constructed in');
    let newPuzzle = new Puzzle(make_cuts(cutplanes, [shell]));
    console.timeEnd('pieces constructed in');
    // Find circumradius, which we will scale to 1
    let r = 0;
    for (let v of shell.vertices.map(v => v.toThree()))
        if (v.length() > r) r = v.length();
    draw_puzzle(newPuzzle, scene, 1/r);
    render_requested = true;
}

apply_cuts();

document.getElementById('add_shell')!.addEventListener('click', e => recipeForm.add_shell(), false);
document.getElementById('add_cut')!.addEventListener('click', e => recipeForm.add_cut(), false);
document.getElementById('apply_cuts')!.addEventListener('click', e => apply_cuts(), false);

// Scramble

var random_moves = 0;
function move_random(): void {
    console.assert(grips.length > 0, "no available grips");
    let ci = Math.floor(Math.random()*grips.length);
    let dir = Math.floor(Math.random()*2)*2-1;
    begin_move(ci, dir);
    random_moves -= 1;
}
document.getElementById('scramble')!.addEventListener('click', function (e) {
    random_moves += 10;
}, false);

// Animation

type Move = {
    cut: Cut,
    start_time: number | null, time: number,
    pieces: number[],
    from_quat: THREE.Quaternion[], step_quat: THREE.Quaternion[], angle: number } | null;

const rad_per_sec = 2*Math.PI;

var cur_move: Move = null;

function begin_move(ci: number, dir: number): void {
    let cut = grips[ci];
    if (cur_move !== null)
        end_move();

    console.time('stops found in');
    let rots = find_stops(puzzle, cut);
    console.timeEnd('stops found in');

    let rot: ExactQuaternion;
    let angle: number;
    if (rots.length == 0) {
        // No move possible; just do a 360-degree move
        rot = ExactQuaternion.identity();
        angle = 2*Math.PI;
    } else {
        // Find first nonzero rotation in dir
        let zi: number;
        if (dir < 0) {
            zi = rots.length-1;
            while (rots[zi].pseudoAngle().isZero() && zi > 0)
                zi -= 1;
        } else {
            zi = 0;
            while (rots[zi].pseudoAngle().isZero() && zi < rots.length-1)
                zi += 1;
        }
        rot = rots[zi];
        angle = rot.approxAngle();
    }
    if (dir < 0) while (angle >= 0) angle -= 2*Math.PI;
    if (dir > 0) while (angle <= 0) angle += 2*Math.PI;
    let urot = new THREE.Quaternion();
    urot.setFromAxisAngle(cut.plane.normal.toThree().normalize(), 1); // rotate 1 radian to avoid problems with exactly 180 degree rotations

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
        let grot = puzzle.global_rot.toThree();
        let prot = puzzle.pieces[i].rot.toThree();
        cur_move.from_quat.push(grot.clone().multiply(prot));
        cur_move.step_quat.push(grot.clone().multiply(urot).multiply(prot));
    }
    console.time('move performed in');
    make_move(puzzle, cut, rot);
    console.timeEnd('move performed in');
    draw_arrows();
}

function end_move(): void {
    // Snap to final angle
    //for (let p of cur_move!.pieces) {
    for (let p=0; p<puzzle.pieces.length; p++) {
        let q = puzzle.pieces[p].object!.quaternion;
        let r = puzzle.global_rot.mul(puzzle.pieces[p].rot);
        q.copy(r.toThree());
    }
    cur_move = null;
    render_requested = true;
}

function render(): void {
    renderer.render(scene, camera);
    render_requested = false;
    highlight_arrow();
}

function resize(): void {
    let size = canvas.clientWidth;
    if (size != canvas.width || size != canvas.height) {
        renderer.setSize(size, size, false);
        render_requested = true;
    }
}

function animate(t: number): void {
    resize();
    if (cur_move !== null) {
        if (cur_move.start_time === null)
            cur_move.start_time = t;
    
        let ti = (t-cur_move.start_time!)/cur_move.time;
        if (ti > 1) {
            end_move();
        } else
            for (let i=0; i<cur_move.pieces.length; i++)
                puzzle.pieces[cur_move.pieces[i]].object!.quaternion.slerpQuaternions(
                    cur_move.from_quat[i],
                    cur_move.step_quat[i],
                    ti*cur_move.angle);
        render_requested = true;
    } else if (random_moves > 0) {
        move_random();
    }
    controls.update();
    if (render_requested) render();
    requestAnimationFrame(animate);
}

resize();
requestAnimationFrame(animate);
