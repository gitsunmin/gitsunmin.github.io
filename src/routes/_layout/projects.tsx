import { createFileRoute } from '@tanstack/react-router';
import { Canvas } from '@react-three/fiber';

export const Route = createFileRoute('/_layout/projects')({
  component: RouteComponent,
});
const Book = ({ position, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1.5, 0.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Bookshelf = () => {
  return (
    <Canvas camera={{ position: [0, 3, 5] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Book position={[-1.5, 0, 0]} color="red" />
      <Book position={[0, 0, 0]} color="blue" />
      <Book position={[1.5, 0, 0]} color="green" />
    </Canvas>
  );
};

function RouteComponent() {
  return (
    <div>
      <Bookshelf />
    </div>
  );
}
