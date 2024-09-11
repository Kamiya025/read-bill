import axios from "axios"
import axiosClient from "./axios-client"
import {
  IBillForCheck,
  IEinvoices,
  IEinvoiceData,
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
  getDataBill(params: IBillForCheck): Promise<IEinvoiceData> {
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
  checkListDataBill(listData: IBillForCheck[]): Promise<IEinvoices> {
    const url = `https://api.matchs.vnest.vn/api`
    return axiosClient.post(
      url,
      listData.map((e) => ({
        nbmst: e.nbmst,
        khhdon: e.khhdon_last,
        shdon: e.shdon,
        tgtttbso: e.tgtttbso,
      }))
    )
  },
}
export default uploadApi
