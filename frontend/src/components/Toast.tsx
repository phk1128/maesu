interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%',
      transform: `translateX(-50%) translateY(${show ? 0 : 10}px)`,
      background: 'rgba(26,26,26,0.92)', color: '#fff',
      padding: '10px 18px', borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      opacity: show ? 1 : 0, pointerEvents: 'none',
      transition: 'all 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 100, whiteSpace: 'nowrap',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    }}>{message}</div>
  );
}
