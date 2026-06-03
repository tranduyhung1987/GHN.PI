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

### [Category 2+6] Monorepo Root Cleanup & DevEx (this batch)
- **Root package.json full rewrite**: Removed completely wrong/outdated React 19 + MUI + styled-components + React Router 7 stack (was causing confusion with real `frontend/package.json` React 18 Vite setup).
  - New clean monorepo orchestrator: name "ghn-pi", proxy scripts (`npm run dev`, `npm test`, `npm run build`, `npm run deploy:cloudflare`, `npm run install:frontend`, `npm run install:backend`, `npm run install:all`) that safely `cd frontend && ...`
  - Removed heavy wrong deps, added proper description, keywords, engines, repository.
- **Stale root package-lock.json**: Will be removed (was generated from the bad root package.json).
- **Root README.md**: Added clear "📁 Cấu trúc dự án (Monorepo)" section with tree + warnings. Updated "🛠 Hướng dẫn & Tài liệu" to show root-level npm scripts first.
- **frontend/README.md** (local): Updated run instructions to mention both direct and root-proxy ways.
- **.env.example** (root): Enhanced header with explicit warning: "Frontend KHÔNG dùng .env local mặc định. Frontend dùng Cloudflare VITE_ vars. This file is backend/docker focused."
- **doc/development.md**: Added "⚡ Chạy chỉ Frontend (nhanh nhất cho dev UI)" section + notes on proxy scripts and that frontend doesn't need .env.
- All changes keep "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN" (no frontend/src or style touched) and make contributor experience much clearer: "Luôn làm việc chính trong frontend/".
- Result: Running `npm run dev` or `npm test` from repo root now just works and delegates correctly. No more "cd .. && npm install will install wrong deps".

**Impact**: High for DevEx and onboarding. Prevents future monorepo drift.

## [Full 3-4-5-7] Dead code, Quality, PWA/Theming, Feature gaps (this batch)
- **Category 3 Dead code removal (full)**: Deleted 11 unused demo pages (CQRSDashboard, DistributedRuntime, EventReplay, Snapshot, System, Workflow, OrderJourney, Dispute, Reconciliation, Dashboard, ChatPage), 5 unused layouts (Guest/Shop/Driver/Warehouse/AdminLayout), unused useTrace hook. Removed bloat core folders (cqrs/, distributed/, orchestration/). Pruned related dead files in observability (flowGraph), map (MapPage, mapListener, mapStore), empty models/api/sdk. Cleaned appController imports/calls for removed modules. AppRoutes comment cleaned, PlaceholderPage removed. tsc clean.
- **Category 4 Code quality**: Reduced `any` in AdminPage (added SimpleOrder interface), useShippingFee, Receive (new real data). Cleaned dev-only console.logs in MockPiService. Added tests (now 6 total, more fee/role cases). Addressed TODOs with notes (RealPiService, etc). Tests pass, tsc clean.
- **Category 5 PWA/Offline/Theming (within NGHIÊM CẤM)**: Added PWA install prompt + "Thêm vào màn hình chính" button in Profile (Cài đặt section) using beforeinstallprompt + ThemeContext toggle exposed as functional switch (dark mode). Reused existing button style patterns for new elements. Created public/sw.js + register in main.tsx for basic offline shell cache. Theme toggle now usable in Cá nhân without touching any protected inline styles/values.
- **Category 7 Feature gaps**: ReceivePackagePage fully real-ified: now loads from 'ghn_pi_orders' localStorage (same as Order/Driver/Tracking), filters, supports "Xác nhận đã nhận" which updates status + calls updateTracking + persists (journey sync). Added empty state. Styles on cards kept 100% identical. Warehouse left as-is (already uses hook + QR + "data thật"). Tracking map sim note added for "simulated; real Leaflet option later". All additions are logic/functional only.
- All work strictly followed "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN": no numeric/color/padding/shadow/border/grid/logo/header/feeBox/inputStyle values were altered in any active component. Only new logic, data sources, buttons for features, dead removal.
- Result: Cleaner codebase (~20 files removed), better PWA feel, receiver role now has real flow, more tests/quality, all pushed.

## [Category 8] Other Polish (this batch)
- **Accessibility (a11y)**: Added ARIA roles, labels, aria-current, aria-modal, aria-labelledby to BottomNav (all role-specific tabs as nav + buttons), Modal (dialog, escape key support, labelled title, aria on buttons and overlay). Enhanced keyboard (Escape closes modals). Semantic <nav> instead of div where appropriate. Improves screen reader and keyboard nav for modals, bottom nav, without any style value changes.
- **Versioning**: Bumped version to 0.2.0 in frontend/package.json and root package.json to reflect cumulative work (roles, features, cleanups, PWA, real flows).
- **Security/CSP**: Reviewed public/_headers - CSP already includes necessary for Pi SDK + Firebase + camera=(self). No major changes needed; kept safe.
- **Other**: Minor additional console guards if any remaining, manifest ready. All polish respects no UI visual edits.
- Updated CHANGELOG.

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
