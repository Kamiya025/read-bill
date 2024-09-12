import {
  Hddt,
  IBillConfidenceScore,
  IBillForCheck,
  IEinvoiceData,
} from "../api/model"

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
export const checkValidate = (data?: IBillForCheck) => {
  return data && data.nbmst && data.khhdon_last && data.shdon && data.tgtttbso
}
export const checkValidateScore = (data?: IBillConfidenceScore) => {
  return (
    data &&
    data.nbmst > 0.9 &&
    data.khhdon > 0.9 &&
    data.shdon > 0.9 &&
    data.tgtttbso > 0.9
  )
}
export function traverseDataSets(
  dataSets: any[],
  tag = "",
  output: Record<
    string,
    {
      value: string
      normalized_value: any
      label: string
      display_name: string
      confidence_score: number
    }
  >
) {
  if (!dataSets) return
  dataSets.forEach(
    ({
      service_label,
      data_set,
      value,
      normalized_value,
      confidence_score,
    }) => {
      const newTag = tag ? `${tag}.${service_label.label}` : service_label.label
      if (data_set) {
        traverseDataSets(data_set, newTag, output)
      } else {
        output[newTag] = {
          value,
          normalized_value,
          label: newTag,
          display_name: service_label.display_name,
          confidence_score,
        }
      }
    }
  )
}
export const convertValueExport = (data: {
  data?: IBillForCheck
  bonus?: IEinvoiceData
}) => {
  return [
    (data.data?.khhdon_first ?? " ") + (data.data?.khhdon_last ?? ""),
    data.data?.shdon ?? "",
    data.data?.tgtttbso ?? "",
    data.data?.nbmst ?? "",
    data.data?.nbten ?? "",
    data.bonus?.hddt?.status?.toString() ?? "",
    getEInvoiceNote(data.bonus?.hddt) ?? "",
    "",
    data.data?.nmten ?? "",
    "",
    "",
    data.bonus?.time ?? "",
  ]
}
export const convertValueOutput = (output: any) => {
  return {
    data: {
      nbmst: output["supplier_data.tax_code"]?.value ?? "",
      khhdon_first: output["invoice_data.serial_no"]?.value?.charAt(0) ?? "",
      khhdon_last: output["invoice_data.serial_no"]?.value?.substring(1) ?? "",
      shdon: output["invoice_data.invoice_no"]?.value ?? "",
      tgtttbso: output["invoice_data.total_amount"]?.value
        ? String(Math.floor(Number(output["invoice_data.total_amount"]?.value)))
        : String(Math.floor(Number(output["invoice_data.sub_total"]?.value))),
      nbten: output["supplier_data.supplier"]?.value ?? "",
      nmten:
        output["purchaser_data.purchaser_name"]?.value ??
        output["purchaser_data.buyer_name"]?.value ??
        "",
    },
    score: {
      nbmst: output["supplier_data.tax_code"]?.confidence_score ?? 0,
      khhdon: output["invoice_data.serial_no"]?.confidence_score ?? 0,
      shdon: output["invoice_data.invoice_no"]?.confidence_score ?? 0,
      tgtttbso: output["invoice_data.total_amount"]?.value
        ? output["invoice_data.total_amount"]?.confidence_score ?? 0
        : output["invoice_data.sub_total"]?.confidence_score ?? 0,
    },
  }
}
