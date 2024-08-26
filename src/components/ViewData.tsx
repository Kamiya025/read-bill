import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { IBill, IBillConfidenceScore } from "../api/model"
import { allKeys, useGetData } from "../api/query"
import GetDataBillWrapper from "./ViewDataBill"

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
  const getDataBySubmission = useGetData(props.submissionID)
  const debounce = 3000
  const queryClient = useQueryClient()

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

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
        setDataSet({
          data: {
            nbmst: output["supplier_data.tax_code"].value ?? "",
            khhdon_first:
              output["invoice_data.serial_no"].value?.charAt(0) ?? "",
            khhdon_last:
              output["invoice_data.serial_no"].value?.substring(1) ?? "",
            shdon: output["invoice_data.invoice_no"].value ?? "",
            tgtttbso: String(
              Math.floor(Number(output["invoice_data.sub_total"].value))
            ),
          },
          score: {
            nbmst: output["supplier_data.tax_code"].confidence_score ?? 0,
            khhdon: output["invoice_data.serial_no"].confidence_score ?? 0,
            shdon: output["invoice_data.invoice_no"].confidence_score ?? 0,
            tgtttbso: output["invoice_data.sub_total"].confidence_score ?? 0,
          },
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
        <ViewBill
          dataSet={dataSet.data}
          submit={(submit) => setDataSet((pre) => ({ ...pre, submit }))}
          dataSetConfidenceScore={dataSet.score}
        />

        <GetDataBillWrapper params={dataSet.submit} />
      </div>
    )
  }
  return <></>
}
const ViewBill = (props: {
  dataSet?: IBill
  dataSetConfidenceScore: IBillConfidenceScore
  submit: (data: IBill) => void
}) => {
  const { dataSet, dataSetConfidenceScore } = props
  const [dataSetSubmit, setDataSetSubmit] = useState<{
    data?: IBill
  }>({
    data: {
      nbmst: dataSet?.nbmst ?? "",
      khhdon_first: dataSet?.khhdon_first ?? "",
      khhdon_last: dataSet?.khhdon_last ?? "",
      shdon: dataSet?.shdon ?? "",
      tgtttbso: dataSet?.tgtttbso ?? "",
    },
  })
  const dataDefault: IBill = {
    nbmst: "",
    khhdon_last: "",
    khhdon_first: "",
    shdon: "",
    tgtttbso: "",
  }
  useEffect(() => {
    setDataSetSubmit((pre) => ({
      ...pre,
      data: {
        nbmst: dataSet?.nbmst ?? "",
        khhdon_first: dataSet?.khhdon_first ?? "",
        khhdon_last: dataSet?.khhdon_last ?? "",
        shdon: dataSet?.shdon ?? "",
        tgtttbso: dataSet?.tgtttbso ?? "",
      },
    }))
  }, [props.dataSet])
  if (dataSet) {
    return (
      <>
        <div className="container border">
          <div className="title">Tra cứu hóa đơn</div>
          <div className="content">
            <ul>
              <li>
                <Input
                  label="Mã số thuế"
                  value={dataSetSubmit.data?.nbmst}
                  defaultValue={dataSet?.nbmst}
                  onChange={(data) => {
                    setDataSetSubmit((pre) => ({
                      ...pre,
                      data: {
                        ...(pre.data ?? dataDefault),
                        nbmst: data,
                      },
                    }))
                  }}
                  score={dataSetConfidenceScore.nbmst}
                />
              </li>
              <li>
                <Input
                  label="Loại Hóa đơn"
                  value={dataSetSubmit.data?.khhdon_first}
                  defaultValue={dataSet?.khhdon_first}
                  onChange={(data) => {
                    if (data.trim()) {
                      setDataSetSubmit((pre) => ({
                        ...pre,
                        data: {
                          ...(pre.data ?? dataDefault),
                          khhdon_first:
                            data.length <= 2
                              ? data
                                  .replace(pre.data?.khhdon_first ?? "", "")
                                  .toUpperCase()
                              : "",
                        },
                      }))
                    } else
                      setDataSetSubmit((pre) => ({
                        ...pre,
                        data: {
                          ...(pre.data ?? dataDefault),
                          khhdon: "",
                        },
                      }))
                  }}
                  score={dataSetConfidenceScore.khhdon}
                />
              </li>
              <li>
                <Input
                  label="Ký hiệu Hóa đơn"
                  value={dataSetSubmit.data?.khhdon_last}
                  defaultValue={dataSet?.khhdon_last}
                  onChange={(data) => {
                    setDataSetSubmit((pre) => ({
                      ...pre,
                      data: {
                        ...(pre.data ?? dataDefault),
                        khhdon_last: data.toUpperCase(),
                      },
                    }))
                  }}
                  score={dataSetConfidenceScore.khhdon}
                />
              </li>
              <li>
                <Input
                  label="Số hóa đơn"
                  value={dataSetSubmit.data?.shdon}
                  defaultValue={dataSet?.shdon}
                  onChange={(data) => {
                    setDataSetSubmit((pre) => ({
                      ...pre,
                      data: {
                        ...(pre.data ?? dataDefault),
                        shdon: data,
                      },
                    }))
                  }}
                  score={dataSetConfidenceScore.shdon}
                />
              </li>
              <li>
                <Input
                  type="number"
                  label="Tổng số tiền thanh toán"
                  value={dataSetSubmit.data?.tgtttbso}
                  defaultValue={dataSet?.tgtttbso}
                  onChange={(data) => {
                    setDataSetSubmit((pre) => ({
                      ...pre,
                      data: {
                        ...(pre.data ?? dataDefault),
                        tgtttbso: data,
                      },
                    }))
                  }}
                  score={dataSetConfidenceScore.tgtttbso}
                />
              </li>
              <button
                type="button"
                className="submit"
                onClick={() => {
                  console.log(dataSetSubmit.data)
                  if (
                    dataSetSubmit.data &&
                    dataSetSubmit.data.nbmst &&
                    // dataSetSubmit.data.khhdon_first &&
                    dataSetSubmit.data.khhdon_last &&
                    dataSetSubmit.data.shdon &&
                    dataSetSubmit.data.tgtttbso
                  ) {
                    props.submit(dataSetSubmit.data)
                  }
                }}
              >
                Tra cứu
              </button>
            </ul>
          </div>
        </div>
      </>
    )
  }
  return <></>
}
const Input = (props: {
  type?: "text" | "number"
  label: string
  value: string | undefined
  defaultValue: string | undefined
  onChange: (data: string) => void
  message?: string
  score: number
}) => {
  return (
    <label>
      <b>{props.label}</b>
      <div>
        {props.score <= 0.95 || !props.defaultValue ? (
          <input
            type={props.type}
            value={props.value}
            className={`input-bill ${
              (props.message ||
                (props.score < 0.9 && props.value === props.value)) &&
              "input-bill-err"
            }`}
            onChange={(e) => {
              props.onChange(e.currentTarget.value)
            }}
            required
          />
        ) : (
          props.value
        )}
      </div>
    </label>
  )
}
export default GetDataWrapper
