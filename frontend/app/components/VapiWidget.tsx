// app/components/VapiWidget.tsx
"use client"

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function VapiWidget() {
  const widgetRef = useRef<HTMLDivElement>(null)
  const originalConsole = useRef<any>({})

  useEffect(() => {
    // Store original console methods
    originalConsole.current = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    }

    // Completely silence all VAPI-related console output
    const silenceVapi = (...args: any[]) => {
      const message = args.join(' ').toLowerCase()
      if (
        message.includes('vapi') ||
        message.includes('meeting') ||
        message.includes('ejection') ||
        message.includes('transport') ||
        message.includes('disconnected') ||
        message.includes('webrtc') ||
        message.includes('socket') ||
        message.includes('rtc') ||
        message.includes('daily') ||
        message.includes('call ended') ||
        message.includes('meeting ended')
      ) {
        return // Silently ignore
      }
      return true // Allow other messages
    }

    console.log = (...args: any[]) => {
      if (silenceVapi(...args)) originalConsole.current.log.apply(console, args)
    }
    
    console.error = (...args: any[]) => {
      if (silenceVapi(...args)) originalConsole.current.error.apply(console, args)
    }
    
    console.warn = (...args: any[]) => {
      if (silenceVapi(...args)) originalConsole.current.warn.apply(console, args)
    }
    
    console.info = (...args: any[]) => {
      if (silenceVapi(...args)) originalConsole.current.info.apply(console, args)
    }
    
    console.debug = (...args: any[]) => {
      if (silenceVapi(...args)) originalConsole.current.debug.apply(console, args)
    }

    return () => {
      // Restore original console methods
      console.log = originalConsole.current.log
      console.error = originalConsole.current.error
      console.warn = originalConsole.current.warn
      console.info = originalConsole.current.info
      console.debug = originalConsole.current.debug
    }
  }, [])

  useEffect(() => {
    // Create widget dynamically
    if (widgetRef.current && !widgetRef.current.hasChildNodes()) {
      const widget = document.createElement('vapi-widget') as HTMLElement & {
        setAttribute: (name: string, value: string) => void
      }
      
      widget.setAttribute('public-key', '97045b0d-a465-4216-9c82-dfa10a14b712')
      widget.setAttribute('assistant-id', '6cd898dd-b762-453f-99a5-977c3a39b715')
      widget.setAttribute('mode', 'voice')
      widget.setAttribute('theme', 'light')
      widget.setAttribute('position', 'bottom-right')
      widget.setAttribute('size', 'compact')
      widget.setAttribute('accent-color', '#2563eb')
      widget.setAttribute('button-base-color', '#2563eb')
      widget.setAttribute('main-label', 'Schedly')
      widget.setAttribute('start-button-text', 'Start')
      widget.setAttribute('end-button-text', 'End')
      widget.setAttribute('show-transcript', 'true')
      
      widgetRef.current.appendChild(widget)
    }
  }, [])

  return (
    <>
      <Script 
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />
      <div ref={widgetRef} />
    </>
  )
}