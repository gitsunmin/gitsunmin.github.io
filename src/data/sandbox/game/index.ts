
/**
 * * Game Content의 title
 */
export const GAME_CONTENT_TITLE: Record<GameContentId, GameContentTitle> = {
    FLASH_CARD: '플래시 카드',
};


/**
 * * Game의 Contents를 정의하는 Array
 */
export const GAME_CONTENTS: GameContent[] = [
    {
        id: 'FLASH_CARD',
        title: '플래시 카드',
        url: '/sandbox/game/flash-card',
    }
];