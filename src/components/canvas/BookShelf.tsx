import { useState } from 'react';

import { Book, BookTextures } from '@/components/canvas/Books';

type Props = {
  books: {
    id: string;
    textures: BookTextures;
  }[];
};

export const BookShelf = (props: Props) => {
  const { books: books_ } = props;
  const shelves = 4; // 책꽂이 층 수 (조절 가능)
  const booksPerRow = 5; // 한 층당 책 개수 (조절 가능)
  const bookSpacing = 0.5; // 책 간격
  const shelfHeight = 1.5; // 층 간 높이
  const shelfDepth = 1.2; // 책장의 깊이 (책보다 깊어야 함)
  const bookDepth = 0.9; // 책의 깊이 (책장이 더 깊어야 함)
  const bookHeight = 1.2; // 책의 높이

  const books: {
    id: string;
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
  }[] = books_.map(({ textures }, i) => {
    const shelfIndex = shelves - 1 - Math.floor(i / booksPerRow); // 위에서부터 채우기
    const bookIndex = i % booksPerRow; // 왼쪽부터 채우기

    return {
      id: `book-${shelfIndex}-${bookIndex}`,
      position: [
        (-2.5 + bookIndex) * bookSpacing, // 왼쪽부터 채움
        shelfIndex * shelfHeight - (shelves * shelfHeight) / 2 + bookHeight / 2, // 📌 책이 구분판 위에 정확히 위치
        -0.5, // 책이 책장 안에 들어가도록 위치 조정
      ],
      size: [0.3, bookHeight, bookDepth], // 책 크기
      textures,
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
            -0.5,
          ]} // 📌 책보다 살짝 아래 배치
        >
          <boxGeometry args={[2.7, 0.1, shelfDepth]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
      ))}

      {/* 📖 책 배치 */}
      {books.map((book, index) => (
        <Book
          id={book.id}
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
