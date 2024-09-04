import { useEffect, useState } from "react"
import GetDataWrapper from "./components/ViewData"
import { addDataToExcelFile, useUploadMutation } from "./hook"
import "./style/App.css"
import { covertCode } from "./common"

function App() {
  const [submissionsID, setSubmissionsID] = useState<string[] | undefined>(
    undefined
  )
  const [exportData, setExportData] = useState<
    { id: string; data: string[] }[]
  >([])
  const [filesSelected, setFilesSelected] = useState<File[] | undefined>(
    undefined
  )
  useEffect(() => {
    document.title = "Danh sách hóa đơn VAT"
  }, [])
  const mutation = useUploadMutation((data) => {
    setSubmissionsID(data)
    setExportData(data.map((e) => ({ id: e, data: [] })))
  })
  const updateExportData = (id: string, newData: string[]) => {
    setExportData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, data: newData } : item
      )
    )
  }
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? e.target.files : null
    if (!files) {
      alert("Please select a file first!")
      setSubmissionsID(undefined)
      setFilesSelected(undefined)
      setExportData([])
      return
    }
    const formData = new FormData()
    setFilesSelected(Array.from(files))
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name)
    }
    mutation.mutate(formData)
  }

  return (
    <>
      <div className="App">
        <div className="left">
          <label>
            <input
              accept="image/*,application/pdf"
              type="file"
              placeholder="Chọn tệp"
              onChange={handleFileUpload}
              multiple
              hidden
            />
            <div className="file-input">
              <div>Chọn/Kéo thả tệp vào đây</div>
            </div>
          </label>
          <div className="items-img">
            {filesSelected &&
              filesSelected.map((file, index) => (
                <label
                  key={file.name + index}
                  className="item-img"
                  onClick={() => {
                    window.open(URL.createObjectURL(file), "_blank")
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    // alt="Uploaded file preview"
                  />
                  <div>{file.name}</div>
                </label>
              ))}
          </div>
        </div>
        <div className="right">
          <div className="export">
            <div>Danh sách hóa đơn VAT</div>
            <button
              className="export-btn"
              onClick={() => {
                console.log(exportData)
                addDataToExcelFile(
                  "/example.xlsx",
                  exportData.map((e) => e.data)
                )
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                />
              </svg>
              <div>Xuất file</div>
            </button>
          </div>
          <div className="container-table">
            <table>
              <tr className="sticky">
                <th>File</th>
                <th>Ký hiệu HĐ</th>
                <th>Số HĐ</th>
                <th>Tổng tiền thanh toán</th>
                <th>MST Đơn vị phát hành</th>
                <th>Đơn vị phát hành</th>
                <th>Tình trạng HĐ</th>
                <th>Ghi chú</th>
                <th>Tên khách hàng mua</th>
                <th>Thời gian tra cứu</th>
                <th className="sticky-x"></th>
              </tr>
              {submissionsID && mutation.isSuccess ? (
                <>
                  {submissionsID.map((id) => (
                    <GetDataWrapper
                      key={id}
                      submissionID={id}
                      onChange={(data) => {
                        const newData: string[] = [
                          data.data?.khhdon_last ?? "",
                          data.data?.shdon ?? "",
                          data.data?.tgtttbso ?? "",
                          data.data?.nbmst ?? "",
                          data.data?.nbten ?? "",
                          data.bonus?.hddt.status?.toString() ?? "",
                          covertCode(
                            data.bonus?.hddt.code,
                            data.bonus?.hddt.status
                          ) ?? "",
                          "",
                          data.data?.nmten ?? "",
                          "",
                          "",
                          data.bonus?.time ?? "",
                        ]
                        updateExportData(id, newData)
                      }}
                    />
                  ))}
                </>
              ) : (
                <td colSpan={11} style={{ height: "80vh" }}>
                  <div className="table-empty">Chưa có giá trị</div>
                </td>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
