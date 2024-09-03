import { forwardRef, useImperativeHandle } from "react"
import { IBillForCheck } from "../api/model"
import { useGetDataBill } from "../api/query"
interface GetDataBillWrapperProps {
  params?: IBillForCheck
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
const ViewBill = forwardRef<ChildActionProps, { params: IBillForCheck }>(
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
        <>
          <>
            <td>{getDataByParams.data.hddt?.status}</td>
            <td>
              {covertCode(
                getDataByParams.data.hddt?.code,
                getDataByParams.data.hddt?.status
              )}
            </td>
          </>

          {/* <div className="content">
              <ul>
                {getDataByParams.data.nnt?.map((item, index) => (
                  <li key={index}>
                    <label>
                      <b>{item.key}</b>
                      <span>{item.value}</span>
                    </label>
                  </td>
                ))}
              </ul> */}
        </>
      )
    }
    return <></>
  }
)
export default GetDataBillWrapper
