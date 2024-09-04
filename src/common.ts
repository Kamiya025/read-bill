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
