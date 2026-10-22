import { Toaster, ToastBar } from 'react-hot-toast'

export function FeedbackToaster() {
  return (
    <Toaster
      position="bottom-center"
      containerStyle={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
      toastOptions={{
        duration: 3000,
        removeDelay: 200,
        ariaProps: { role: 'status', 'aria-live': 'polite' },
        className: 'cart-feedback-toast',
      }}
    >
      {(notification) => (
        <ToastBar
          toast={notification}
          position="bottom-center"
          style={{
            width: 384,
            maxWidth: '100%',
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 14px',
            pointerEvents: 'none',
            opacity: notification.visible ? 1 : 0,
            animation: `${notification.visible ? 'cart-toast-enter 160ms ease-out' : 'cart-toast-exit 120ms ease-in'} both`,
          }}
        />
      )}
    </Toaster>
  )
}
