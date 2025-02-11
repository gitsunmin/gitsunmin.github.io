import { createFileRoute } from '@tanstack/react-router';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef } from "react";
import { Mesh } from "three";

// 📌 책 컴포넌트
interface BookProps {
  position: [number, number, number]; // 초기 위치
  color: string; // 책 색상
  size: [number, number, number]; // 책 크기
  onBookClick: (index: number) => void; // 클릭 이벤트 핸들러
  index: number; // 책의 인덱스
}

const Book: React.FC<BookProps> = ({ position, color, size, onBookClick, index }) => {
  const bookRef = useRef<Mesh>(null);
  const [isPulledOut, setIsPulledOut] = useState(false);

  useFrame(() => {
    if (bookRef.current) {
      // 책을 클릭하면 앞으로 나오도록 애니메이션 적용
      const targetZ = isPulledOut ? position[2] + 1 : position[2];
      bookRef.current.position.z += (targetZ - bookRef.current.position.z) * 0.1;
    }
  });

  return (
    <mesh
      ref={bookRef}
      position={position}
      onClick={() => {
        setIsPulledOut(!isPulledOut);
        onBookClick(index);
      }}
    >
      {/* 책 표지 */}
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />

      {/* 책 페이지 (가운데) */}
      <mesh position={[0, 0, -size[2] / 2 + 0.05]}>
        <boxGeometry args={[size[0] * 0.95, size[1] * 0.95, size[2] * 0.9]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </mesh>
  );
};

// 📌 책장 컴포넌트
const BookShelf: React.FC = () => {
  const books: { position: [number, number, number]; color: string; size: [number, number, number] }[] = [
    { position: [-1.2, 0, 0], color: "red", size: [0.3, 1.2, 0.8] },
    { position: [-0.6, 0, 0], color: "blue", size: [0.35, 1, 0.75] },
    { position: [0, 0, 0], color: "green", size: [0.28, 1.1, 0.85] },
    { position: [0.6, 0, 0], color: "purple", size: [0.32, 1.3, 0.9] },
    { position: [1.2, 0, 0], color: "orange", size: [0.3, 1, 0.8] },
  ];

  const handleBookClick = (index: number) => {
    console.log(`📖 책 ${index + 1} 선택됨`);
  };

  return (
    <group>
      {books.map((book, index) => (
        <Book key={index} onBookClick={handleBookClick} index={index} color={book.color} size={book.size} position={book.position} />
      ))}
    </group>
  );
};

export const Route = createFileRoute('/_layout/projects')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Canvas camera={{ position: [2, 2, 4] }}>
        <ambientLight />
        <directionalLight position={[2, 2, 2]} />
        <BookShelf />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
