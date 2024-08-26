import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { IBill, IBillConfidenceScore } from "../api/model"
import { allKeys, useGetData } from "../api/query"
import GetDataBillWrapper from "./ViewDataBill"

export const ViewBillGet = (props: {
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
export default ViewBillGet
