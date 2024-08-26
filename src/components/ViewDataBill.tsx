import { forwardRef, useImperativeHandle } from "react"
import { IBill } from "../api/model"
import { useGetDataBill } from "../api/query"
interface GetDataBillWrapperProps {
  params?: IBill
}

export interface ChildActionProps {
  refetch: () => void
}

const GetDataBillWrapper = forwardRef<
  ChildActionProps,
  GetDataBillWrapperProps
>(({ params }, ref) => {
  if (params) return <ViewBill params={params} ref={ref} />
  return <></>
})
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
const ViewBill = forwardRef<ChildActionProps, { params: IBill }>(
  (props, ref) => {
    const getDataByParams = useGetDataBill(props.params)
    useImperativeHandle(ref, () => ({
      refetch: () => {
        if (getDataByParams.isError) getDataByParams.refetch()
      },
    }))
    if (getDataByParams.isLoading) return <div>Đang lấy dữ liệu</div>
    if (getDataByParams.isError)
      return (
        <div>
          <div>Lấy dữ liệu không thành công, vui lòng thử lại sau</div>
          <br />
          <button className="btn" onClick={() => getDataByParams.refetch()}>
            Kiểm tra lại
          </button>
        </div>
      )
    if (getDataByParams.isSuccess) {
      return (
        <div>
          <div className="container">
            <div className="title">Thông tin kiểm tra hóa đơn</div>
            <div className="content">
              {getDataByParams.data.hddt && (
                <ul>
                  <li>
                    {covertCode(
                      getDataByParams.data.hddt?.code,
                      getDataByParams.data.hddt?.status
                    )}
                  </li>
                  <br />
                  {getDataByParams.data.hddt?.statusDesc && (
                    <li>
                      <label>
                        <b>Thông tin</b>
                        <span>{getDataByParams.data.hddt?.statusDesc}</span>
                      </label>
                    </li>
                  )}
                  {getDataByParams.data.hddt.desc && (
                    <li>
                      <label>
                        <b>Mô tả</b>
                        <span>{getDataByParams.data.hddt.desc ?? ""}</span>
                      </label>
                    </li>
                  )}
                  {getDataByParams.data.hddt.reason && (
                    <li>
                      <label>
                        <b>Lý do</b>
                        <span>{getDataByParams.data.hddt.reason}</span>
                      </label>
                    </li>
                  )}
                  {getDataByParams.data.hddt.updatedDate && (
                    <li>
                      <label>
                        <b>Ngày cập nhật</b>
                        <span>
                          {formatDate(getDataByParams.data.hddt.updatedDate)}
                        </span>
                      </label>
                    </li>
                  )}
                  {getDataByParams.data.hddt.refInvoice[0]?.EInvoiceCode && (
                    <li>
                      <label>
                        <b>Ký hiệu hóa đơn</b>
                        <span>
                          {getDataByParams.data.hddt.refInvoice[0].EInvoiceCode}
                        </span>
                      </label>
                    </li>
                  )}
                  {getDataByParams.data.hddt.refInvoice[0]?.EInvoiceNo && (
                    <li>
                      <label>
                        <b>Số hóa đơn</b>
                        <span>
                          {getDataByParams.data.hddt.refInvoice[0].EInvoiceNo}
                        </span>
                      </label>
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="content">
              <ul>
                {getDataByParams.data.nnt?.map((item, index) => (
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
)
export default GetDataBillWrapper
