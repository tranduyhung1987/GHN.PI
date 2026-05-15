import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vite'] },
  
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  {
    rules: {
      // ================== TẮT LỖI VÀNG ==================
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'prefer-const': 'off',
      'no-undef': 'off',
      // ================================================
    }
  }
);