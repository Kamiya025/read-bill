import { IBill } from "../api/model"
import { useGetDataBill } from "../api/query"

function GetDataBillWrapper(props: { params?: IBill }) {
  if (props.params) return <ViewBill params={props.params} />
  return <></>
}
function covertCode(code: number, status?: number) {
  if (code === 0) return "Hóa đơn không tồn tại"
  switch (status) {
    case 0:
      return "Hóa đơn không tồn tại"
    case 1:
      return "Hóa đơn mới"
    case 2:
      return "Hóa đơn thay thế"
    case 3:
      return "Hóa đơn điều chỉnh"
    case 4:
      return "Hóa đơn đã bị thay thế"
    case 5:
      return "Hóa đơn đã bị điều chỉnh"
    case 6:
      return "Hóa đơn đã bị hủy"
  }
}
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN")
}
const ViewBill = (props: { params: IBill }) => {
  const getDataBySubmission = useGetDataBill(props.params)
  if (getDataBySubmission.isLoading) return <div>Đang lấy dữ liệu</div>
  if (getDataBySubmission.isError)
    return <div>Lấy dữ liệu không thành công, vui lòng thử lại sau</div>
  if (getDataBySubmission.isSuccess) {
    return (
      <div>
        <div className="container">
          <div className="title">Thông tin kiểm tra hóa đơn</div>
          <div className="content">
            {getDataBySubmission.data.hddt && (
              <ul>
                <li>
                  {covertCode(
                    getDataBySubmission.data.hddt?.code,
                    getDataBySubmission.data.hddt?.status
                  )}
                </li>
                <br />
                {getDataBySubmission.data.hddt?.statusDesc && (
                  <li>
                    <label>
                      <b>Thông tin</b>
                      <span>{getDataBySubmission.data.hddt?.statusDesc}</span>
                    </label>
                  </li>
                )}
                {getDataBySubmission.data.hddt.desc && (
                  <li>
                    <label>
                      <b>Mô tả</b>
                      <span>{getDataBySubmission.data.hddt.desc ?? ""}</span>
                    </label>
                  </li>
                )}
                {getDataBySubmission.data.hddt.reason && (
                  <li>
                    <label>
                      <b>Lý do</b>
                      <span>{getDataBySubmission.data.hddt.reason}</span>
                    </label>
                  </li>
                )}
                {getDataBySubmission.data.hddt.updatedDate && (
                  <li>
                    <label>
                      <b>Ngày cập nhật</b>
                      <span>
                        {formatDate(getDataBySubmission.data.hddt.updatedDate)}
                      </span>
                    </label>
                  </li>
                )}
                {getDataBySubmission.data.hddt.refInvoice[0]?.EInvoiceCode && (
                  <li>
                    <label>
                      <b>Ký hiệu hóa đơn</b>
                      <span>
                        {
                          getDataBySubmission.data.hddt.refInvoice[0]
                            .EInvoiceCode
                        }
                      </span>
                    </label>
                  </li>
                )}
                {getDataBySubmission.data.hddt.refInvoice[0]?.EInvoiceNo && (
                  <li>
                    <label>
                      <b>Số hóa đơn</b>
                      <span>
                        {getDataBySubmission.data.hddt.refInvoice[0].EInvoiceNo}
                      </span>
                    </label>
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="content">
            <ul>
              {getDataBySubmission.data.nnt?.map((item, index) => (
                <li key={index}>
                  <label>
                    <b>{item.key}</b>
                    <span>{item.value}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  return <></>
}
export default GetDataBillWrapper
