import { useState, useEffect, useMemo } from 'react';

// Provinces for realistic selector (major cities + common for GHN test)
export const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Hải Dương', 'Bắc Ninh', 'Quảng Ninh', 'Nghệ An', 'Thanh Hóa',
  'Khánh Hòa', 'Lâm Đồng', 'Bình Dương', 'Đồng Nai', 'Long An',
  'Tiền Giang', 'An Giang', 'Kiên Giang', 'Bà Rịa - Vũng Tàu', 'Khác'
];

export interface FeeForm {
  tinhGui: string;
  quanGui: string;   // district level for more realism
  tinhNhan: string;
  quanNhan: string;
  khoiLuong: number; // kg
  dai: number;       // cm
  rong: number;
  cao: number;
  loaiDichVu: 'hoatoc' | 'tietkiem' | 'duongdai';
  codAmount: number; // COD value if any
  khaiGia: number;   // declared value for insurance
}

export interface FeeResult {
  cuocCoBan: number;
  cuocTheTich: number;
  phuPhiCOD: number;
  phuPhiKhaiGia: number;
  tongCong: number;
  thoiGian: string;
  ghiChu: string;
  effectiveWeight: number;
  // For displaying the actual COD collection amount in result
  codAmount: number;
  khaiGia: number;
}

const STORAGE_HISTORY = 'feeCalcHistory';
const MAX_HISTORY = 5;

export const useShippingFee = () => {
  const [form, setForm] = useState<FeeForm>({
    tinhGui: 'Hà Nội',
    quanGui: 'Quận Hoàn Kiếm',
    tinhNhan: 'TP. Hồ Chí Minh',
    quanNhan: 'Quận 1',
    khoiLuong: 0,   // start empty - user enters real weight
    dai: 0,         // start empty - user enters real dimensions
    rong: 0,
    cao: 0,
    loaiDichVu: 'hoatoc',
    codAmount: 0,
    khaiGia: 0,
  });

  const [calculating, setCalculating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load history + prefill sender from mySenderInfo (consistent with Create form)
  useEffect(() => {
    // history
    try {
      const h = localStorage.getItem(STORAGE_HISTORY);
      if (h) setHistory(JSON.parse(h));
    } catch {}

    // prefill sender address if available (from previous form use)
    try {
      const mySender = localStorage.getItem('mySenderInfo');
      if (mySender) {
        const s = JSON.parse(mySender);
        if (s.diaChiGui) {
          // crude parse for demo: first word as province guess
          const parts = s.diaChiGui.split(',').map((p: string) => p.trim());
          const guessedProvince = parts[parts.length - 1] || 'Hà Nội';
          const matched = PROVINCES.find(p => guessedProvince.toLowerCase().includes(p.toLowerCase().slice(0, 4)));
          setForm(prev => ({
            ...prev,
            tinhGui: matched || prev.tinhGui,
            quanGui: parts[parts.length - 2] || prev.quanGui,
          }));
        }
      }
    } catch {}
  }, []);

  // Core realistic GHN-like calculator (improved from CreateShipment logic)
  // - Volume weight LxWxH / 6000
  // - Zone factor (same province cheaper, major cities, inter higher)
  // - Service multiplier
  // - COD ~1% min fee, insurance 0.5%
  // - + fixed handling like real
  const computeDetailedFee = (f: FeeForm): FeeResult => {
    const volWeight = (f.dai * f.rong * f.cao) / 6000;
    const effectiveWeight = Math.max(f.khoiLuong, volWeight);

    const isExpress = f.loaiDichVu === 'hoatoc';
    const isTietKiem = f.loaiDichVu === 'tietkiem';

    // Base rate per effective kg (VND-like units shown as Pi for app)
    let baseRate = isExpress ? 35000 : (isTietKiem ? 18000 : 22000);
    let cuocCoBan = effectiveWeight * baseRate;

    // Zone adjustment (real GHN has zones)
    const sameProvince = f.tinhGui === f.tinhNhan;
    const majorCities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng'];
    const bothMajor = majorCities.includes(f.tinhGui) && majorCities.includes(f.tinhNhan);

    if (sameProvince) {
      cuocCoBan *= 0.65; // intra-city much cheaper
    } else if (bothMajor) {
      cuocCoBan *= 0.9;
    } else {
      cuocCoBan *= 1.25; // inter-province / remote
    }

    // Minimums
    const minFee = isExpress ? 28000 : 16000;
    cuocCoBan = Math.max(Math.round(cuocCoBan), minFee);

    const cuocTheTich = Math.round(volWeight * baseRate * (sameProvince ? 0.6 : 1.1));

    // COD surcharge (realistic)
    let phuPhiCOD = 0;
    if (f.codAmount > 0) {
      phuPhiCOD = Math.max(5000, Math.round(f.codAmount * 0.008)); // ~0.8% min 5k
    }

    // Insurance / khai gia
    let phuPhiKhaiGia = 0;
    if (f.khaiGia > 0) {
      phuPhiKhaiGia = Math.round(f.khaiGia * 0.0045); // 0.45%
    }

    // Fixed handling / fuel / etc (like +8000 in form)
    const phuPhiKhac = 8000;

    const tongCong = Math.round(cuocCoBan + phuPhiCOD + phuPhiKhaiGia + phuPhiKhac);

    // Time estimate
    let thoiGian = '2-4 ngày';
    if (isExpress) thoiGian = sameProvince ? '4-8 giờ' : '1-2 ngày';
    else if (isTietKiem) thoiGian = '3-5 ngày';

    const ghiChu = sameProvince 
      ? 'Nội tỉnh: giá ưu đãi' 
      : 'Liên tỉnh: có thể phát sinh phí vùng sâu';

    return {
      cuocCoBan: Math.round(cuocCoBan),
      cuocTheTich,
      phuPhiCOD,
      phuPhiKhaiGia,
      tongCong,
      thoiGian,
      ghiChu,
      effectiveWeight: parseFloat(effectiveWeight.toFixed(2)),
      codAmount: f.codAmount || 0,
      khaiGia: f.khaiGia || 0,
    };
  };

  // === LIVE RESULT via useMemo (always up-to-date when any input changes) ===
  // This ensures real-time update for weight, dims, COD, insurance, service, zone etc.
  // No setState needed, derived value.
  const ketQua = useMemo(() => {
    const isValid =
      form.khoiLuong > 0 &&
      form.dai > 0 &&
      form.rong > 0 &&
      form.cao > 0;

    if (isValid) {
      return computeDetailedFee(form);
    }
    return null;
  }, [
    form.khoiLuong,
    form.dai,
    form.rong,
    form.cao,
    form.loaiDichVu,
    form.codAmount,
    form.khaiGia,
    form.tinhGui,
    form.tinhNhan,
    form.quanGui,
    form.quanNhan,
  ]);

  const calculateFee = () => {
    // Explicit "Lưu vào lịch sử" action. The ketQua (useMemo) is already live-updating.
    setCalculating(true);

    setTimeout(() => {
      // Use current ketQua if available, else compute
      const res = ketQua || computeDetailedFee(form);

      // Save to history ONLY on explicit button press (prevents history spam on typing)
      const entry = {
        id: Date.now(),
        form: { ...form },
        result: res,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      const newHistory = [entry, ...history].slice(0, MAX_HISTORY);
      setHistory(newHistory);
      try {
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(newHistory));
      } catch {}

      setCalculating(false);
    }, 300); // short feedback delay for button
  };

  const loadFromHistory = (entry: any) => {
    if (entry.form) {
      setForm(entry.form);
      // ketQua will auto-compute via useMemo when form updates
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_HISTORY);
  };

  // Helper to apply this estimate to shipment creation
  const applyToCreateShipment = () => {
    // Save receiver if present in form (user can have filled)
    if (form.tinhNhan || form.quanNhan) {
      const lastRec = {
        nguoiNhan: '',
        sdtNhan: '',
        diaChiNhan: `${form.quanNhan}, ${form.tinhNhan}`,
      };
      localStorage.setItem('lastReceiverInfo', JSON.stringify(lastRec));
    }
    // Save the fee result for prefill in create if wanted
    if (ketQua) {
      localStorage.setItem('lastFeeEstimate', JSON.stringify({
        tong: ketQua.tongCong,
        loaiDichVu: form.loaiDichVu,
        khoiLuong: form.khoiLuong,
      }));
    }
  };

  return {
    form,
    setForm,
    ketQua,
    calculating,
    calculateFee,
    history,
    loadFromHistory,
    clearHistory,
    applyToCreateShipment,
    PROVINCES,
    computeDetailedFee, // exposed for tests if needed
  };
};