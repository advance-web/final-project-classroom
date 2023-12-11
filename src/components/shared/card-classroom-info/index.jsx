import { Card, Typography } from 'antd';

export default function CardClassroomInfo(props) {
  const data = props.data;
  return (
    <div>
      <Card
        title={<span style={{ fontSize: '18px' }}>{data.name}</span>}
        bordered={false}
        style={{
          width: 300,
        }}
      >
        <Typography.Paragraph>{data.subject}</Typography.Paragraph>
        <Typography.Paragraph>
          <h5> Giáo viên: </h5>
          {data.teacher.name}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <h5> Mô tả khóa học: </h5> {data.description}
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

CardClassroomInfo.propTypes = {
  data: Object,
};
