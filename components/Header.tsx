export function Header() {
  return (
    <header className="desktop-header">
      <div className="taskbar">
        <div className="start-button">
          <span className="start-icon">🏫</span>
          <span className="start-text">NIFT Jodhpur</span>
        </div>

        <div className="taskbar-center">
          <div className="window-title">College Diary - Orientation 2025</div>
        </div>

        <div className="taskbar-right">
          <div className="system-tray">
            <span className="time">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
