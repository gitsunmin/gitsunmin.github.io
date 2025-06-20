import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EXPERIENCE_LIST } from '@/data/experiencies';
import { useRouter } from '@tanstack/react-router';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { match } from 'ts-pattern';
import { BookShelf } from '@/components/canvas/BookShelf';
import * as THREE from 'three';

import BookTopTexture from '@/assets/book_top.webp';
import BookBottomTexture from '@/assets/book_bottom.webp';
import BookPagesTexture from '@/assets/book_pages.webp';

const books = EXPERIENCE_LIST.map((experience) => ({
  id: experience.id,
  textures: {
    front: experience.book.cover.front,
    back: experience.book.cover.back,
    side: experience.book.cover.side,
    top: BookTopTexture,
    bottom: BookBottomTexture,
    pages: BookPagesTexture
  }
}));

function CameraController({
  selectedBookId
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

export const Content = () => {
  const router = useRouter();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleBookClick = (id: string) => {
    const wantToSeeDetails = match(selectedBookId)
      .with(id, () => confirm('해당 프로젝트를 자세히 보시겠습니까?'))
      .otherwise(() => false);

    if (wantToSeeDetails) {
      router.navigate({
        to: `/experiencies/${id}`
      });
    }
    setSelectedBookId((prev) => (prev === id ? null : id));
  };

  return (
    <Canvas
      camera={{ position: [5, 5, 10], zoom: 2 }}
      className="h-[calc(100vh-64px)] w-full"
      style={{ height: window.innerHeight - 64 }}
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
};

export const ExperienciesPage = () => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};
