import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import { Mesh, TextureLoader } from 'three';
import { createFileRoute } from '@tanstack/react-router';

interface BookProps {
  position: [number, number, number]; // 초기 위치
  size: [number, number, number]; // 책 크기
  textures: {
    front: string;
    back: string;
    side: string;
    top: string;
    bottom: string;
    pages: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const Book: React.FC<BookProps> = ({
  position,
  size,
  textures,
  isSelected,
  onClick,
}) => {
  const bookRef = useRef<Mesh>(null);
  const frontTexture = useLoader(TextureLoader, textures.front);
  const backTexture = useLoader(TextureLoader, textures.back);
  const sideTexture = useLoader(TextureLoader, textures.side);
  const topTexture = useLoader(TextureLoader, textures.top);
  const bottomTexture = useLoader(TextureLoader, textures.bottom);
  const pagesTexture = useLoader(TextureLoader, textures.pages);

  useFrame(() => {
    if (bookRef.current) {
      // 클릭한 책만 앞으로 이동
      const targetZ = isSelected ? position[2] + 1 : position[2];
      bookRef.current.position.z +=
        (targetZ - bookRef.current.position.z) * 0.1;
      if (isSelected) {
        if (bookRef.current.rotation.y > -1.6) {
          bookRef.current.rotation.y -= 0.04;
          setTimeout(() => {
            if (bookRef.current) {
              bookRef.current.scale.set(1, 2, 2);
            }
          }, 400);
        }
      } else {
        bookRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <mesh
      ref={bookRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation(); // 클릭 이벤트 전파 방지
        onClick();
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial attach="material-0" map={sideTexture} />{' '}
      {/* 왼쪽 (책등) */}
      <meshStandardMaterial attach="material-1" map={pagesTexture} />{' '}
      {/* 오른쪽 (페이지) */}
      <meshStandardMaterial attach="material-2" map={topTexture} />{' '}
      {/* 위쪽 (페이지) */}
      <meshStandardMaterial attach="material-3" map={bottomTexture} />{' '}
      {/* 아래쪽 (페이지) */}
      <meshStandardMaterial attach="material-4" map={frontTexture} />{' '}
      {/* 앞면 (표지) */}
      <meshStandardMaterial attach="material-5" map={backTexture} />{' '}
      {/* 뒷면 (표지) */}
    </mesh>
  );
};

const BookShelf: React.FC = () => {
  const shelves = 4; // 책꽂이 층 수 (조절 가능)
  const booksPerRow = 5; // 한 층당 책 개수 (조절 가능)
  const bookSpacing = 0.5; // 책 간격
  const shelfHeight = 1.5; // 층 간 높이
  const shelfDepth = 1.2; // 책장의 깊이 (책보다 깊어야 함)
  const bookDepth = 0.9; // 책의 깊이 (책장이 더 깊어야 함)
  const bookHeight = 1.2; // 책의 높이

  const books: {
    position: [number, number, number];
    size: [number, number, number];
    textures: {
      front: string;
      back: string;
      side: string;
      top: string;
      bottom: string;
      pages: string;
    };
  }[] = Array.from({ length: shelves * booksPerRow }).map((_, i) => {
    const shelfIndex = shelves - 1 - Math.floor(i / booksPerRow); // 위에서부터 채우기
    const bookIndex = i % booksPerRow; // 왼쪽부터 채우기

    return {
      position: [
        (-2.5 + bookIndex) * bookSpacing, // 왼쪽부터 채움
        shelfIndex * shelfHeight - (shelves * shelfHeight) / 2 + bookHeight / 2, // 📌 책이 구분판 위에 정확히 위치
        -0.5, // 책이 책장 안에 들어가도록 위치 조정
      ],
      size: [0.4, bookHeight, bookDepth], // 책 크기
      textures: {
        front: `src/assets/react.svg`,
        back: `src/assets/react.svg`,
        side: `src/assets/book_cover.webp`,
        top: `src/assets/react.svg`,
        bottom: `src/assets/react.svg`,
        pages: `src/assets/react.svg`,
      },
    };
  });

  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const handleBookClick = (index: number) => {
    setSelectedBook((prev) => (prev === index ? null : index));
    console.log(`📖 책 ${index + 1} 선택됨`);
  };

  return (
    <group>
      {/* 📚 책꽂이 구조 (프레임 + 구분판 추가) */}
      <mesh position={[-0.2, (-shelfHeight * shelves) / 2 - 0.05, -0.6]}>
        {/* 📌 바닥을 아래로 내림 */}
        <boxGeometry args={[2.7, 0.1, shelfDepth]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* 📌 층별 구분판 (각 층을 나누는 바닥) */}
      {Array.from({ length: shelves - 1 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -0.2,
            0.6 +
              (i + 1) * shelfHeight -
              (shelves * shelfHeight) / 2 -
              bookHeight / 2,
            -0.6,
          ]} // 📌 책보다 살짝 아래 배치
        >
          <boxGeometry args={[2.7, 0.1, shelfDepth]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
      ))}

      {/* 📖 책 배치 */}
      {books.map((book, index) => (
        <Book
          key={index}
          position={book.position}
          size={book.size}
          textures={book.textures}
          isSelected={selectedBook === index}
          onClick={() => handleBookClick(index)}
        />
      ))}
    </group>
  );
};

// 📌 전체 Scene
export const Route = createFileRoute('/_layout/projects')({
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
