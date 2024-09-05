import { useEffect, useState } from "react"
import {
  IBillConfidenceScore,
  IBillForCheck,
  IFile,
  IRootBillObject,
} from "../api/model"
import { covertCode, getEInvoiceNote } from "../common"

export const ViewBillGet = (props: {
  file?: IFile
  dataSet?: IBillForCheck
  bonus?: IRootBillObject
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
        {/* <div className="container border">
          <div className="title">Tra cứu hóa đơn</div>
          <div className="content"> */}
        <>
          <td className="file-td">{props.file?.name}</td>
          <td>
            {/* <Input
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
            /> */}
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
          <td>{props.bonus?.hddt.status}</td>
          <td className="note">{getEInvoiceNote(props.bonus?.hddt)}</td>
          <td>{props.dataSet?.nmten ?? ""}</td>
          <td>{props.bonus?.time}</td>
          <td className="sticky-x">
            {!props.isLoadingSubmit &&
              dataSetSubmit.data &&
              dataSetSubmit.data.nbmst &&
              dataSetSubmit.data.khhdon_last &&
              dataSetSubmit.data.shdon &&
              dataSetSubmit.data.tgtttbso && (
                <button
                  type="button"
                  className="submit sq"
                  disabled={props.isLoadingSubmit}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    width={10}
                    height={10}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              )}
          </td>
        </>
        {/* </div>
        </div> */}
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
      {/* <b>{props.label}</b> */}
      <div>
        {props.score <= 0.9 || !props.defaultValue ? (
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
