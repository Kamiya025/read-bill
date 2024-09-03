import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import ExcelJS from "exceljs"
import { IBillForCheck, IRootBillObject, IUploadResponse } from "./api/model"
import uploadApi from "./api/upload-api"

export const useUploadMutation = (setSubmissionID: (e: string[]) => void) => {
  return useMutation<IUploadResponse, AxiosError, FormData>({
    mutationFn: (formData: FormData) => uploadApi.uploadFile(formData),
    onError: (error: AxiosError) => {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    },
    onSuccess: (data: IUploadResponse) => {
      if (
        data.success_submission_ids &&
        data.success_submission_ids.length > 0
      ) {
        setSubmissionID(data.success_submission_ids ?? [])
      } else {
        alert("File upload failed.")
      }
    },
  })
}
export const useCheckBillMutation = (
  onSuccess: (data: IRootBillObject) => void
) => {
  return useMutation<IRootBillObject, AxiosError, IBillForCheck>({
    mutationFn: (formData) => uploadApi.getDataBill(formData),
    onError: (error: AxiosError) => {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    },
    onSuccess: (data: IRootBillObject) => {
      if (data.hddt) {
        onSuccess(data)
        // setSubmissionID(data.success_submission_ids ?? [])
      } else {
        alert("File upload failed.")
      }
    },
  })
}
const copyRowStyle = (sourceRow: ExcelJS.Row, targetRow: ExcelJS.Row) => {
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = targetRow.getCell(colNumber)
    targetCell.style = cell.style // Sao chép style từ hàng nguồn
  })
}
const fetchExcelFile = async (filePath: string) => {
  const response = await fetch(filePath)
  if (!response.ok) throw new Error("Network response was not ok")
  const arrayBuffer = await response.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
// Thêm dữ liệu vào file .xlsx và tải xuống
const addDataToExcelFile = async (filePath: string, newData: any[]) => {
  try {
    // Tải file từ thư mục public
    const response = await fetch(filePath)
    if (!response.ok) throw new Error("Network response was not ok")
    const arrayBuffer = await response.arrayBuffer()

    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)
    const worksheet = workbook.worksheets[0]

    // Xác định hàng chèn vào và hàng nguồn để sao chép style
    const startRowIndex = 3 // Thêm dữ liệu vào từ hàng thứ 3
    const sourceRow = worksheet.getRow(startRowIndex)

    // Dịch chuyển các hàng hiện tại xuống phía dưới
    const rowsToMove = worksheet.rowCount - startRowIndex

    for (let i = worksheet.rowCount; i >= startRowIndex; i--) {
      const row = worksheet.getRow(i)
      const newRow = worksheet.getRow(i + newData.length) // Dịch chuyển xuống hàng
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value
        newRow.getCell(colNumber).style = cell.style // Giữ nguyên style
      })
      row.commit()
      newRow.commit()
    }

    // Thêm dữ liệu mới vào các hàng xác định và áp dụng style từ hàng 3
    newData.forEach((rowData, index) => {
      const row = worksheet.getRow(startRowIndex + index)
      row.values = rowData

      // Sao chép style từ hàng 3 cho các hàng mới
      copyRowStyle(worksheet.getRow(0), row)
      row.commit()
    })

    // Tạo file mới và tải xuống
    const updatedWorkbook = await workbook.xlsx.writeBuffer()
    const blob = new Blob([updatedWorkbook], {
      type: "application/octet-stream",
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "updated_file.xlsx"
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error adding data to Excel file:", error)
  }
}

// Tạo và xuất file .xlsx mới
export const handleExport = () => {
  // Dữ liệu mẫu tương tự như file của bạn
  const data = [
    [
      "Ký hiệu hóa đơn",
      "Số hóa đơn",
      "Tổng tiền thanh toán",
      "Mã số thuế Đơn vị phát hành",
      "Tên Đơn vị phát hành hóa đơn",
      "Tình trạng hóa đơn",
      "Tình trạng bên phát hành",
      "Tên khách hàng mua",
      "Mã số thuế khách hàng mua",
      "Tình trạng khách hàng mua",
      "Time tra cứu",
    ],
    [
      "Ký hiệu hóa đơn",
      "Số hóa đơn",
      "Tổng tiền thanh toán",
      "Mã số thuế Đơn vị phát hành",
      "Tên Đơn vị phát hành hóa đơn",
      "Tình trạng hóa đơn",
      "Tình trạng bên phát hành",
      "Tên khách hàng mua",
      "Mã số thuế khách hàng mua",
      "Tình trạng khách hàng mua",
      "Time tra cứu",
    ],
    [
      "Ký hiệu hóa đơn",
      "Số hóa đơn",
      "Tổng tiền thanh toán",
      "Mã số thuế Đơn vị phát hành",
      "Tên Đơn vị phát hành hóa đơn",
      "Tình trạng hóa đơn",
      "Tình trạng bên phát hành",
      "Tên khách hàng mua",
      "Mã số thuế khách hàng mua",
      "Tình trạng khách hàng mua",
      "Time tra cứu",
    ],
    [
      "Ký hiệu hóa đơn",
      "Số hóa đơn",
      "Tổng tiền thanh toán",
      "Mã số thuế Đơn vị phát hành",
      "Tên Đơn vị phát hành hóa đơn",
      "Tình trạng hóa đơn",
      "Tình trạng bên phát hành",
      "Tên khách hàng mua",
      "Mã số thuế khách hàng mua",
      "Tình trạng khách hàng mua",
      "Time tra cứu",
    ],
  ]
  addDataToExcelFile("/example.xlsx", data)
}

export function createFileDownload(blob: Blob, nameFile: string) {
  try {
    {
      try {
        const file = new File([blob], nameFile, {
          type: "application/json",
        })
        const url = URL.createObjectURL(file)
        const link = document.createElement("a")
        link.href = url
        link.download = nameFile
        link.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
      }
    }
    // resolve('done')
  } catch (error) {
    console.error(error)
  }
}
