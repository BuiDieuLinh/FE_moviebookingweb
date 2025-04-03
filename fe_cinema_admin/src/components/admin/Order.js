import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import { InputGroup, Form, Table } from 'react-bootstrap';
import './order.css'

export const Order = () => {
  return (
    <div className='order-container'>
        <div className='d-flex justify-content-between'>
            <Button variant='info' size='sm'> <i class="fas fa-redo-alt"></i> Refesh</Button> 
            <InputGroup className=" w-25" size='sm' >
                <Button variant="outline-secondary" id="btnSearch">
                <i class="fas fa-search"></i>
                </Button>
                <Form.Control type="date" size='sm'/>
            </InputGroup>
        </div>

        {/* Danh sách vé đặt */}
        <div className="table-responsive rounded-2 mt-2">
          <Table hover>
            <thead>
              <tr className="p-4">
                <th>Tên phim</th>
                <th>Suất chiếu</th>
                <th>Phòng chiếu</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className='text-danger'><i class="fas fa-info-circle text-danger"></i></td>
            </tbody>
          </Table>
        </div>
    </div>
  )
}
export default Order;
