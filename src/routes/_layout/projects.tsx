import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { createFileRoute } from "@tanstack/react-router";
import { BookShelf } from "@/components/canvas/BookShelf";

export const Route = createFileRoute("/_layout/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Canvas camera={{ position: [5, 5, 10], zoom: 2 }}>
      <ambientLight />
      <directionalLight position={[2, 5, 5]} />
      <BookShelf />
      <OrbitControls />
    </Canvas>
  );
}
