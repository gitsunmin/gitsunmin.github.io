
/**
 * * sandbox 메뉴의 Game id 들을 정의한 type
 */
type GameContentId = 'FLASH_CARD';

/**
 * * sandbox 메뉴의 Game Title 들을 정의한 type
 */
type GameContentTitle = '플래시 카드';

/**
 * * sandbox 메뉴의 Game URL 들을 정의한 type
 */
type GameContentUrl = '/sandbox/game/flash-card';

interface GameContent {
    id: GameContentId;
    title: GameContentTitle;
    url: GameContentUrl;
};
