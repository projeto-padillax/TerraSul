"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign } from 'lucide-react'

interface ValueRangeModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRange: { min: string; max: string }
  onRangeChange: (range: { min: string; max: string }) => void
}

export function ValueRangeModal({ isOpen, onClose, selectedRange, onRangeChange }: ValueRangeModalProps) {
  const [tempRange, setTempRange] = useState(selectedRange)

  // Opções de valores pré-definidos (removendo valor vazio)
  const valueOptions = [
    { value: "50000", label: "R$ 50.000" },
    { value: "100000", label: "R$ 100.000" },
    { value: "150000", label: "R$ 150.000" },
    { value: "200000", label: "R$ 200.000" },
    { value: "250000", label: "R$ 250.000" },
    { value: "300000", label: "R$ 300.000" },
    { value: "400000", label: "R$ 400.000" },
    { value: "500000", label: "R$ 500.000" },
    { value: "600000", label: "R$ 600.000" },
    { value: "700000", label: "R$ 700.000" },
    { value: "800000", label: "R$ 800.000" },
    { value: "900000", label: "R$ 900.000" },
    { value: "1000000", label: "+ de R$ 1.000.000" },
  ]

  const handleConfirm = () => {
    console.log(tempRange)
    onRangeChange(tempRange)
    onClose()
  }

  const clearMinValue = () => {
    setTempRange({ ...tempRange, min: "" })
  }

  const clearMaxValue = () => {
    setTempRange({ ...tempRange, max: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Valor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Valor De */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label  htmlFor="valorDe" className="text-sm font-medium text-gray-700">Valor De</label>
              {tempRange.min && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMinValue}
                  className="text-xs text-gray-500 hover:text-gray-700 h-auto p-1"
                >
                  Limpar
                </Button>
              )}
            </div>
            <Select value={tempRange.min || ""} onValueChange={(value) => setTempRange({ ...tempRange, min: value || "" })}>
              <SelectTrigger className="w-full" id="valorDe">
                <SelectValue placeholder="Valor mínimo" />
              </SelectTrigger>
              <SelectContent>
                {valueOptions.map((option) => (
                  <SelectItem key={`min-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor Até */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="valorAte" className="text-sm font-medium text-gray-700">Valor Até</label>
              {tempRange.max && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMaxValue}
                  className="text-xs text-gray-500 hover:text-gray-700 h-auto p-1"
                >
                  Limpar
                </Button>
              )}
            </div>
            <Select value={tempRange.max || ""} onValueChange={(value) => setTempRange({ ...tempRange, max: value || "" })}>
              <SelectTrigger className="w-full" id="valorAte">
                <SelectValue placeholder="Valor máximo" />
              </SelectTrigger>
              <SelectContent>
                {valueOptions.map((option) => (
                  <SelectItem key={`max-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão para limpar tudo */}
          {(tempRange.min || tempRange.max) && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTempRange({ min: "", max: "" })}
                className="text-gray-500 hover:text-gray-700"
              >
                Limpar todos os valores
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 pt-4 border-t">
          <Button onClick={handleConfirm} className="bg-[#4F7DC3] hover:bg-[#0084d7] text-white">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
