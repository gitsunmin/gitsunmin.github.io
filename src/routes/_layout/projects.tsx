import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { createFileRoute } from "@tanstack/react-router";
import { BookShelf } from "@/components/canvas/BookShelf";

import DefaultBookCoverTexture from "@/assets/book_cover.webp";
import BookCover1Texture from "@/assets/book_cover1.webp";
import BookTopTexture from "@/assets/book_top.webp";
import BookBottomTexture from "@/assets/book_bottom.webp";
import BookBackTexture from "@/assets/book_back.webp";
export const Route = createFileRoute("/_layout/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Canvas camera={{ position: [5, 5, 10], zoom: 2 }}>
      <ambientLight />
      <directionalLight position={[2, 5, 5]} />
      <BookShelf
        books={[
          {
            id: "1",
            textures: {
              front: DefaultBookCoverTexture,
              back: BookBackTexture,
              side: DefaultBookCoverTexture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: DefaultBookCoverTexture,
            },
          },
          {
            id: "2",
            textures: {
              front: DefaultBookCoverTexture,
              back: BookBackTexture,
              side: DefaultBookCoverTexture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: DefaultBookCoverTexture,
            },
          },
          {
            id: "3",
            textures: {
              front: DefaultBookCoverTexture,
              back: BookBackTexture,
              side: DefaultBookCoverTexture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: DefaultBookCoverTexture,
            },
          },
          {
            id: "4",
            textures: {
              front: DefaultBookCoverTexture,
              back: BookBackTexture,
              side: DefaultBookCoverTexture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: DefaultBookCoverTexture,
            },
          },
          {
            id: "5",
            textures: {
              front: BookCover1Texture,
              back: BookBackTexture,
              side: BookCover1Texture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: BookCover1Texture,
            },
          },
          {
            id: "6",
            textures: {
              front: BookCover1Texture,
              back: BookBackTexture,
              side: BookCover1Texture,
              top: BookTopTexture,
              bottom: BookBottomTexture,
              pages: BookCover1Texture,
            },
          },
        ]}
      />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
