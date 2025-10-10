export const enum KEYS {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  O = 'O',
  R = 'R',
  T = 'T',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5',
}

interface HotkeyItem {
  type: string
  children: {
    label: string
    value?: string
  }[] 
}

export const HOTKEY_DOC: HotkeyItem[] = [
  {
    type: '通用',
    children: [
      { label: '剪下', value: 'Ctrl + X' },
      { label: '複製', value: 'Ctrl + C' },
      { label: '貼上', value: 'Ctrl + V' },
      { label: '貼上為純文字', value: 'Ctrl + Shift + V' },
      { label: '快速複製貼上', value: 'Ctrl + D' },
      { label: '全選', value: 'Ctrl + A' },
      { label: '復原', value: 'Ctrl + Z' },
      { label: '重做', value: 'Ctrl + Y' },
      { label: '刪除', value: 'Delete / Backspace' },
      { label: '多選', value: '按住 Ctrl 或 Shift' },
      { label: '開啟搜尋取代', value: 'Ctrl + F' },
      { label: '列印', value: 'Ctrl + P' },
      { label: '關閉視窗', value: 'ESC' },
    ],
  },
  {
    type: '投影片播放',
    children: [
      { label: '從頭開始播放投影片', value: 'F5' },
      { label: '從目前頁面開始播放投影片', value: 'Shift + F5' },
      { label: '切換到上一頁', value: '↑ / ← / PgUp' },
      { label: '切換到下一頁', value: '↓ / → / PgDn' },
      { label: '切換到下一頁', value: 'Enter / 空白鍵' },
      { label: '結束播放', value: 'ESC' },
    ],
  },
  {
    type: '投影片編輯',
    children: [
      { label: '新增投影片', value: 'Enter' },
      { label: '移動畫布', value: 'Space + 滑鼠拖曳' },
      { label: '縮放畫布', value: 'Ctrl + 滾輪' },
      { label: '放大畫布', value: 'Ctrl + =' },
      { label: '縮小畫布', value: 'Ctrl + -' },
      { label: '使畫布符合目前螢幕', value: 'Ctrl + 0' },
      { label: '上一頁（未選取元素）', value: '↑' },
      { label: '下一頁（未選取元素）', value: '↓' },
      { label: '上一頁', value: '滑鼠往上滾動 / PgUp' },
      { label: '下一頁', value: '滑鼠往下滾動 / PgDn' },
      { label: '快速建立文字框', value: '雙擊空白處 / T' },
      { label: '快速建立矩形', value: 'R' },
      { label: '快速建立圓形', value: 'O' },
      { label: '快速建立線條', value: 'L' },
      { label: '退出繪製模式', value: '滑鼠右鍵' },
    ],
  },
  {
    type: '元件操作',
    children: [
      { label: '移動', value: '↑ / ← / ↓ / →' },
      { label: '鎖定', value: 'Ctrl + L' },
      { label: '群組', value: 'Ctrl + G' },
      { label: '取消群組', value: 'Ctrl + Shift + G' },
      { label: '移至最上層', value: 'Alt + F' },
      { label: '移至最下層', value: 'Alt + B' },
      { label: '鎖定寬高比例', value: '按住 Ctrl 或 Shift' },
      { label: '建立水平／垂直線條', value: '按住 Ctrl 或 Shift' },
      { label: '切換焦點元件', value: 'Tab' },
      { label: '確認圖片裁切', value: 'Enter' },
      { label: '完成自訂形狀繪製', value: 'Enter' },
    ],
  },
  {
    type: '表格編輯',
    children: [
      { label: '跳至下一個儲存格', value: 'Tab' },
      { label: '移動焦點儲存格', value: '↑ / ← / ↓ / →' },
      { label: '在上方插入欄', value: 'Ctrl + ↑' },
      { label: '在下方插入欄', value: 'Ctrl + ↓' },
      { label: '在左側插入列', value: 'Ctrl + ←' },
      { label: '在右側插入列', value: 'Ctrl + →' },
    ],
  },
  {
    type: '圖表資料編輯',
    children: [
      { label: '跳至下一列', value: 'Enter' },
    ],
  },
  {
    type: '文字編輯',
    children: [
      { label: '加粗', value: 'Ctrl + B' },
      { label: '斜體', value: 'Ctrl + I' },
      { label: '底線', value: 'Ctrl + U' },
      { label: '行內程式碼', value: 'Ctrl + E' },
      { label: '上標', value: 'Ctrl + ;' },
      { label: '下標', value: `Ctrl + '` },
      { label: '選取段落', value: `ESC` },
    ],
  },
  {
    type: '其他快捷操作',
    children: [
      { label: '插入圖片 - 貼上系統剪貼簿中的圖片' },
      { label: '插入圖片 - 將本機圖片拖曳到畫布中' },
      { label: '插入圖片 - 在畫布中貼上 SVG 程式碼' },
      { label: '插入圖片 - 貼上來自 pexels 的圖片連結' },
      { label: '插入文字 - 貼上系統剪貼簿中的文字' },
      { label: '插入文字 - 將外部選取的文字拖曳到畫布中' },
      { label: '文字編輯 - 支援 markdown 語法建立清單與引用' },
    ],
  },

]