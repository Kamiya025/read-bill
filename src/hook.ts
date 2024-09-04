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
      alert("Tải file lên thất bại.")
      setSubmissionID([])
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
      alert("Kiểm tra thông tin thất bại")
    },
    onSuccess: (data: IRootBillObject) => {
      if (data.hddt) {
        onSuccess(data)
      } else {
        alert("Kiểm tra thông tin thất bại")
      }
    },
  })
}

const copyRowStyle = (sourceRow: ExcelJS.Row, targetRow: ExcelJS.Row) => {
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = targetRow.getCell(colNumber)
    targetCell.value = ""
    targetCell.style = JSON.parse(JSON.stringify(cell.style)) // Sao chép toàn bộ style từ cell nguồn
  })
}
const copyRow = (sourceRow: ExcelJS.Row, targetRow: ExcelJS.Row) => {
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = targetRow.getCell(colNumber)
    targetCell.value = cell.value
    targetCell.style = JSON.parse(JSON.stringify(cell.style)) // Sao chép toàn bộ style từ cell nguồn
  })
}
const repalceValueRow = (sourceRow: ExcelJS.Row, targetRow: ExcelJS.Row) => {
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = targetRow.getCell(colNumber)
    targetCell.value = cell.value
    targetCell.style = JSON.parse(JSON.stringify(targetCell.style)) // Sao chép toàn bộ style từ cell nguồn
  })
}
export const addDataToExcelFile = async (filePath: string, newData: any[]) => {
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
    // Dịch chuyển các hàng hiện tại xuống phía dưới
    if (newData.length > 1) {
      for (let i = worksheet.rowCount; i > startRowIndex; i--) {
        const row = worksheet.getRow(i)
        const newRow = worksheet.getRow(i + newData.length) // Dịch chuyển xuống hàng
        copyRow(row, newRow)
        copyRowStyle(sourceRow, row)
        row.commit()
        newRow.commit()
      }
    }

    // Thêm dữ liệu mới vào các hàng xác định và áp dụng style từ hàng 3
    newData.forEach((rowData, index) => {
      const row = worksheet.getRow(startRowIndex + index)
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = row.getCell(colNumber)
        newCell.value = rowData[colNumber - 1] || cell.value // Giữ nguyên giá trị cũ nếu không có dữ liệu mới
        // Giữ nguyên style của hàng hiện tại
        newCell.style = { ...cell.style }
      })
      row.commit()
    })
    // Tạo file mới và tải xuống
    const updatedWorkbook = await workbook.xlsx.writeBuffer()
    const blob = new Blob([updatedWorkbook], {
      type: "application/octet-stream",
    })
    createFileDownload(blob, "export_file.xlsx")
  } catch (error) {
    console.error("Error adding data to Excel file:", error)
  }
}

function createFileDownload(blob: Blob, nameFile: string) {
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
