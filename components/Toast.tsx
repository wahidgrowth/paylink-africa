'use client'
import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: { bg: '#10B981', text: '#000', icon: '✓' },
    error: { bg: '#EF4444', text: '#fff', icon: '✕' },
    info: { bg: '#3B82F6', text: '#fff', icon: 'i' },
  }

  const c = colors[type]

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      zIndex: 99999,
      background: '#1A1A1A',
      border: `0.5px solid ${c.bg}40`,
      borderRadius: '12px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      minWidth: '260px',
      maxWidth: '380px',
      pointerEvents: 'none',
    }}>
      <div style={{ width: '24px', height: '24px', background: c.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: c.text }}>{c.icon}</span>
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '500', lineHeight: '1.4' }}>{message}</p>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast(null)
    setTimeout(() => setToast({ message, type }), 50)
  }

  const hideToast = () => setToast(null)

  return { toast, showToast, hideToast }
}