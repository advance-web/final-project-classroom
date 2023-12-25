import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import { getAllGradeReviewsOfClassroom } from '../../services/grade';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '20%',
  },
  {
    title: 'Chi tiết phúc khảo',
    dataIndex: 'review',
    width: '20%',
    render: () => <Link to="">Chi tiết</Link>,
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

export default function GradeReview() {
  const [listReviews, setListReviews] = useState([]);
  const location = useLocation();

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const getAllGradeReviews = async (idClass) => {
      const dataRespond = await getAllGradeReviewsOfClassroom(idClass);
      const gradReviewRes = dataRespond.data.data;
      console.log('Data respond: ', gradReviewRes);
    };
    getAllGradeReviews(idClass);
  }, [idClass]);

  return (
    <div>
      <SubMenu></SubMenu>
      <Table columns={columns} dataSource={data} />;
    </div>
  );
}
