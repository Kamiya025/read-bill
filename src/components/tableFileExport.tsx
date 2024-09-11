import { useEffect } from "react"
import { IBillForCheck, IEinvoiceData } from "../api/model"
import { useCheckListDataBill } from "../api/query"
import { ViewBillGet2 } from "./ViewDataGet"
import { convertValueExport } from "./common"

export const TableBillExport = (props: {
  data: IBillForCheck[]
  updateExportData: (value: { id: string; data: string[] }[]) => void
}) => {
  const check = useCheckListDataBill(props.data)
  useEffect(() => {
    if (check.isSuccess) {
      props.updateExportData(
        props.data.map((e, index) => ({
          id: index.toString(),
          data: convertValueExport({
            data: e,
            bonus: check.data.einvoices[index]?.data,
          }),
        }))
      )
    }
  }, [check.status])
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
        </tr>
        {props.data && check.isSuccess ? (
          <>
            {props.data.map((item, index) => {
              // const newData: string[] = convertValueExport({
              //   data: item,
              //   bonus: check.data.einvoices[index]?.data,
              // })
              // props.updateExportData(index.toString(), newData)
              return (
                <View
                  key={index}
                  data={item}
                  bonus={check.data.einvoices[index]?.data}
                />
              )
            })}
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
function View(props: { data: IBillForCheck; bonus?: IEinvoiceData }) {
  return (
    <tr>
      <ViewBillGet2
        dataSet={props.data}
        bonus={props.bonus}
        isLoadingSubmit={false}
        submit={(submit) => {}}
        dataSetConfidenceScore={{ khhdon: 1, nbmst: 1, shdon: 1, tgtttbso: 1 }}
      />
    </tr>
  )
}
