import React, { useEffect } from "react";
import * as THREE from "three";
import "../styles/Launch.css";

export default function Launch({ onNext }) {
    useEffect(() => {
        let scene, camera, renderer, rocket;
        let frame = 0;

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0a001d, 10, 1600);

        camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 2000);
        camera.position.set(0, 100, 500);
        scene.add(camera);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(WIDTH, HEIGHT);
        document.getElementById("canvas").appendChild(renderer.domElement);

        // освітлення
        scene.add(new THREE.AmbientLight(0x404040, 1.2));
        const light = new THREE.PointLight(0xff9933, 2, 800);
        light.position.set(200, 100, 150);
        scene.add(light);

        // ракета
        const rocketGroup = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(20, 20, 150, 32),
            new THREE.MeshPhongMaterial({ color: 0xb0c4de })
        );
        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(20, 40, 32),
            new THREE.MeshPhongMaterial({ color: 0xff5555 })
        );
        cone.position.y = 95;
        const fire = new THREE.Mesh(
            new THREE.ConeGeometry(18, 60, 16),
            new THREE.MeshBasicMaterial({ color: 0xff6600 })
        );
        fire.position.y = -95;
        fire.rotation.x = Math.PI;
        rocketGroup.add(body, cone, fire);
        rocketGroup.position.y = -120;
        scene.add(rocketGroup);
        rocket = rocketGroup;

        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(150, 32),
            new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide })
        );
        ground.rotation.x = Math.PI / 2;
        ground.position.y = -120;
        scene.add(ground);

        function animate() {
            requestAnimationFrame(animate);
            frame++;

            rocket.rotation.y += 0.02;
            if (rocket.position.y < 600) rocket.position.y += 2.5;
            else onNext();

            const s = 1 + Math.sin(frame * 0.3) * 0.3;
            fire.scale.set(1, s, 1);

            renderer.render(scene, camera);
        }
        animate();

        return () => {
            document.getElementById("canvas").innerHTML = "";
        };
    }, [onNext]);

    return <div id="canvas"></div>;
}
