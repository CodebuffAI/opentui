import type { PasteEvent } from "@opentui/core"
import { useEffect } from "react"
import { useAppContext } from "../components/app"
import { useEvent } from "./use-event"

export const usePaste = (handler: (event: PasteEvent) => void) => {
  const { keyHandler } = useAppContext()
  const stableHandler = useEvent(handler)

  useEffect(() => {
    keyHandler?.on("paste", stableHandler)

    return () => {
      keyHandler?.off("paste", stableHandler)
    }
  }, [keyHandler, stableHandler])
}
