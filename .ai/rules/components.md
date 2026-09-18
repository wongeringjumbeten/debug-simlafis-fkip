---
paths:
    - resources/js/components/dashboard-bar-chart.tsx
---

# Components

## Use DashboardBarChart for vertical bar analytics

Reusable grouped vertical CSS bar chart (no chart lib) for ADM-06-style monthly analytics. Pass `labels` + `series[{key,label,data,barClass}]`; barClass must use design tokens (bg-chart-1..5), never raw hex. Features: nice-number Y axis + gridlines, hover/focus tooltip, clickable legend that hides/shows series (keeps ≥1 visible), overflow-x scroll for 12 months on narrow screens, mount grow-in disabled under motion-reduce, empty/zero placeholder. Reuse in Riwayat/Persetujuan instead of rebuilding charts.
