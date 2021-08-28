import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader'
import pairs from './pairs'

const clock = new THREE.Clock()

let camera, controls, scene, renderer
let mixer, skeletonHelper

init()
animate()

console.log({ pairs })

function onProgress(...progress) {
    console.info({ progress })
}

function onError(error) {
    console.warn({ error })
}

document.addEventListener('keyup', (event) => {
    console.log({ event })
    if (event.code === 'Space') {
        loadRandomAnimation()
    }
})

function loadRandomAnimation() {
    const index = Math.floor(Math.random() * pairs.length)
    const [key, description] = pairs[index]
    const asset = `assets/everything/${key}.bvh`

    console.log({ key, description })

    const loader = new BVHLoader()
    loader.load(asset, function(result) {
        skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0])
        skeletonHelper.skeleton = result.skeleton // allow animation mixer to bind to THREE.SkeletonHelper directly

        const boneContainer = new THREE.Group()
        boneContainer.add(result.skeleton.bones[0])

        scene.add(skeletonHelper)
        scene.add(boneContainer)

        // play animation
        // play animation
        mixer = new THREE.AnimationMixer(skeletonHelper);
        mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();
    }, onProgress, onError)
    console.log({ key, description })
}



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

    controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 300
    controls.maxDistance = 700

    window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    if (mixer) mixer.update(delta)

    renderer.render(scene, camera)
}