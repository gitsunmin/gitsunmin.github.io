import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { BookShelf } from '@/components/canvas/BookShelf';
import * as THREE from 'three';

import BookTopTexture from '@/assets/book_top.webp';
import BookBottomTexture from '@/assets/book_bottom.webp';
import BookPagesTexture from '@/assets/book_pages.webp';
import { 프로젝트들 } from '@/data/프로젝트';
import { useRef, useState } from 'react';
import { match } from 'ts-pattern';

export const Route = createFileRoute('/_layout/projects')({
  component: RouteComponent,
});

// 프로젝트.책.표지.앞
const books = 프로젝트들
  .filter((프로젝트) => 프로젝트.parentId === null)
  .map((프로젝트) => ({
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

function CameraController({
  selectedBookId,
}: {
  selectedBookId: string | null;
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(5, 5, 10));

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05); // 부드럽게 보간
    camera.lookAt(0, 0, 0);
  });

  // 선택된 책에 따라 목표 위치 변경
  if (selectedBookId) {
    targetPosition.current.set(0, 5, 18); // 정면
  } else {
    targetPosition.current.set(5, 5, 10); // 원래 위치
  }

  return null;
}

function RouteComponent() {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const router = useRouter();

  const handleBookClick = (id: string) => {
    const wantToSeeDetails = match(selectedBookId)
      .with(id, () => confirm('해당 프로젝트를 자세히 보시겠습니까?'))
      .otherwise(() => false);

    if (wantToSeeDetails) {
      router.navigate({
        to: `/projects/${id}`,
      });
    }
    setSelectedBookId((prev) => (prev === id ? null : id));
  };
  return (
    <Canvas
      camera={{ position: [5, 5, 10], zoom: 2 }}
      style={{ height: '100dvh' }}
    >
      <CameraController selectedBookId={selectedBookId} />
      <ambientLight />
      <directionalLight position={[2, 5, 5]} />
      <BookShelf
        books={books}
        selectedBookId={selectedBookId}
        onBookClick={handleBookClick}
      />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
