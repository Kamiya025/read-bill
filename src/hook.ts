import { useMutation } from "@tanstack/react-query"
import { IBillForCheck, IRootBillObject, IUploadResponse } from "./api/model"
import { AxiosError } from "axios"
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
