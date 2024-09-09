import { useEffect, useState } from "react"
import { IBillForCheck, IRootBillObject } from "../api/model"
import { getEInvoiceNote } from "../common"
import { useCheckBillMutation } from "../hook"
import ViewBillGet, { ViewBillGet2 } from "./ViewDataGet"

export const TableBillExport = (props: {
  data: IBillForCheck[] | undefined
  updateExportData: (id: string, newData: string[]) => void
}) => {
  return (
    <div className="container-table">
      <table>
        <tr className="sticky">
          <th>Ký hiệu HĐ</th>
          <th>Số HĐ</th>
          <th>Tổng tiền thanh toán</th>
          <th>MST Đơn vị phát hành</th>
          <th>Đơn vị phát hành</th>
          <th>Tình trạng HĐ</th>
          <th>Ghi chú</th>
          <th>Tên khách hàng mua</th>
          <th>Thời gian tra cứu</th>
          <th className="sticky-x"></th>
        </tr>
        {props.data ? (
          <>
            {props.data.map((item, index) => (
              <View
                key={index}
                data={item}
                onChange={(bonus) => {
                  const newData: string[] = [
                    (item?.khhdon_first ?? " ") + (item?.khhdon_last ?? ""),
                    item?.shdon ?? "",
                    item?.tgtttbso ?? "",
                    item?.nbmst ?? "",
                    item?.nbten ?? "",
                    bonus?.hddt.status?.toString() ?? "",
                    getEInvoiceNote(bonus?.hddt) ?? "",
                    "",
                    item?.nmten ?? "",
                    "",
                    "",
                    bonus?.time ?? "",
                  ]
                  props.updateExportData(index.toString(), newData)
                }}
              />
            ))}
          </>
        ) : (
          <td colSpan={11} style={{ height: "80vh" }}>
            <div className="table-empty">Hãy chọn file trước</div>
          </td>
        )}
      </table>
    </div>
  )
}
function View(props: {
  data: IBillForCheck
  onChange: (bonus?: IRootBillObject) => void
}) {
  const [bonus, setBonus] = useState<IRootBillObject | undefined>(undefined)
  const mutation = useCheckBillMutation((data) => {
    setBonus(data)
    props.onChange(data)
  })
  useEffect(() => {
    mutation.mutate(props.data)
  }, [props.data])

  return (
    <tr>
      <ViewBillGet2
        dataSet={props.data}
        bonus={bonus}
        isLoadingSubmit={mutation.isPending}
        submit={(submit) => {
          mutation.mutate(submit)
        }}
        dataSetConfidenceScore={{ khhdon: 1, nbmst: 1, shdon: 1, tgtttbso: 1 }}
      />
    </tr>
  )
}
