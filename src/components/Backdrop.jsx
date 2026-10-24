export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__halo" />
      <div className="backdrop__blob backdrop__blob--one" />
      <div className="backdrop__blob backdrop__blob--two" />
      <div className="backdrop__blob backdrop__blob--three" />
    </div>
  )
}
