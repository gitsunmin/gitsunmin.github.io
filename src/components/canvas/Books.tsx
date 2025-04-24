import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { type Mesh, TextureLoader } from 'three';

export type BookTextures = {
  front: string;
  back: string;
  side: string;
  top: string;
  bottom: string;
  pages: string;
};

type Props = {
  id: string;
  position: [number, number, number]; // 초기 위치
  size: [number, number, number]; // 책 크기
  textures: BookTextures;
  isSelected: boolean;
  onClick: () => void;
};

export const Book = ({
  position,
  size,
  textures,
  isSelected,
  onClick,
}: Props) => {
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
            if (
              bookRef.current &&
              (bookRef.current.scale.y < 2 || bookRef.current.scale.z < 2)
            ) {
              bookRef.current.scale.set(
                1,
                bookRef.current.scale.y + 0.1,
                bookRef.current.scale.z + 0.1,
              );
            }
          }, 300);
        }
      } else {
        bookRef.current.scale.set(1, 1, 1);
        bookRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <mesh
      ref={bookRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial attach="material-0" map={frontTexture} />{' '}
      <meshStandardMaterial attach="material-1" map={backTexture} />{' '}
      <meshStandardMaterial attach="material-2" map={topTexture} />{' '}
      <meshStandardMaterial attach="material-3" map={bottomTexture} />{' '}
      <meshStandardMaterial attach="material-4" map={sideTexture} />{' '}
      <meshStandardMaterial attach="material-5" map={pagesTexture} />{' '}
    </mesh>
  );
};
