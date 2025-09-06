import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  DeviceOrientationControls,
  Html
} from '@react-three/drei'
import { VRButton, XR, createXRStore } from '@react-three/xr'

// Create XR store (required in latest @react-three/xr)
const store = createXRStore()

// Loading component
const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-nebula/80">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-neon-primary">Loading Virtual Campus...</p>
    </div>
  </div>
);

// Campus model with interactive elements
function SimpleCampus() {
  const [hovered, setHovered] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  const buildings = [
    { id: 'main', position: [0, 1, 0], size: [3, 2, 3], name: 'Main Building' },
    { id: 'library', position: [-4, 1, 2], size: [2, 3, 2], name: 'Library' },
    { id: 'lab', position: [4, 1, -2], size: [2, 2, 2], name: 'Science Lab' }
  ]

  return (
    <group>
      {/* Buildings */}
      {buildings.map((building) => (
        <mesh
          key={building.id}
          position={building.position as [number, number, number]}
          onPointerOver={() => {
            setHovered(true)
            setSelectedBuilding(building.id)
          }}
          onPointerOut={() => {
            setHovered(false)
            setSelectedBuilding(null)
          }}
        >
          <boxGeometry args={building.size} />
          <meshStandardMaterial 
            color={selectedBuilding === building.id ? "#64ffda" : "#4a5568"} 
            metalness={0.5}
            roughness={0.5}
          />
          {selectedBuilding === building.id && (
            <Html position={[0, building.size[1] / 2 + 0.5, 0]}>
              <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                {building.name}
              </div>
            </Html>
          )}
        </mesh>
      ))}

      {/* Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Decorative elements (trees) */}
      <group>
        {[[-2, 0, -3], [2, 0, 3], [-3, 0, 2], [3, 0, -2]].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.5, 1.2]} />
              <meshStandardMaterial color="#2f4f4f" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

const VirtualCampus = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [hasDeviceOrientation, setHasDeviceOrientation] = useState(false)
  const [webXRSupported, setWebXRSupported] = useState(false)

  useEffect(() => {
    // Detect if running on mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))

    // Detect device orientation support
    const checkDeviceOrientation = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          setHasDeviceOrientation(permission === 'granted')
        } catch (e) {
          setHasDeviceOrientation(false)
        }
      } else {
        setHasDeviceOrientation('ondeviceorientationabsolute' in window)
      }
    }

    checkDeviceOrientation()

    // Detect WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setWebXRSupported(supported)
      })
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <Canvas shadows>
        <XR store={store}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[8, 5, 8]} />

            {isMobile ? (
              hasDeviceOrientation ? (
                <DeviceOrientationControls />
              ) : (
                <OrbitControls 
                  enableZoom
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={0}
                  maxDistance={20}
                  minDistance={3}
                  enableDamping
                  dampingFactor={0.05}
                />
              )
            ) : (
              <OrbitControls 
                enableZoom
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={0}
                maxDistance={20}
                minDistance={3}
              />
            )}

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <hemisphereLight intensity={0.3} />

            {/* Scene content */}
            <SimpleCampus />
            <Environment preset="sunset" />
          </Suspense>
        </XR>
      </Canvas>

      {/* VR Button (only show if supported) */}
      {webXRSupported && <VRButton store={store} />}

      {/* Mobile instructions */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg text-sm">
          {webXRSupported ? (
            hasDeviceOrientation ? (
              <p>Move your phone to look around. Tap the VR button for immersive mode.</p>
            ) : (
              <p>Use your finger to look around. Tap the VR button for immersive mode.</p>
            )
          ) : (
            <p>Your device/browser does not support WebXR. You can still explore in 3D.</p>
          )}
        </div>
      )}

      {/* Loading overlay */}
      <Suspense fallback={<LoadingScreen />}>
        {/* Scene loading indicator */}
      </Suspense>
    </div>
  )
}

export default VirtualCampus
