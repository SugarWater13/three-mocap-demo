import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadRandomSkeleton } from './skeleton'

const clock = new THREE.Clock()

let camera, controls, scene, renderer

let figs = []

init()
animate()

document.addEventListener('keyup', (event) => {
    console.log({ event })
    if (event.code === 'Space') {
        loadRandomSkeleton().then(
            (fig) => {

                scene.add(fig.skeletonHelper);
                scene.add(fig.boneContainer);
                figs.push(fig)

                if (figs.length > 5) {
                    const old = figs.slice(0, -5)
                    const next = figs.slice(-5, -1)
                    old.forEach((fig) => {
                        scene.remove(fig.skeletonHelper)
                        scene.remove(fig.boneContainer)
                    })
                    figs = next
                }
            },
            console.error,
        )
    }
})


function init() {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.set(0, 200, 300)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeeeeee)

    scene.add(new THREE.GridHelper(400, 10))

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 300;
    controls.maxDistance = 700;

    window.addEventListener('resize', onWindowResize);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeightscene
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    figs.forEach((fig) => {
        fig.mixer.update(delta)
    })

    renderer.render(scene, camera)
}