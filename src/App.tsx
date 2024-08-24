import { useState } from "react"
import "./style/App.css"
import { useUploadMutation } from "./hook"
import GetDataWrapper from "./components/ViewData"

function App() {
  const [submissionID, setSubmissionID] = useState<string | undefined>(
    undefined
  )
  const [file, setFile] = useState<File | undefined>(undefined)
  const mutation = useUploadMutation(setSubmissionID)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (!file) {
      alert("Please select a file first!")
      setSubmissionID(undefined)
      return
    }
    const formData = new FormData()
    setFile(file)
    formData.append("files", file, file.name)
    mutation.mutate(formData)
  }

  return (
    <div className="App">
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
        />
      </label>

      {submissionID && <GetDataWrapper submissionID={submissionID} />}
    </div>
  )
}

export default App
