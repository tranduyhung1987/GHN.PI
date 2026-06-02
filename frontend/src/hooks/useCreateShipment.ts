import { useState } from 'react';

const initialForm = {
  loaiDon: 'hoatoc' as 'hoatoc' | 'duongdai',
  nguoiGui: '',
  sdtGui: '',
  diaChiGui: '',
  nguoiNhan: '',
  sdtNhan: '',
  diaChiNhan: '',
  trongLuong: 0, // no forced default - user enters real package weight
  dai: 0,        // no forced default - user enters real dimensions
  rong: 0,
  cao: 0,
  ghiChu: '',
  moTaHang: '',  // Mô tả hàng hóa - thực tế GHN cần để tra cứu, khiếu nại
};

export const useCreateShipment = () => {
  const [form, setForm] = useState(initialForm);
  
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [codAmount, setCodAmount] = useState<string>('0');

  // Demo quick fills kept for dev/testing (not used in main UI - page uses auto-prefill + copy + danh bạ)
  const handleQuickFillSeller = () => {
    setForm(prev => ({
      ...prev,
      diaChiGui: '123 Đường XYZ, Quận 1, TP.HCM',
    }));
  };

  const handleQuickFillBuyer = () => {
    setForm(prev => ({
      ...prev,
      nguoiNhan: 'Người nhận mẫu',
      sdtNhan: '0900000000',
      diaChiNhan: '123 Đường ABC, Quận XYZ, TP.HCM',
    }));
  };

  const handleQuickFillPi = () => {
    setForm(prev => ({
      ...prev,
      nguoiNhan: 'Thanh Pi User',
      sdtNhan: '0987654321',
      diaChiNhan: 'Địa chỉ ví Pi - Quận 7, TP.HCM',
    }));
  };

  // Logic tính toán phí (thực tế GHN phức tạp hơn: zone, loại hàng, COD fee, etc. - ở đây đơn giản hóa)
  // Thêm yếu tố thể tích nếu dims lớn (volume weight)
  const volumeWeight = (form.dai * form.rong * form.cao) / 6000; // common divisor
  const effectiveWeight = Math.max(form.trongLuong, volumeWeight);
  const baseFee = form.loaiDon === 'hoatoc' ? effectiveWeight * 35000 : effectiveWeight * 22000;
  const shippingFee = Math.round(baseFee + 8000);
  const totalAmount = shippingFee;

  // Reset toàn bộ form (dùng sau success / khi cần)
  const resetForm = () => {
    setForm(initialForm);
    setPaymentMethod('prepaid');
    setCodAmount('0');
    setIsProcessing(false);
  };

  // handleSubmit này chỉ dùng cho test nhanh. 
  // Trang CreateShipmentPage sẽ override bằng logic thật (Pi Payment + AppController)
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const orderData = { 
        ...form, 
        paymentMethod, 
        codAmount: paymentMethod === 'cod' ? codAmount : '0', 
        totalAmount,
        moTaHang: form.moTaHang || 'Không mô tả' 
      };
      console.log("[useCreateShipment] Test submit:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    form, 
    setForm, 
    paymentMethod, 
    setPaymentMethod, 
    codAmount, 
    setCodAmount, 
    handleSubmit, 
    shippingFee, 
    effectiveWeight,
    volumeWeight,
    isProcessing, 
    totalAmount, 
    resetForm,
    handleQuickFillSeller,
    handleQuickFillBuyer,
    handleQuickFillPi,
    // moTaHang is inside form now
  };
};