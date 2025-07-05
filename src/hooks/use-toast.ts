
import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_TIMEOUT = 2000 // 2 seconds

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
        action?: React.ReactElement
        variant?: "default" | "destructive"
      }
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<any> & { id: string }
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
  toasts: any[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [],
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: [],
      }

    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: [],
      }

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: [],
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
  action?: React.ReactElement
  cancel?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  className?: string
  onDismiss?: (toast: any) => void
  onAutoClose?: (toast: any) => void
}

function toast({ id: toastId, ...props }: Toast) {
  const id = toastId || genId()

  const update = (props: any) => {}
  const dismiss = () => {}

  // No-op - notifications disabled
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
    dismiss: (toastId?: string) => {},
  }
}

export { useToast, toast }
