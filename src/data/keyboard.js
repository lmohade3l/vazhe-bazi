/** کلیدهای ویژه‌ی کیبورد. */
export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

/**
 * چیدمان کیبورد فارسی — سه ردیف، از چپ به راست چیده می‌شود.
 */
export const keyboardRows = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
  ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
  [ENTER, 'ظ', 'ط', 'ز', 'ژ', 'ر', 'ذ', 'د', 'پ', 'و', BACKSPACE],
];

/** برچسب فارسی کلیدهای ویژه. */
export const keyLabels = {
  [ENTER]: 'ثبت',
  [BACKSPACE]: '⌫',
};

/** نام قابل خواندن برای صفحه‌خوان‌ها. */
export const keyAriaLabels = {
  [ENTER]: 'ثبت حدس',
  [BACKSPACE]: 'حذف حرف',
};
