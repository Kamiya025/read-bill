import { useEffect, useState } from "react"
import {
  IBillConfidenceScore,
  IBillForCheck,
  IEinvoiceData,
  IFile,
} from "../api/model"
import { checkValidate, getEInvoiceNote } from "./common"

export const ViewBillGet = (props: {
  file?: IFile
  dataSet?: IBillForCheck
  bonus?: IEinvoiceData
  dataSetConfidenceScore: IBillConfidenceScore
  submit: (data: IBillForCheck) => void
  isLoadingSubmit: boolean
}) => {
  const { dataSet, dataSetConfidenceScore } = props
  const [dataSetSubmit, setDataSetSubmit] = useState<{
    data?: IBillForCheck
  }>({
    data: {
      nbmst: dataSet?.nbmst ?? "",
      khhdon_first: dataSet?.khhdon_first ?? "",
      khhdon_last: dataSet?.khhdon_last ?? "",
      shdon: dataSet?.shdon ?? "",
      tgtttbso: dataSet?.tgtttbso ?? "",
    },
  })
  const dataDefault: IBillForCheck = {
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
        nbten: dataSet?.nbten,
        nmten: dataSet?.nmten,
      },
    }))
  }, [props.dataSet])
  if (dataSet) {
    return (
      <>
        <td className="file-td">{props.file?.name}</td>
        <td>
          <div className="flex">
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
              short
            />
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
          </div>
        </td>
        <td>
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
        </td>
        <td>
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
        </td>
        <td>
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
        </td>
        <td>{dataSetSubmit.data?.nbten ?? ""}</td>
        <td>
          {props.isLoadingSubmit ? (
            <div className="is-loading" />
          ) : (
            props.bonus?.hddt?.status
          )}
        </td>
        <td className="note">
          {props.isLoadingSubmit ? (
            <div className="is-loading" />
          ) : (
            getEInvoiceNote(props.bonus?.hddt)
          )}
        </td>
        <td>{props.dataSet?.nmten ?? ""}</td>
        <td>
          {props.isLoadingSubmit ? (
            <div className="is-loading" />
          ) : (
            props.bonus?.time
          )}
        </td>
        <td className="sticky-x">
          {!props.isLoadingSubmit && checkValidate(dataSetSubmit.data) ? (
            <button
              type="button"
              className="submit-none"
              disabled={props.isLoadingSubmit}
              onClick={() => {
                console.log(dataSetSubmit.data)
                if (dataSetSubmit.data && checkValidate(dataSetSubmit.data)) {
                  props.submit(dataSetSubmit.data)
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          ) : (
            <div className="submit-none is-loading" />
          )}
        </td>
      </>
    )
  }
  return <></>
}
export const ViewBillGet2 = (props: {
  dataSet?: IBillForCheck
  bonus?: IEinvoiceData
  dataSetConfidenceScore: IBillConfidenceScore
  submit: (data: IBillForCheck) => void
  isLoadingSubmit: boolean
}) => {
  const { dataSet, dataSetConfidenceScore } = props
  const [dataSetSubmit, setDataSetSubmit] = useState<{
    data?: IBillForCheck
  }>({
    data: {
      nbmst: dataSet?.nbmst ?? "",
      khhdon_first: dataSet?.khhdon_first ?? "",
      khhdon_last: dataSet?.khhdon_last ?? "",
      shdon: dataSet?.shdon ?? "",
      tgtttbso: dataSet?.tgtttbso ?? "",
    },
  })
  const dataDefault: IBillForCheck = {
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
        nbten: dataSet?.nbten,
        nmten: dataSet?.nmten,
      },
    }))
  }, [props.dataSet])
  if (dataSet) {
    return (
      <>
        <td>
          <div className="flex">
            <Input
              label="Loại Hóa đơn"
              value={dataSetSubmit.data?.khhdon_first}
              defaultValue={dataSet?.khhdon_first}
              onChange={(data) => {
                setDataSetSubmit((pre) => ({
                  ...pre,
                  data: {
                    ...(pre.data ?? dataDefault),
                    khhdon_first: data.toUpperCase(),
                  },
                }))
              }}
              score={dataSetConfidenceScore.khhdon}
              short
            />
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
          </div>
        </td>
        <td>
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
        </td>
        <td>
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
        </td>
        <td>
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
        </td>
        <td>{dataSetSubmit.data?.nbten ?? ""}</td>
        <td>{props.bonus?.hddt?.status}</td>
        <td className="note">{getEInvoiceNote(props.bonus?.hddt)}</td>
        <td>{props.dataSet?.nmten ?? ""}</td>
        <td>{props.bonus?.time}</td>
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
  short?: boolean
}) => {
  if (props.score <= 0.9 || !props.defaultValue)
    return (
      <input
        type={props.type}
        value={props.value}
        className={`input-bill ${props.short && "input-bill-short"} ${
          (props.message ||
            (props.score < 0.9 && props.value === props.value)) &&
          "input-bill-err"
        }`}
        onChange={(e) => {
          props.onChange(e.currentTarget.value)
        }}
        required
      />
    )
  return <>{props.value}</>
}
export default ViewBillGet
