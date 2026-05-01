"use client";
// Inline script that runs before paint to apply persisted mode and avoid FOUC.
export function ThemeBootstrap() {
  const code = `try { var m = localStorage.getItem('em.mode'); if (m === 'light' || m === 'dark') { document.documentElement.dataset.mode = m; } } catch (e) {}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
