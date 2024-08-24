import { useQuery } from "@tanstack/react-query"
import uploadApi from "../upload-api"
import { IBill } from "../model"
export const allKeys = {
  all: ["allKeys"] as const,
  getDataBySubmissionID: (submissionID: string) =>
    [...allKeys.all, submissionID, "getDataBySubmissionID"] as const,
  getDataBill: (params: IBill) =>
    [...allKeys.all, params, "getDataBill"] as const,
}
export function useGetData(submissionID: string) {
  return useQuery({
    queryKey: allKeys.getDataBySubmissionID(submissionID),
    queryFn: () => uploadApi.getData(submissionID),
  })
}
export function useGetDataBill(params: IBill) {
  return useQuery({
    queryKey: allKeys.getDataBill(params),
    queryFn: () => uploadApi.getDataBill(params),
  })
}
