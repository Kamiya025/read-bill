import { useState } from "react"
import GetDataWrapper from "./components/ViewData"
import { addDataToExcelFile, useUploadMutation } from "./hook"
import "./style/App.css"

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
              accept="image/*"
              type="file"
              placeholder="Chọn tệp"
              onChange={handleFileUpload}
              style={{
                background: "#fff000",
                padding: 18,
                border: 2,
                borderStyle: "dashed",
                borderRadius: 10,
                height: "50px",
                margin: 10,
              }}
              multiple
            />
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
                    alt="Uploaded file preview"
                    style={{ width: "100px" }}
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
              className="submit"
              onClick={() => {
                addDataToExcelFile(
                  "/example.xlsx",
                  exportData.map((e) => e.data)
                )
              }}
            >
              Xuất file
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
              {submissionsID && (
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
                          data.data?.nmten ?? "",
                          "",
                          data.bonus?.time ?? "",
                        ]
                        updateExportData(id, newData)
                      }}
                    />
                  ))}
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
