import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { createFileRoute } from '@tanstack/react-router';
import { BookShelf } from '@/components/canvas/BookShelf';

import BookTopTexture from '@/assets/book_top.webp';
import BookBottomTexture from '@/assets/book_bottom.webp';
import BookPagesTexture from '@/assets/book_pages.webp';
import { 프로젝트들 } from '@/data/프로젝트';
export const Route = createFileRoute('/_layout/projects')({
  component: RouteComponent,
});
// 프로젝트.책.표지.앞
const books = 프로젝트들.map((프로젝트) => ({
  id: 프로젝트.id,
  textures: {
    front: 프로젝트.책.표지.앞,
    back: 프로젝트.책.표지.뒤,
    side: 프로젝트.책.표지.등,
    top: BookTopTexture,
    bottom: BookBottomTexture,
    pages: BookPagesTexture,
  },
}));

function RouteComponent() {
  return (
    <Canvas camera={{ position: [5, 5, 10], zoom: 2 }}>
      <ambientLight />
      <directionalLight position={[2, 5, 5]} />
      <BookShelf books={books} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
