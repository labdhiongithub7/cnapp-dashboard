export function Donut({ chart }) {
  const total = chart.items.reduce((a, i) => a + i.value, 0)
  const r = 50, c = 2 * Math.PI * r
  const sum = chart.items.reduce((a, i) => a + i.value, 0)
  let offset = 0
  return (
    <div className="chart-row">
      <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label={`${total} ${chart.label}`}>
        {chart.items.map((i) => {
          const len = (i.value / sum) * c
          const el = (
            <circle key={i.label} cx="70" cy="70" r={r} fill="none" stroke={i.color} strokeWidth="20"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
          )
          offset += len
          return el
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="20" fontWeight="700">{total}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#555">{chart.label}</text>
      </svg>
      <Legend items={chart.items} />
    </div>
  )
}

function Legend({ items }) {
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.label}><span className="dot" style={{ background: i.color }} />{i.label}</li>
      ))}
    </ul>
  )
}

export function Bar({ chart }) {
  const total = chart.items.reduce((a, i) => a + i.value, 0)
  const sum = chart.items.reduce((a, i) => a + i.value, 0)
  return (
    <div>
      <p className="bar-total"><b>{total}</b> {chart.label}</p>
      <div className="bar">
        {chart.items.map((i) => (
          <span key={i.label} style={{ width: `${(i.value / sum) * 100}%`, background: i.color }} />
        ))}
      </div>
      <Legend items={chart.items} />
    </div>
  )
}

export function Empty() {
  return (
    <div className="empty">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#cfd4dc"><rect x="6" y="28" width="7" height="14" /><rect x="17" y="18" width="7" height="24" /><rect x="28" y="10" width="7" height="32" /></svg>
      <p>No Graph data available!</p>
    </div>
  )
}
