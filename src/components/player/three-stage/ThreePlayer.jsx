import React, { Component, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';
import ee from '../../../utilities/event-emitter';
import EventEnum from '../../../enities/Event/EventEnum';

import dat from 'dat.gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreePlayer extends Component {

    constructor(props) {
        super(props);
        this.ee = ee;
    }

    render() {
        return (
            <div id="three-player">
                <div id="stats-container"></div>
                <div id="gui-container"></div>
            </div>
        );
    }

    componentDidMount() {
        //Add Renderer
        let camera, scene, renderer;
        let convex_polygon, concave_polygon, control;
        let convex_polygon_geometry, concave_polygon_geometry, material, convex_polygon_mesh, concave_polygon_mesh;

        var stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

        let playContainer = document.getElementById('three-player');
        document.getElementById('stats-container').appendChild(stats.dom);

        let mainContainer = document.getElementById('three-container');

        this.ee.on(EventEnum.ThreeResizeEvent, (e) => {
            // console.log(renderer);
            camera.aspect = mainContainer.clientWidth / mainContainer.clientHeight;//相机视角长宽比
            camera.updateProjectionMatrix();
            renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
            renderer.render(scene, camera);
        });

        init();

        function init() {
            // camera = new THREE.OrthographicCamera(100, 100, 100, 100, 0.01, 1000);
            camera = new THREE.PerspectiveCamera(50, playContainer.clientWidth / playContainer.clientHeight, 0.01, 1000);
            camera.position.z = 10;
            camera.position.y = 1;
            camera.lookAt(1, 1, 1);

            var gui = new dat.GUI({ autoPlace: false });
            gui.domElement.id = 'gui';
            var Options = function () {
                this.message = 'dat.gui';
                this.speed = 0.8;
                this.displayOutline = false;
                this.button = function () { };
            };
            let options = new Options();
            gui.add(options, 'message');
            gui.add(options, 'speed', -5, 5);
            gui.add(options, 'displayOutline');
            gui.add(options, 'button');
            document.getElementById('gui-container').appendChild(gui.domElement);
            

            scene = new THREE.Scene();

            concave_polygon = new THREE.Shape();
            concave_polygon.moveTo(-3, 0.4);
            concave_polygon.lineTo(-0.8, 1.6);
            concave_polygon.lineTo(-2, 2);
            concave_polygon.lineTo(-4, 2.6);
            concave_polygon.lineTo(-5.4, 1.8);
            concave_polygon.lineTo(-3, 0.4);

            convex_polygon = new THREE.Shape();
            let p1 = new THREE.Vector2(0.5, 0.2);
            convex_polygon.moveTo(p1.x, p1.y);
            convex_polygon.lineTo(4, 0.65);
            convex_polygon.lineTo(5, 1.5);
            convex_polygon.lineTo(3.8, 3);
            convex_polygon.lineTo(1.5, 3.8);
            convex_polygon.lineTo(3, 2.5);
            convex_polygon.lineTo(p1.x, p1.y);

            const gridHelper = new THREE.GridHelper(15, 15);

            scene.add(gridHelper);

            convex_polygon_geometry = new THREE.ShapeGeometry(convex_polygon);
            concave_polygon_geometry = new THREE.ShapeGeometry(concave_polygon);

            const edges = new THREE.WireframeGeometry(convex_polygon_geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            // material = new THREE.MeshBasicMaterial({ color: 0x00ff00, });
            // mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
            material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
            convex_polygon_mesh = new THREE.Mesh(convex_polygon_geometry, material);
            concave_polygon_mesh = new THREE.Mesh(concave_polygon_geometry, material);

            var axesHelper = new THREE.AxesHelper(15);
            scene.add(axesHelper);
            scene.add(line);

            // geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            // material = new THREE.MeshNormalMaterial();

            // mesh = new THREE.Mesh(geometry, material);
            scene.add(convex_polygon_mesh);
            scene.add(concave_polygon_mesh);
            const wireframe = new THREE.WireframeGeometry(concave_polygon_geometry);
            const line2 = new THREE.LineSegments(wireframe);
            scene.add(line2);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(playContainer.clientWidth, playContainer.clientHeight);

            renderer.setAnimationLoop(animation);
            playContainer.appendChild(renderer.domElement);
            control = new OrbitControls(camera, renderer.domElement);

            // var controls = new OrbitControls(camera);
        }

        function animation(time) {
            stats.begin();
            // mesh.rotation.x = time / 2000;
            // mesh.rotation.y = time / 1000;

            renderer.render(scene, camera);
            stats.end();
        }

    }
}

export default ThreePlayer;
