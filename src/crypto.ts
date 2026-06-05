/**
 * Safety utilities to encode and decode Arabic and UTF-8 text for the gift action URL.
 */

export interface GiftPayload {
  name: string;
  msg: string;
  theme?: string;
  music?: string;
  boxStyle?: string;
}

export const encodeData = (name: string, msg: string, theme: string = 'default', boxStyle: string = 'classic'): string => {
  const jsonString = JSON.stringify({ name, msg, theme, boxStyle });
  return btoa(
    encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
};

export const decodeData = (str: string): GiftPayload | null => {
  try {
    const decodedBinary = atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');
    return JSON.parse(decodeURIComponent(decodedBinary)) as GiftPayload;
  } catch (error) {
    console.error('Decoding failed:', error);
    return null; // Protect the site from crashing if the link was corrupted
  }
};
