import { createCanvas, type CanvasRenderingContext2D } from 'canvas';
import sharp from 'sharp';
import readline from 'node:readline';

interface BookInfo {
  title: string;
  author: string;
  backgroundColor: string;
  barcodeContent: string;
}

// 사용자 입력 받기
async function getUserInput(): Promise<BookInfo> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  try {
    const title = await question('책 제목을 입력하세요: ');
    const author = await question('저자명을 입력하세요: ');
    const backgroundColor =
      (await question('표지 색상을 입력하세요 (예: #2c3e50): ')) || '#2c3e50';
    const barcodeContent = await question(
      '바코드에 표시할 내용을 입력하세요: ',
    );

    return { title, author, backgroundColor, barcodeContent };
  } finally {
    rl.close();
  }
}

function generateBarcode(
  ctx: CanvasRenderingContext2D,
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const barWidth = width / content.length;

  ctx.fillStyle = '#000000';
  for (let i = 0; i < content.length; i++) {
    if (i % 2 === 0) {
      // 짝수 인덱스에만 바 그리기
      ctx.fillRect(x + i * barWidth, y, barWidth * 0.8, height);
    }
  }

  // 바코드 숫자 표시
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(content, x + width / 2, y + height + 15);
}

// 텍스트 크기를 동적으로 조절하는 함수
function getOptimalFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxFontSize: number,
): number {
  let fontSize = maxFontSize;

  while (fontSize > 20) {
    // 최소 폰트 크기 20px
    ctx.font = `bold ${fontSize}px Arial`;
    const metrics = ctx.measureText(text);

    if (metrics.width <= maxWidth) {
      return fontSize;
    }
    fontSize -= 2;
  }

  return 20; // 최소 폰트 크기 반환
}

// 전면 표지 생성
function generateFrontCover(bookInfo: BookInfo): Buffer {
  const canvas = createCanvas(600, 800);
  const ctx = canvas.getContext('2d');

  // 배경색
  ctx.fillStyle = bookInfo.backgroundColor;
  ctx.fillRect(0, 0, 600, 800);

  // 제목
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  // 제목을 단어별로 분리
  const words = bookInfo.title.split(' ');
  const maxWidth = 520; // 좌우 여백 40px씩
  const lines: string[] = [];

  // 단어들을 라인별로 나누기
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    // 임시로 큰 폰트로 측정
    ctx.font = 'bold 72px Arial';
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // 각 라인에 대해 최적의 폰트 크기 찾기
  let optimalFontSize = 72; // 시작 폰트 크기
  for (const line of lines) {
    const lineOptimalSize = getOptimalFontSize(ctx, line, maxWidth, 72);
    optimalFontSize = Math.min(optimalFontSize, lineOptimalSize);
  }

  // 제목 그리기
  ctx.font = `bold ${optimalFontSize}px Arial`;
  const lineHeight = optimalFontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = 300 - totalHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    const y = startY + i * lineHeight;
    ctx.fillText(lines[i], 300, y);
  }

  // 저자명
  const authorFontSize = Math.max(20, optimalFontSize * 0.4);
  ctx.font = `${authorFontSize}px Arial`;
  const authorY = startY + totalHeight + 60;
  ctx.fillText(`by ${bookInfo.author}`, 300, authorY);

  return canvas.toBuffer('image/png');
}

// 사이드 표지 생성 (책등)
function generateSpineCover(bookInfo: BookInfo): Buffer {
  const canvas = createCanvas(100, 800);
  const ctx = canvas.getContext('2d');

  // 배경색
  ctx.fillStyle = bookInfo.backgroundColor;
  ctx.fillRect(0, 0, 100, 800);

  // 세로 텍스트 (90도 회전)
  ctx.save();
  ctx.translate(50, 400);
  ctx.rotate(-Math.PI / 2);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  // 제목 폰트 크기 동적 조절 (세로 길이 700px에 맞춤)
  const titleMaxWidth = 700;
  let titleFontSize = 60; // 시작 폰트 크기를 더 크게 조정

  while (titleFontSize > 16) {
    ctx.font = `bold ${titleFontSize}px Arial`;
    const titleMetrics = ctx.measureText(bookInfo.title);

    if (titleMetrics.width <= titleMaxWidth) {
      break;
    }
    titleFontSize -= 2;
  }

  ctx.font = `bold ${titleFontSize}px Arial`;
  ctx.fillText(bookInfo.title, 0, 0);

  ctx.restore();

  return canvas.toBuffer('image/png');
}

// 뒷면 표지 생성
function generateBackCover(bookInfo: BookInfo): Buffer {
  const canvas = createCanvas(600, 800);
  const ctx = canvas.getContext('2d');

  // 배경색
  ctx.fillStyle = bookInfo.backgroundColor;
  ctx.fillRect(0, 0, 600, 800);

  // 책 소개 텍스트
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';

  const description = [
    '이 책은 독자들에게 새로운 시각과',
    '깊이 있는 통찰을 제공합니다.',
    '',
    '저자는 오랜 경험과 연구를 바탕으로',
    '실용적이고 가치 있는 내용을',
    '체계적으로 정리하였습니다.',
  ];

  let y = 100;
  for (const line of description) {
    ctx.fillText(line, 50, y);
    y += 30;
  }

  // 바코드 생성
  generateBarcode(ctx, bookInfo.barcodeContent, 400, 650, 150, 60);

  // 저자 정보
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`저자: ${bookInfo.author}`, 550, 600);

  return canvas.toBuffer('image/png');
}

// 이미지 저장
async function saveImages(bookInfo: BookInfo) {
  const frontCover = generateFrontCover(bookInfo);
  const spineCover = generateSpineCover(bookInfo);
  const backCover = generateBackCover(bookInfo);

  // Sharp를 사용해 최종 이미지 저장
  await Promise.all([
    sharp(frontCover).webp({ quality: 90 }).toFile('./book-cover-front.webp'),

    sharp(spineCover).webp({ quality: 90 }).toFile('./book-cover-spine.webp'),

    sharp(backCover).webp({ quality: 90 }).toFile('./book-cover-back.webp'),
  ]);

  console.log('✅ 전면 표지: book-cover-front.webp');
  console.log('✅ 사이드 표지: book-cover-spine.webp');
  console.log('✅ 뒷면 표지: book-cover-back.webp');
}

// 메인 함수
async function main() {
  console.log('📚 책 표지 생성기');
  console.log('==================');

  try {
    const bookInfo = await getUserInput();

    console.log('\n📝 입력된 정보:');
    console.log(`제목: ${bookInfo.title}`);
    console.log(`저자: ${bookInfo.author}`);
    console.log(`배경색: ${bookInfo.backgroundColor}`);
    console.log(`바코드: ${bookInfo.barcodeContent}`);

    console.log('\n🎨 이미지 생성 중...');
    await saveImages(bookInfo);

    console.log('\n✨ 모든 표지가 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ 오류가 발생했습니다:', error);
  }
}

main();
