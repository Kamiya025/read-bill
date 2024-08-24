import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { allKeys, useGetData } from "../api/query"
import { IBill, IBillConfidenceScore } from "../api/model"
import GetDataBillWrapper from "./ViewDataBill"

function traverseDataSets(dataSets: any, tag: any, output: any) {
  for (let dataSet of dataSets) {
    let { service_label, data_set, value, normalized_value, confidence_score } =
      dataSet
    let { label, display_name } = service_label
    let newTag = tag ? `${tag}.${label}` : label
    if (data_set) traverseDataSets(data_set, newTag, output)
    else
      output[newTag] = { value, normalized_value, label: newTag, display_name }
  }
}

function GetDataWrapper(props: { submissionID: string }) {
  const [dataSet, setDataSet] = useState<IBill | undefined>(undefined)
  const [dataSetConfidenceScore, setDataSetConfidenceScore] =
    useState<IBillConfidenceScore>({
      nbmst: 1,
      khhdon: 1,
      shdon: 1,
      tgtttbso: 1,
    })
  const [dataSetSubmit, setDataSetSubmit] = useState<IBill | undefined>(
    undefined
  )
  const getDataBySubmission = useGetData(props.submissionID)
  const debounce = 3000
  const queryClient = useQueryClient()

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (getDataBySubmission.data?.status === "processing") {
      interval = setInterval(() => {
        getDataBySubmission.refetch()
      }, debounce)
    } else {
      if (
        getDataBySubmission.data &&
        getDataBySubmission.data.status != "processing"
      ) {
        let document = getDataBySubmission.data.documents[0]
        let dataSets = document.data_set
        let output = Object.create(null)
        traverseDataSets(dataSets, undefined, output)
        setDataSet({
          nbmst: output["supplier_data.tax_code"].value,
          khhdon: output["invoice_data.serial_no"].value?.substring(1),
          shdon: output["invoice_data.invoice_no"].value,
          tgtttbso: Math.floor(Number(output["invoice_data.sub_total"].value)),
        })
        setDataSetConfidenceScore({
          nbmst: output["supplier_data.tax_code"].confidence_score ?? 1,
          khhdon: output["invoice_data.serial_no"].confidence_score ?? 1,
          shdon: output["invoice_data.invoice_no"].confidence_score ?? 1,
          tgtttbso: output["invoice_data.sub_total"].confidence_score ?? 1,
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: allKeys.getDataBySubmissionID(props.submissionID),
        })
      }
      clearInterval(interval)
    }

    return () => clearInterval(interval) // Clear interval khi component unmount hoặc data thay đổi
  }, [getDataBySubmission.data, getDataBySubmission.refetch])
  if (
    getDataBySubmission.isLoading ||
    getDataBySubmission.data?.status === "processing"
  )
    return (
      <>
        <div>Đang lấy dữ liệu...</div>
        {getDataBySubmission.data?.status === "processing" && (
          <div>Đang quét dữ liệu, vui lòng đợi hệ thống xử lý...</div>
        )}
      </>
    )
  if (getDataBySubmission.isError)
    return <div>Lấy dữ liệu không thành công, vui lòng thử lại sau</div>
  if (getDataBySubmission.isSuccess) {
    return (
      <div className="body">
        <ViewBill
          dataSet={dataSet}
          submit={() => setDataSetSubmit(dataSet)}
          dataSetConfidenceScore={dataSetConfidenceScore}
        />

        <GetDataBillWrapper params={dataSetSubmit} />
      </div>
    )
  }
  return <></>
}
const ViewBill = (props: {
  dataSet?: IBill
  dataSetConfidenceScore: IBillConfidenceScore
  submit: () => void
}) => {
  const { dataSet, dataSetConfidenceScore } = props
  if (dataSet)
    return (
      <>
        <div className="container border">
          <div className="title">Tra cứu hóa đơn</div>
          <div className="content">
            <ul>
              <li>
                <b>Mã số thuế</b>
                <span
                  className={
                    dataSetConfidenceScore?.nbmst < 0.95 ? "erorr" : ""
                  }
                >
                  {dataSet?.nbmst}
                </span>
              </li>
              <li>
                <b>Loại Hóa đơn</b>
                <span
                  className={
                    dataSetConfidenceScore?.khhdon < 0.95 ? "erorr" : ""
                  }
                >
                  {dataSet?.khhdon?.charAt(0)}
                </span>
              </li>
              <li>
                <b>Ký hiệu Hóa đơn</b>
                <span
                  className={
                    dataSetConfidenceScore?.khhdon < 0.95 ? "erorr" : ""
                  }
                >
                  {dataSet?.khhdon?.charAt(1)}
                </span>
              </li>
              <li>
                <b>Số hóa đơn</b>
                <span
                  className={
                    dataSetConfidenceScore?.shdon < 0.95 ? "erorr" : ""
                  }
                >
                  {dataSet?.shdon}
                </span>
              </li>
              <li>
                <b>Tổng số tiền thanh toán</b>
                <span
                  className={
                    dataSetConfidenceScore?.tgtttbso < 0.95 ? "erorr" : ""
                  }
                >
                  {dataSet?.tgtttbso}
                </span>
              </li>
              <button type="button" className="submit" onClick={props.submit}>
                Tra cứu
              </button>
            </ul>
          </div>
        </div>
      </>
    )
  return <></>
}
export default GetDataWrapper
