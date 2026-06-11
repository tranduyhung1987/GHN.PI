// src/hooks/useCreateShipment.ts
import { useState } from 'react';

const initialForm = {
  loaiDon: 'hoatoc' as 'hoatoc' | 'duongdai',
  nguoiGui: '',
  sdtGui: '',
  diaChiGui: '',
  nguoiNhan: '',
  sdtNhan: '',
  diaChiNhan: '',
  trongLuong: 0,
  dai: 0,
  rong: 0,
  cao: 0,
  ghiChu: '',
  moTaHang: '',
};

export const useCreateShipment = () => {
  const [form, setForm] = useState(initialForm);
  
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [codAmount, setCodAmount] = useState<string>('0');

  // ==================== QUICK FILL HELPERS (Đã chuẩn hóa tên) ====================
  const handleQuickFillSender = () => {
    setForm(prev => ({
      ...prev,
      diaChiGui: '123 Đường XYZ, Quận 1, TP.HCM',
    }));
  };

  const handleQuickFillReceiver = () => {
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

  // ==================== TÍNH TOÁN PHÍ ====================
  const volumeWeight = (form.dai * form.rong * form.cao) / 6000;
  const effectiveWeight = Math.max(form.trongLuong, volumeWeight);
  const baseFee = form.loaiDon === 'hoatoc' ? effectiveWeight * 35000 : effectiveWeight * 22000;
  const shippingFee = Math.round(baseFee + 8000);
  const totalAmount = shippingFee;

  const resetForm = () => {
    setForm(initialForm);
    setPaymentMethod('prepaid');
    setCodAmount('0');
    setIsProcessing(false);
  };

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
    // Đã đổi tên hàm cho nhất quán
    handleQuickFillSender,
    handleQuickFillReceiver,
    handleQuickFillPi,
  };
};