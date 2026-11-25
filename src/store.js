import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seed from './data/dashboard.json'

// Every widget has `visible`: true = shown on the dashboard.
const initial = seed.categories.map((c) => ({
  ...c,
  widgets: c.widgets.map((w) => ({ ...w, visible: true })),
}))

export const useDashboard = create(
  persist(
    (set) => ({
      categories: initial,
      search: '',
      setSearch: (search) => set({ search }),
      addWidget: (categoryId, name, text) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, widgets: [...c.widgets, { id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, text, chart: { type: 'text' }, visible: true }] }
              : c
          ),
        })),
      removeWidget: (categoryId, widgetId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === categoryId
              ? { ...c, widgets: c.widgets.map((w) => (w.id === widgetId ? { ...w, visible: false } : w)) }
              : c
          ),
        })),
      // Used by the drawer: sets the full visibility map at once on Confirm.
      applyVisibility: (map) =>
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            widgets: c.widgets.map((w) => (w.id in map ? { ...w, visible: map[w.id] } : w)),
          })),
        })),
      reset: () => set({ categories: initial, search: '' }),
    }),
    { name: 'cnapp-dashboard' }
  )
)
