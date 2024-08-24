import { IBill } from "../api/model"
import { useGetDataBill } from "../api/query"

function GetDataBillWrapper(props: { params?: IBill }) {
  if (props.params) return <ViewBill params={props.params} />
  return <></>
}
function covertCode(code: number) {
  switch (code) {
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
            <ul>{covertCode(getDataBySubmission.data.hddt?.code)}</ul>
          </div>
          <div className="content">
            <ul>
              {getDataBySubmission.data.nnt?.map((item, index) => (
                <li key={index}>
                  <b>{item.key}</b>
                  <span>{item.value}</span>
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
