import { useState, useEffect, useRef, useCallback } from 'react'
import { useDashboard } from './store'
import { Donut, Bar, Empty } from './Charts'
import './index.css'

function WidgetBody({ w }) {
  const ch = w.chart
  if (ch?.type === 'donut') return <Donut chart={ch} />
  if (ch?.type === 'bar') return <Bar chart={ch} />
  if (ch?.type === 'empty') return <Empty />
  return <p className="text">{w.text}</p>
}

function AddWidgetPanel({ initialTab, onClose }) {
  const { categories, applyVisibility, addWidget } = useDashboard()
  const [tab, setTab] = useState(initialTab || categories[0].id)
  const [vis, setVis] = useState(() =>
    Object.fromEntries(categories.flatMap((c) => c.widgets.map((w) => [w.id, w.visible])))
  )
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [q, setQ] = useState('')
  const cat = categories.find((c) => c.id === tab)
  const panelRef = useRef(null)
  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  const ql = q.trim().toLowerCase()
  const matches = (w) => !ql || w.name.toLowerCase().includes(ql) || w.text.toLowerCase().includes(ql)

  const confirm = () => {
    applyVisibility(vis)
    if (name.trim()) addWidget(tab, name.trim(), text.trim() || 'Random text')
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="panel" ref={panelRef} tabIndex={-1} aria-modal="true" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add Widget">
        <header><span>Add Widget</span><button className="x" aria-label="Close" onClick={onClose}>×</button></header>
        <div className="panel-body">
          <p>Personalise your dashboard by adding the following widget</p>
          <div className="tabs" role="tablist">
            {categories.map((c) => (
              <button key={c.id} role="tab" aria-selected={c.id === tab} className={c.id === tab ? 'tab active' : 'tab'} onClick={() => setTab(c.id)}>{c.tab}</button>
            ))}
          </div>
          <input className="field" aria-label="Search widgets in panel" placeholder="Search widgets" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="list">
            {cat.widgets.filter(matches).map((w) => (
              <label key={w.id} className="check">
                <input type="checkbox" checked={vis[w.id]} onChange={(e) => setVis({ ...vis, [w.id]: e.target.checked })} />
                {w.name}
              </label>
            ))}
            {cat.widgets.filter(matches).length === 0 && <p className="muted">No widgets found.</p>}
          </div>
          <div className="new">
            <h4>Create a new widget in {cat.tab}</h4>
            <input className="field" aria-label="Widget name" placeholder="Widget name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="field" aria-label="Widget text" placeholder="Widget text" rows="3" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        </div>
        <footer>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={confirm}>Confirm</button>
        </footer>
      </aside>
    </div>
  )
}

export default function App() {
  const { categories, search, setSearch, removeWidget, reset } = useDashboard()
  const [panel, setPanel] = useState(null)
  const closePanel = useCallback(() => setPanel(null), [])
  const q = search.trim().toLowerCase()
  const match = (w) => !q || w.name.toLowerCase().includes(q) || w.text.toLowerCase().includes(q)
  const totalShown = categories.reduce((n, c) => n + c.widgets.filter((w) => w.visible && match(w)).length, 0)

  return (
    <div className="page">
      <div className="topbar">
        <div className="crumb">Home &gt; <b>Dashboard V2</b></div>
        <input className="search" type="search" placeholder="Search anything..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search widgets" />
        <div />
      </div>
      <div className="head">
        <h1>CNAPP Dashboard</h1>
        <div className="actions">
          <button className="btn" onClick={() => setPanel(categories[0].id)}>Add Widget +</button>
          <button className="btn" title="Reset dashboard to the default JSON" onClick={reset}>Reset ⟳</button>
        </div>
      </div>

      {q && <p className="muted">{totalShown} widget(s) match "{search}"</p>}

      {categories.map((c) => {
        const shown = c.widgets.filter((w) => w.visible && match(w))
        if (q && shown.length === 0) return null
        return (
          <section key={c.id}>
            <h2>{c.name}</h2>
            <div className="grid">
              {shown.map((w) => (
                <article key={w.id} className="card">
                  <button className="remove" aria-label={`Remove ${w.name}`} onClick={() => removeWidget(c.id, w.id)}>×</button>
                  <h3>{w.name}</h3>
                  <WidgetBody w={w} />
                </article>
              ))}
              {!q && (
                <div className="card add">
                  <button className="btn" onClick={() => setPanel(c.id)}>+ Add Widget</button>
                </div>
              )}
            </div>
          </section>
        )
      })}
      {q && totalShown === 0 && <p className="muted">No widgets match your search.</p>}
      {panel && <AddWidgetPanel initialTab={panel} onClose={closePanel} />}
    </div>
  )
}
