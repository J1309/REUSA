import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Ambient hero layer: slow-drifting wireframe solids + a dust field.
 * Purely decorative — sits behind the hero copy, ignores pointer events,
 * and does nothing at all if the user asked for reduced motion.
 */
export default function ThreeAmbient({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const host = ref.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    const solids = [
      [new THREE.IcosahedronGeometry(1.4, 0), [-3.4, 0.8, 0]],
      [new THREE.OctahedronGeometry(1, 0), [3.6, -1.1, -2]],
      [new THREE.TorusGeometry(0.9, 0.28, 8, 24), [1.6, 2.1, -3]],
    ].map(([geo, pos]) => {
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0x7fa88b, wireframe: true, transparent: true, opacity: 0.28 }),
      )
      mesh.position.set(...pos)
      scene.add(mesh)
      return mesh
    })

    const count = 220
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < pts.length; i++) pts[i] = (Math.random() - 0.5) * 18
    const dust = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pts, 3)),
      new THREE.PointsMaterial({ color: 0xf6f2ea, size: 0.035, transparent: true, opacity: 0.5 }),
    )
    scene.add(dust)

    // Parallax toward the pointer, eased in the render loop.
    const target = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 0.6
      target.y = (e.clientY / innerHeight - 0.5) * 0.4
    }
    addEventListener('pointermove', onMove, { passive: true })

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight)
    }
    addEventListener('resize', onResize)

    let raf
    const clock = new THREE.Clock()
    const tick = () => {
      const t = clock.getElapsedTime()
      solids.forEach((m, i) => {
        m.rotation.x = t * (0.06 + i * 0.02)
        m.rotation.y = t * (0.09 + i * 0.03)
        m.position.y += Math.sin(t * 0.7 + i) * 0.0015
      })
      dust.rotation.y = t * 0.02
      camera.position.x += (target.x * 2 - camera.position.x) * 0.04
      camera.position.y += (-target.y * 2 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('resize', onResize)
      scene.traverse((o) => {
        o.geometry?.dispose()
        o.material?.dispose()
      })
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}
