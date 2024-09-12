import { convertValueExport } from "./common"
import GetDataWrapper from "./ViewData"

export const TableBill = (props: {
  submissionsID: string[] | undefined
  mutation: any
  updateExportData: (id: string, newData: string[]) => void
}) => {
  return (
    <div className="container-table">
      <table>
        <tr className="sticky">
          <th>File</th>
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
        {props.mutation.isPending ? (
          [...Array(11)].map((_, index) => (
            <tr key={index}>
              {[...Array(11)].map((_, index) => (
                <td key={index}>
                  <div className="is-loading"></div>
                </td>
              ))}
            </tr>
          ))
        ) : props.submissionsID && props.mutation.isSuccess ? (
          props.submissionsID.map((id) => (
            <GetDataWrapper
              key={id}
              submissionID={id}
              onChange={(data) => {
                const newData: string[] = convertValueExport(data)
                props.updateExportData(id, newData)
              }}
            />
          ))
        ) : (
          <tr style={{ height: "78vh" }}>
            <td colSpan={11} className="table-empty">
              <div>Hãy chọn file trước</div>
            </td>
          </tr>
        )}
      </table>
    </div>
  )
}
