import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {
  IBillConfidenceScore,
  IBillForCheck,
  IRootBillObject,
} from "../api/model"
import { allKeys, useGetData } from "../api/query"
import { useCheckBillMutation } from "../hook"
import ViewBillGet from "./ViewDataGet"

function traverseDataSets(
  dataSets: any[],
  tag = "",
  output: Record<
    string,
    {
      value: string
      normalized_value: any
      label: string
      display_name: string
      confidence_score: number
    }
  >
) {
  dataSets.forEach(
    ({
      service_label,
      data_set,
      value,
      normalized_value,
      confidence_score,
    }) => {
      const newTag = tag ? `${tag}.${service_label.label}` : service_label.label
      if (data_set) {
        traverseDataSets(data_set, newTag, output)
      } else {
        output[newTag] = {
          value,
          normalized_value,
          label: newTag,
          display_name: service_label.display_name,
          confidence_score,
        }
      }
    }
  )
}

function GetDataWrapper(props: {
  submissionID: string
  onChange: (data: { data?: IBillForCheck; bonus?: IRootBillObject }) => void
}) {
  const [dataSet, setDataSet] = useState<{
    data?: IBillForCheck
    submit?: IBillForCheck
    score: IBillConfidenceScore
    bonus?: IRootBillObject
  }>({
    score: {
      nbmst: 1,
      khhdon: 1,
      shdon: 1,
      tgtttbso: 1,
    },
  })
  // const refBillFind = useRef<ChildActionProps>(null)
  const getDataBySubmission = useGetData(props.submissionID)
  const debounce = 1000
  const queryClient = useQueryClient()
  const mutation = useCheckBillMutation((data, variables) => {
    setDataSet((pre) => ({
      ...pre,
      data: variables,
      bonus: data,
    }))
  })
  useEffect(() => {
    if (dataSet.data || dataSet.bonus) props.onChange(dataSet)
  }, [dataSet])
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
            nbmst: output["supplier_data.tax_code"]?.value ?? "",
            khhdon_first:
              output["invoice_data.serial_no"]?.value?.charAt(0) ?? "",
            khhdon_last:
              output["invoice_data.serial_no"]?.value?.substring(1) ?? "",
            shdon: output["invoice_data.invoice_no"]?.value ?? "",
            tgtttbso: output["invoice_data.total_amount"]?.value
              ? String(
                  Math.floor(Number(output["invoice_data.total_amount"]?.value))
                )
              : String(
                  Math.floor(Number(output["invoice_data.sub_total"]?.value))
                ),
            nbten: output["supplier_data.supplier"]?.value ?? "",
            nmten:
              output["purchaser_data.purchaser_name"]?.value ??
              output["purchaser_data.buyer_name"]?.value ??
              "",
          }

          let score = {
            nbmst: output["supplier_data.tax_code"]?.confidence_score ?? 0,
            khhdon: output["invoice_data.serial_no"]?.confidence_score ?? 0,
            shdon: output["invoice_data.invoice_no"]?.confidence_score ?? 0,
            tgtttbso: output["invoice_data.total_amount"]?.value
              ? output["invoice_data.total_amount"]?.confidence_score ?? 0
              : output["invoice_data.sub_total"]?.confidence_score ?? 0,
          }

          let submit = undefined
          if (
            score.khhdon > 0.9 &&
            score.nbmst > 0.9 &&
            score.shdon > 0.9 &&
            score.tgtttbso > 0.9
          ) {
            submit = data
            mutation.mutate(data)
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
    // mutation.isPending ||
    !getDataBySubmission.data?.documents[0]?.data_set
  )
    return (
      <tr>
        <td colSpan={11}>
          <div>Đang lấy dữ liệu...</div>
        </td>
      </tr>
    )
  if (getDataBySubmission.isError)
    return (
      <tr>
        <td colSpan={11}>Lấy dữ liệu không thành công, vui lòng thử lại sau</td>
      </tr>
    )
  if (getDataBySubmission.isSuccess) {
    return (
      <tr>
        <ViewBillGet
          file={getDataBySubmission.data.files[0]}
          dataSet={dataSet.data}
          bonus={dataSet.bonus}
          isLoadingSubmit={mutation.isPending}
          submit={(submit) => {
            setDataSet((pre) => ({ ...pre, submit }))
            mutation.mutate(submit)
          }}
          dataSetConfidenceScore={dataSet.score}
        />

        {/* <GetDataBillWrapper ref={refBillFind} params={dataSet.submit} /> */}
      </tr>
    )
  }
  return <></>
}

export default GetDataWrapper
