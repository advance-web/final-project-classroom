import { Table } from 'antd';

import SubMenu from '../../components/shared/subMenu';

const columns = [
  {
    title: 'Thành phần điểm',
    key: 'scorePart',
    dataIndex: 'scorePart',
  },
  {
    title: '% điểm',
    key: 'percentScore',
    dataIndex: 'percentScore',
  },
  {
    title: 'Số điểm',
    key: 'score',
    dataIndex: 'score',
  },
];

const data = [
  {
    key: '1',
    scorePart: 'Bài tập cá nhân',
    percentScore: 30,
    score: 50,
  },
  {
    key: '2',
    scorePart: 'Giữa kì',
    percentScore: 30,
    score: 75,
  },
  {
    key: '3',
    scorePart: 'Cuối kì',
    percentScore: 40,
    score: 85,
  },
  {
    key: '4',
    scorePart: 'Tổng điểm',
    score: 85,
  },
];

function StudentViewGrade() {
  return (
    <>
      <SubMenu />
      <Table bordered pagination={false} columns={columns} dataSource={data} />
    </>
  );
}

export default StudentViewGrade;
