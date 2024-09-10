import { Hddt } from "../api/model"

export function covertCode(code: number | undefined, status?: number) {
  if (code === 0) return "Hóa đơn không tồn tại"
  switch (status) {
    case 0:
      return "Hóa đơn không tồn tại"
    case 1:
      return "Hóa đơn mới"
    case 2:
      return "Hóa đơn thay thế"
    case 3:
      return "Hóa đơn điều chỉnh"
    case 4:
      return "Hóa đơn đã bị thay thế"
    case 5:
      return "Hóa đơn đã bị điều chỉnh"
    case 6:
      return "Hóa đơn đã bị hủy"
  }
}
export function getEInvoiceNote(hddt: Hddt | undefined): string {
  if (!hddt) return ""

  const { code, status, desc, reason, refInvoice } = hddt

  if (code === 0) return "Hóa đơn không tồn tại"

  let retMsg = ""
  switch (status) {
    case 0:
      return "Hóa đơn không tồn tại"
    case 1:
      return "Hóa đơn hợp lệ"
    case 6:
      return "Hóa đơn đã bị hủy"
    case 2:
    case 3:
    case 4:
    case 5:
      retMsg = desc || ""
      break
    default:
      return ""
  }

  if (reason) {
    retMsg += `\nLý do: ${reason}`
  }

  const ref = refInvoice?.[0]
  if (ref) {
    const { EInvoiceNo, EInvoiceCode, EInvoiceNoCode } = ref
    retMsg += `\nHóa đơn liên quan:\nSố hóa đơn: ${EInvoiceNo}\nKý hiệu hóa đơn: ${EInvoiceNoCode}${EInvoiceCode}`
  }
  return retMsg
}
