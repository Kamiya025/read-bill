import { useState } from "react"
import "./style/App.css"
import { useUploadMutation } from "./hook"
import GetDataWrapper from "./components/ViewData"

function App() {
  const [submissionID, setSubmissionID] = useState<string[] | undefined>(
    undefined
  )
  const [filesSelected, setFilesSelected] = useState<File[] | undefined>(
    undefined
  )
  const mutation = useUploadMutation(setSubmissionID)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? e.target.files : null
    if (!files) {
      alert("Please select a file first!")
      setSubmissionID(undefined)
      setFilesSelected(undefined)
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
            <button className="submit">Xuất file</button>
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
              {submissionID && (
                <>
                  {submissionID.map((e) => (
                    <GetDataWrapper submissionID={e} />
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
