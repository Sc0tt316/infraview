
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

const TOAST_LIMIT = 5
const TOAST_TIMEOUT = 3000 // 3 seconds
export type ToasterToast = ToastT

type ToasterToastActionElement = React.ReactElement

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: {
        id: string
        title?: React.ReactNode
        description?: React.ReactNode
        action?: ToasterToastActionElement
        variant?: "default" | "destructive"
      }
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast> & { id: string }
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast as unknown as ToasterToast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        sonnerToast.dismiss(toastId)
      } else {
        for (const toast of state.toasts) {
          sonnerToast.dismiss(toast.id)
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || !toastId
            ? {
                ...t,
                dismissible: false,
              }
            : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface Toast {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToasterToastActionElement
  cancel?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  className?: string
  onDismiss?: (toast: ToasterToast) => void
  onAutoClose?: (toast: ToasterToast) => void
}

function toast({ id: toastId, ...props }: Toast) {
  const id = toastId || genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
    },
  })

  // Set auto-dismiss timeout
  if (toastTimeouts.has(id)) {
    clearTimeout(toastTimeouts.get(id))
  }

  toastTimeouts.set(
    id,
    setTimeout(() => {
      dismiss()
    }, props.duration || TOAST_TIMEOUT)
  )

  // Map variant to sonner's supported options
  const sonnerOptions: any = {
    id,
    description: props.description,
    action: props.action,
    cancel: props.cancel,
    onDismiss: props.onDismiss,
    onAutoClose: props.onAutoClose,
    duration: props.duration || TOAST_TIMEOUT,
    className: props.className,
    onClick: () => dismiss(), // Dismiss when clicked
  }
  
  // Only add the type if it's destructive
  if (props.variant === "destructive") {
    sonnerOptions.type = "error"
  }

  // Show toast using sonner
  sonnerToast(props.title as string, sonnerOptions)

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
