// src/types/index.ts
export type Page = 
  | 'home' 
  | 'gui-hang' 
  | 'tai-xe' 
  | 'nhan-hang' 
  | 'tracking' 
  | 'kho-hub';

export interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  trongLuong: number;
  ghiChu: string;
}