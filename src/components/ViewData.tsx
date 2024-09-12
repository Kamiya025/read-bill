import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {
  IBillConfidenceScore,
  IBillForCheck,
  IEinvoiceData,
} from "../api/model"
import { allKeys, useGetData } from "../api/query"
import { useCheckBillMutation } from "../hook"
import ViewBillGet from "./ViewDataGet"
import {
  checkValidate,
  checkValidateScore,
  convertValueOutput,
  traverseDataSets,
} from "./common"

function GetDataWrapper(props: {
  submissionID: string
  onChange: (data: { data?: IBillForCheck; bonus?: IEinvoiceData }) => void
}) {
  const [dataSet, setDataSet] = useState<{
    data?: IBillForCheck
    score: IBillConfidenceScore
    bonus?: IEinvoiceData
  }>({
    score: {
      nbmst: 1,
      khhdon: 1,
      shdon: 1,
      tgtttbso: 1,
    },
  })
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

    const refetch = () => {
      if (interval) clearInterval(interval) // clear any existing interval
      interval = setInterval(() => {
        getDataBySubmission.refetch()
      }, debounce)
    }

    const fetchData = () => {
      let document = getDataBySubmission.data?.documents[0]
      let output = Object.create(null)
      traverseDataSets(document?.data_set, undefined, output)
      const { data, score } = convertValueOutput(output)
      if (
        !checkValidate(data) &&
        getDataBySubmission.data?.status === "processing"
      ) {
        refetch()
      } else {
        if (checkValidateScore(score)) {
          mutation.mutate(data)
        }
        setDataSet({
          data,
          score,
        })
      }
    }

    fetchData()
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [getDataBySubmission.data, debounce, props.submissionID, queryClient])

  if (
    getDataBySubmission.isLoading ||
    !getDataBySubmission.data?.documents[0]?.data_set
  )
    return (
      <tr>
        {[...Array(11)].map((_, index) => (
          <td key={index}>
            <div className="is-loading"></div>
          </td>
        ))}
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
      </tr>
    )
  }
  return <></>
}

export default GetDataWrapper
