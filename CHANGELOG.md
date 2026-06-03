# 📜 Changelog - GHN.PI

Tất cả thay đổi đáng chú ý của dự án GHN.PI (frontend chính cho Pi Browser Testnet).

---

## [Unreleased] / 2026

### Added
- **Category 1 docs update**: Generalize all remaining personal attributions across root docs for true community focus.
  - Cleaned prose, footers, contacts in README.md, FLOWS.md, CONTRIBUTING.md, LICENSE.md, doc/development.md.
  - Badges kept functional (pointing to canonical GitHub repo).
- Enhanced [CONTRIBUTING.md](../CONTRIBUTING.md): Added detailed "Quy tắc Code (Rất quan trọng)" section covering:
  - "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN" rule (only logic/functional changes).
  - constants.ts as single source of truth for 6 roles.
  - Frontend-first development, test requirements, Pi Testnet practices, Dev Role Switcher usage.
- New [CHANGELOG.md](../CHANGELOG.md) (this file).
- GitHub issue & PR templates in `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md` for better contribution process.

### Changed
- Root docs now consistently use "Made with ❤️ for the Pi Network community" and generic support instructions.
- Minor formatting and duplication cleanup in CONTRIBUTING.md.

### Notes
- This batch was pure documentation & community polish (no src/ or style changes).
- See previous commits for full feature history (6 immutable roles, live fee + COD, Danh bạ CRUD, Driver pipeline + QR + map sim, Order/Tracking role-aware, Profile restructure, etc.).

---

## Previous Releases (summary highlights)

- **Core features stabilized**: 6 roles (guest/sender/driver/warehouse/receiver/admin) with constants.ts as single source, role-specific Home/BottomNav/Profile/Register + guards.
- **Logistics flows**: CreateShipment with full Danh bạ (CRUD + modal + copy + prefill), live useMemo shipping fee (volume/weight/COD/khaiGia + "Thu hộ COD" line), OrderPage (sender history + driver "LỊCH SỬ GIAO" distinction), Tracking (journey timeline + ?view=map for driver sim).
- **Driver & Warehouse**: Full DriverPage (5 tabs, status pipeline, COD, QR scanner with html5-qrcode), WarehousePage (tabs + QR).
- **Pi integration**: Real SDK (when on minepi/pibrowser) + robust Mock for dev, incomplete payments route, AuthContext with VITE_ADMIN_USERNAMES.
- **Quality & DevEx (3-4-5)**: Added vitest + 2 test suites + `.github/workflows/test.yml`, basic PWA manifest + theme-color, basic dark mode support (ThemeContext + CSS), real AdminPage with stats, camera permissions fix in _headers, generalized all personal refs in frontend docs, updated FLOWS/development.md/backend alignment.
- **Strict rules**: "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN" enforced on all visual elements; containment fixes for Pi Browser viewport.
- **Deploy**: Cloudflare Pages + GitHub Actions (frontend/dist), localStorage primary + optional Firebase.

**Made with ❤️ for the Pi Network community** • Testnet-ready on Pi Browser.

---

For full history see Git commits.
