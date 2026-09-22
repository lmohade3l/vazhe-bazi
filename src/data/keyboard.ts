export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

export const keyboardRows = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
  ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
  [ENTER, 'ظ', 'ط', 'ز', 'ژ', 'ر', 'ذ', 'د', 'پ', 'و', BACKSPACE],
];

export const keyLabels = {
  [ENTER]: 'ثبت',
  [BACKSPACE]: '⌫',
};

export const keyAriaLabels = {
  [ENTER]: 'ثبت حدس',
  [BACKSPACE]: 'حذف حرف',
};
