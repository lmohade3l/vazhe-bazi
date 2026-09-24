/** کلیدهای ویژه‌ی کیبورد. */
export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

/**
 * چیدمان کیبورد فارسی — سه ردیف، از چپ به راست چیده می‌شود.
 */
export const keyboardRows: string[][] = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
  ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
  [ENTER, 'ظ', 'ط', 'ز', 'ژ', 'ر', 'ذ', 'د', 'پ', 'و', BACKSPACE],
];

/**
 * برچسب فارسی کلیدهای ویژه. برای حروف عادی مقداری ندارد و خودِ حرف نمایش
 * داده می‌شود، برای همین تایپش اجازه‌ی `undefined` می‌دهد.
 */
export const keyLabels: Record<string, string> = {
  [ENTER]: 'ثبت',
  [BACKSPACE]: '⌫',
};

/** نام قابل خواندن برای صفحه‌خوان‌ها. */
export const keyAriaLabels: Record<string, string> = {
  [ENTER]: 'ثبت حدس',
  [BACKSPACE]: 'حذف حرف',
};
