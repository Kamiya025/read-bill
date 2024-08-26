import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { IBill, IBillConfidenceScore } from "../api/model"
import { allKeys, useGetData } from "../api/query"
import GetDataBillWrapper, { ChildActionProps } from "./ViewDataBill"
import ViewBillGet from "./ViewDataGet"

function traverseDataSets(
  dataSets: any,
  tag: any,
  output: {
    [key: string]: {
      value: string
      normalized_value: any
      label: string
      display_name: string
      confidence_score: number
    }
  }
) {
  for (let dataSet of dataSets) {
    let { service_label, data_set, value, normalized_value, confidence_score } =
      dataSet
    let { label, display_name } = service_label
    let newTag = tag ? `${tag}.${label}` : label
    if (data_set) traverseDataSets(data_set, newTag, output)
    else
      output[newTag] = {
        value,
        normalized_value,
        label: newTag,
        display_name,
        confidence_score,
      }
  }
}

function GetDataWrapper(props: { submissionID: string }) {
  const [dataSet, setDataSet] = useState<{
    data?: IBill
    submit?: IBill
    score: IBillConfidenceScore
  }>({
    score: {
      nbmst: 1,
      khhdon: 1,
      shdon: 1,
      tgtttbso: 1,
    },
  })
  const refBillFind = useRef<ChildActionProps>(null)
  const getDataBySubmission = useGetData(props.submissionID)
  const debounce = 3000
  const queryClient = useQueryClient()

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    const fetchData = () => {
      if (!getDataBySubmission.data?.documents[0]?.data_set) {
        interval = setInterval(() => {
          getDataBySubmission.refetch()
        }, debounce)
      } else {
        if (
          getDataBySubmission.data &&
          getDataBySubmission.data.documents[0]?.data_set
        ) {
          let document = getDataBySubmission.data.documents[0]
          let dataSets = document.data_set
          let output = Object.create(null)
          traverseDataSets(dataSets, undefined, output)

          let data = {
            nbmst: output["supplier_data.tax_code"].value ?? "",
            khhdon_first:
              output["invoice_data.serial_no"].value?.charAt(0) ?? "",
            khhdon_last:
              output["invoice_data.serial_no"].value?.substring(1) ?? "",
            shdon: output["invoice_data.invoice_no"].value ?? "",
            tgtttbso: output["invoice_data.total_amount"].value
              ? String(
                  Math.floor(Number(output["invoice_data.total_amount"].value))
                )
              : String(
                  Math.floor(Number(output["invoice_data.sub_total"].value))
                ),
          }

          let score = {
            nbmst: output["supplier_data.tax_code"].confidence_score ?? 0,
            khhdon: output["invoice_data.serial_no"].confidence_score ?? 0,
            shdon: output["invoice_data.invoice_no"].confidence_score ?? 0,
            tgtttbso: output["invoice_data.total_amount"].value
              ? output["invoice_data.total_amount"].confidence_score ?? 0
              : output["invoice_data.sub_total"].confidence_score ?? 0,
          }

          let submit = undefined
          if (
            score.khhdon > 0.9 &&
            score.nbmst > 0.9 &&
            score.shdon > 0.9 &&
            score.tgtttbso > 0.9
          ) {
            submit = data
          }

          setDataSet({
            data,
            score,
            submit,
          })
        } else {
          queryClient.invalidateQueries({
            queryKey: allKeys.getDataBySubmissionID(props.submissionID),
          })
        }
      }
    }

    fetchData()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [getDataBySubmission.data, debounce, props.submissionID, queryClient])

  if (
    getDataBySubmission.isLoading ||
    !getDataBySubmission.data?.documents[0]?.data_set
  )
    return (
      <>
        <div>Đang lấy dữ liệu...</div>
        {!getDataBySubmission.data?.documents[0]?.id && (
          <div>Đang quét dữ liệu, vui lòng đợi hệ thống xử lý...</div>
        )}
      </>
    )
  if (getDataBySubmission.isError)
    return <div>Lấy dữ liệu không thành công, vui lòng thử lại sau</div>
  if (getDataBySubmission.isSuccess) {
    return (
      <div className="body">
        <ViewBillGet
          dataSet={dataSet.data}
          submit={(submit) => {
            setDataSet((pre) => ({ ...pre, submit }))
            refBillFind.current?.refetch()
          }}
          dataSetConfidenceScore={dataSet.score}
        />

        <GetDataBillWrapper ref={refBillFind} params={dataSet.submit} />
      </div>
    )
  }
  return <></>
}

export default GetDataWrapper
