import axios from "axios"
import axiosClient from "./axios-client"
import {
  IBill,
  IRootBillObject,
  IUploadBody,
  IUploadResponse,
  RootObjectDataSubmission,
} from "./model"

const uploadApi = {
  uploadFile(formData: FormData): Promise<IUploadResponse> {
    const folderID = process.env.REACT_APP_API_folderID
    const url = `/folders/${folderID}/submissions`
    const headers = {
      "Content-Type": "multipart/form-data",
    }
    return axiosClient.post(url, formData, { headers })
  },
  getData(submissionID: string): Promise<RootObjectDataSubmission> {
    const url = `/submissions/${submissionID}/data`

    return axiosClient.get(url)
  },
  getDataBill(params: IBill): Promise<IRootBillObject> {
    const url = `https://api.matchs.vnest.vn/api`

    return axiosClient.get(url, {
      params: {
        nbmst: params.nbmst,
        khhdon: params.khhdon_last,
        shdon: params.shdon,
        tgtttbso: params.tgtttbso,
      },
    })
  },
}
export default uploadApi
