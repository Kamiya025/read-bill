import { useQuery } from "@tanstack/react-query"
import uploadApi from "../upload-api"
import { IBillForCheck } from "../model"
export const allKeys = {
  all: ["allKeys"] as const,
  getDataBySubmissionID: (submissionID: string) =>
    [...allKeys.all, submissionID, "getDataBySubmissionID"] as const,
  getDataBill: (params: IBillForCheck) =>
    [...allKeys.all, params, "getDataBill"] as const,
  checkListDataBill: (params: IBillForCheck[]) =>
    [...allKeys.all, params, "checkListDataBill"] as const,
}
export function useGetData(submissionID: string) {
  return useQuery({
    queryKey: allKeys.getDataBySubmissionID(submissionID),
    queryFn: () => uploadApi.getData(submissionID),
  })
}
export function useGetDataBill(params: IBillForCheck) {
  return useQuery({
    queryKey: allKeys.getDataBill(params),
    queryFn: () => uploadApi.getDataBill(params),
  })
}
export function useCheckListDataBill(data: IBillForCheck[]) {
  return useQuery({
    queryKey: allKeys.checkListDataBill(data),
    queryFn: () => uploadApi.checkListDataBill(data),
  })
}
