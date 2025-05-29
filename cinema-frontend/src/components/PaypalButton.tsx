"use client"

import { useEffect, useRef } from "react"

interface PayPalButtonProps {
  amount: string
  onSuccess: (details: any) => void
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  const paypalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((window as any).paypal && paypalRef.current) {
      ;(window as any).paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture()
            onSuccess(details)
          },
        })
        .render(paypalRef.current)
    }
  }, [amount, onSuccess])

  return <div ref={paypalRef}></div>
}

export default PayPalButton
